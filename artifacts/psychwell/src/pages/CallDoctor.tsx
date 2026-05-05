import { useState, useEffect, useRef, type FormEvent } from "react";
import { useLocation } from "wouter";
import { PhoneOff, Send, Stethoscope, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/lang-context";
import { store, uid, type ChatMessage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function CallDoctor() {
  const { t, lang } = useLang();
  const [, navigate] = useLocation();
  const user = store.getUser();
  const [messages, setMessages] = useState<ChatMessage[]>(() => store.getChat().doctor);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const all = store.getChat();
    all.doctor = messages;
    store.setChat(all);
  }, [messages]);

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
      const res = await fetch(`${import.meta.env.BASE_URL}api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          language: lang,
          persona: "doctor",
          userName: user?.name,
        }),
      });
      if (!res.ok || !res.body) throw new Error("net");
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
            // ignore
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: lang === "ur" ? "رابطہ منقطع، دوبارہ کوشش کریں۔" : "Connection lost, please try again." }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-3xl flex-col">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-6 text-primary-foreground shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary-foreground/30" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur">
              <Stethoscope className="h-7 w-7" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest opacity-80">{messages.length === 0 ? t("call_starting") : t("doctor_on_call")}</p>
            <p className="mt-1 font-mono text-xl font-semibold">{mins}:{secs}</p>
          </div>
          <Button
            variant="destructive"
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="gap-2 rounded-full"
            data-testid="button-end-call"
          >
            <PhoneOff className="h-4 w-4" />
            {t("end_call")}
          </Button>
        </div>
        <p className="mt-4 text-xs opacity-80">{t("speak_freely")}</p>
      </div>

      <div
        ref={scrollRef}
        className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-border bg-card/50 p-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            <Mic className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">{t("chat_intro_doctor")}</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              )}
            >
              {m.content || <span className="opacity-60 text-xs">{t("thinking")}</span>}
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
        />
        <Button type="submit" size="icon" disabled={!input.trim() || streaming} className="h-12 w-12 shrink-0 rounded-xl">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
