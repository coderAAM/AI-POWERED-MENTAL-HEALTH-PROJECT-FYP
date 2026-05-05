import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useLang } from "@/lib/lang-context";
import { store, uid, todayIso, type MoodEntry } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { TranslationKey } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const moodOptions: { value: number; key: TranslationKey }[] = [
  { value: 1, key: "mood_1" },
  { value: 2, key: "mood_2" },
  { value: 3, key: "mood_3" },
  { value: 4, key: "mood_4" },
  { value: 5, key: "mood_5" },
];

const emotionOptions: TranslationKey[] = [
  "emotion_happy",
  "emotion_sad",
  "emotion_anxious",
  "emotion_angry",
  "emotion_numb",
  "emotion_hopeful",
  "emotion_tired",
  "emotion_calm",
];

export default function Mood() {
  const { t } = useLang();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MoodEntry[]>(() => store.getMood());
  const [mood, setMood] = useState<number>(3);
  const [note, setNote] = useState("");
  const [emotion, setEmotion] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (cameraOn && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [cameraOn]);

  async function startCamera() {
    setCameraDenied(false);
    setCameraError("");
    setCameraLoading(true);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      setCameraLoading(false);
      setCameraDenied(true);
      setCameraError("Camera API not available. Open this app in a secure browser tab (HTTPS or localhost) and allow camera access.");
      return;
    }

    try {
      const isSecureContextBlocked =
        typeof window !== "undefined" &&
        !window.isSecureContext &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";

      if (isSecureContextBlocked) {
        setCameraDenied(true);
        setCameraError("Camera works only on HTTPS (or localhost). Open the secure app URL, then allow camera.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setCameraError("Permission denied. Allow camera access in your browser settings and try again.");
        setCameraDenied(true);
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device.");
        setCameraDenied(false);
      } else if (name === "NotReadableError" || name === "TrackStartError") {
        setCameraError("Camera is in use by another application. Close it and try again.");
        setCameraDenied(false);
      } else {
        setCameraError("Could not start camera. Make sure the page is served over HTTPS.");
        setCameraDenied(false);
      }
    } finally {
      setCameraLoading(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }

  function save() {
    const entry: MoodEntry = {
      id: uid(),
      date: todayIso(),
      mood,
      label: t(moodOptions.find((m) => m.value === mood)!.key),
      note: note.trim(),
      emotion: emotion ? t(emotion as TranslationKey) : undefined,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...entries.filter((e) => e.date !== entry.date || e.id !== entry.id)];
    setEntries(next);
    store.setMood(next);
    toast({ description: t("saved") });
    setNote("");
    setEmotion(null);
    stopCamera();
  }

  const chartData = [...entries]
    .reverse()
    .slice(-30)
    .map((e) => ({ date: format(parseISO(e.date), "MMM d"), mood: e.mood }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("log_mood")}</h1>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                data-testid={`button-mood-${m.value}`}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl border-2 px-5 py-3 transition-all",
                  mood === m.value
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <span className="text-2xl font-bold text-primary">{m.value}</span>
                <span className="text-xs text-muted-foreground">{t(m.key)}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("note")}</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              data-testid="input-mood-note"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{t("see_yourself")}</h3>
              {cameraOn ? (
                <Button variant="outline" size="sm" onClick={stopCamera}>
                  <CameraOff className="mr-2 h-4 w-4" />
                  {t("close_camera")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startCamera}
                  disabled={cameraLoading}
                  data-testid="button-camera-open"
                >
                  {cameraLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {cameraLoading ? t("camera_connecting") : t("open_camera")}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t("camera_note")}</p>

            {/* Video is always rendered so ref is available when stream attaches */}
            <div
              className={cn(
                "overflow-hidden rounded-2xl border border-border bg-black transition-all",
                cameraOn ? "block" : "hidden"
              )}
            >
              <video
                ref={videoRef}
                className="aspect-video w-full -scale-x-100 object-cover"
                playsInline
                autoPlay
                muted
              />
            </div>

            {(cameraDenied || cameraError) && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 space-y-1">
                {cameraDenied && <p className="font-medium">{t("camera_denied")}</p>}
                {cameraError && <p className="opacity-80">{cameraError}</p>}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">{t("pick_emotion")}</p>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map((key) => {
                  const label = t(key);
                  const active = emotion === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setEmotion(active ? null : key)}
                      data-testid={`chip-${key}`}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm transition-all",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:border-primary/40"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Button onClick={save} size="lg" className="w-full gap-2" data-testid="button-save-mood">
            <Save className="h-4 w-4" />
            {t("save_entry")}
          </Button>
        </CardContent>
      </Card>

      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("mood_history")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56" style={{ minHeight: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem",
                    }}
                  />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("recent_entries")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {entries.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">{t("no_entries")}</p>
          ) : (
            entries.slice(0, 30).map((e) => (
              <div key={e.id} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                  {e.mood}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{e.label}</span>
                    {e.emotion && <Badge variant="outline" className="text-xs">{e.emotion}</Badge>}
                    <span className="ml-auto text-xs text-muted-foreground">{e.date}</span>
                  </div>
                  {e.note && <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
