import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/lang-context";
import { store, uid, type ChatMessage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function Chat({
  persona = "therapist",
}: {
  persona?: "therapist" | "doctor";
}) {
  const { t, lang } = useLang();
  const user = store.getUser();
  const [messages, setMessages] = useState<ChatMessage[]>(() => store.getChat()[persona]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const all = store.getChat();
    all[persona] = messages;
    store.setChat(all);
  }, [messages, persona]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    if (!input.trim() || streaming) return;
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    const assistantId = uid();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() },
    ]);

    try {
      const url = `${import.meta.env.BASE_URL}api/ai/chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          language: lang,
          persona,
          userName: user?.name,
        }),
      });
      if (!res.ok || !res.body) throw new Error("network");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const data = JSON.parse(line.slice(5).trim());
            if (data.content) {
              acc += data.content;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m))
              );
            }
            if (data.done) break;
          } catch {
            // ignore parse errors for keepalives
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  lang === "ur"
                    ? "معذرت، رابطے میں مسئلہ ہے۔ ایک لمحے بعد دوبارہ کوشش کریں۔"
                    : "Sorry, I had trouble connecting. Please try again in a moment.",
              }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }

  const intro = persona === "therapist" ? "chat_intro_therapist" : "chat_intro_doctor";

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col">
      <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("not_substitute")}</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card/50 p-4 md:p-6"
      >
        {messages.length === 0 && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">{t(intro)}</p>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
              data-testid={`message-${m.role}`}
            >
              {m.content || (
                <span className="inline-flex items-center gap-1 text-xs opacity-60">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  {t("thinking")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="mt-3 flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={t("type_message")}
          rows={1}
          className="min-h-[48px] resize-none rounded-xl"
          data-testid="input-chat"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || streaming}
          className="h-12 w-12 shrink-0 rounded-xl"
          data-testid="button-send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
