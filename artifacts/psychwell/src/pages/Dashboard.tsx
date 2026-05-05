import { useMemo } from "react";
import { Link } from "wouter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  HeartPulse,
  Flame,
  CalendarDays,
  TrendingUp,
  MessageCircle,
  PhoneCall,
  Stethoscope,
  ArrowRight,
  Notebook,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang-context";
import { store, type MoodEntry } from "@/lib/storage";
import { format, parseISO, subDays, isAfter } from "date-fns";

const moodLabels: Record<number, "mood_1" | "mood_2" | "mood_3" | "mood_4" | "mood_5"> = {
  1: "mood_1",
  2: "mood_2",
  3: "mood_3",
  4: "mood_4",
  5: "mood_5",
};

function calcStreak(entries: MoodEntry[]): number {
  if (!entries.length) return 0;
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    if (dates.has(d)) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

export default function Dashboard() {
  const { t, lang } = useLang();
  const user = store.getUser();
  const moods = store.getMood();
  const assessments = store.getAssessments();
  const appointments = store.getAppointments();

  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = moods.find((m) => m.date === today);
  const streak = calcStreak(moods);
  const lastAssessment = assessments[0];
  const upcoming = appointments
    .filter((a) => a.status === "booked" && isAfter(parseISO(a.date), subDays(new Date(), 1)))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const chartData = useMemo(() => {
    const data: { date: string; label: string; mood: number | null }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      const m = moods.find((mm) => mm.date === d);
      data.push({
        date: d,
        label: format(subDays(new Date(), i), "MMM d"),
        mood: m ? m.mood : null,
      });
    }
    return data;
  }, [moods]);

  const validTrend = chartData.filter((d) => d.mood !== null).map((d) => d.mood as number);
  const trendDelta =
    validTrend.length >= 2
      ? Math.round((validTrend[validTrend.length - 1] - validTrend[0]) * 10) / 10
      : 0;

  const streakValue = lang === "ur"
    ? `${streak} ${t("streak_days")}`
    : `${streak} ${streak === 1 ? t("streak_day") : t("streak_days")}`;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">
          {t("hello")}, {user?.name?.split(" ")[0]}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl" data-testid="text-dashboard-greeting">
          {t("how_feel_today")}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={HeartPulse}
          title={t("today_mood")}
          value={
            todayMood
              ? `${todayMood.mood}/5 · ${t(moodLabels[todayMood.mood])}`
              : t("not_logged_today")
          }
          tone="primary"
          action={!todayMood ? { href: "/mood", label: t("log_now") } : undefined}
          testId="card-today-mood"
        />
        <StatCard
          icon={Flame}
          title={t("streak")}
          value={streakValue}
          tone="accent"
          testId="card-streak"
        />
        <StatCard
          icon={ClipboardList}
          title={t("recent_severity")}
          value={
            lastAssessment
              ? t(`severity_${lastAssessment.plan.severity}` as never)
              : t("none_yet")
          }
          tone="secondary"
          testId="card-severity"
        />
        <StatCard
          icon={CalendarDays}
          title={t("next_appt")}
          value={
            upcoming
              ? `${upcoming.doctorName} · ${upcoming.date}`
              : t("no_upcoming")
          }
          tone="primary"
          action={!upcoming ? { href: "/doctors", label: t("doctors") } : undefined}
          testId="card-next-appt"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            {t("mood_history")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validTrend.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-muted-foreground">{t("no_entries")}</p>
            </div>
          ) : (
            <div className="h-64 w-full" style={{ minHeight: 256 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: -16 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-primary" />
              {t("recent_appts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">{t("no_appts")}</p>
            ) : (
              appointments.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-secondary/50 p-3"
                >
                  <div>
                    <p className="font-medium">{a.doctorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.date} · {a.time}
                    </p>
                  </div>
                  <Badge variant={a.status === "booked" ? "default" : "outline"}>
                    {t(a.status === "booked" ? "status_booked" : "status_cancelled")}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("quick_actions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickAction href="/chat" icon={MessageCircle} label={t("chat")} />
            <QuickAction href="/call-doctor" icon={PhoneCall} label={t("call_doctor")} />
            <QuickAction href="/assess" icon={Notebook} label={t("assess")} />
            <QuickAction href="/doctors" icon={Stethoscope} label={t("doctors")} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  tone,
  action,
  testId,
}: {
  icon: typeof HeartPulse;
  title: string;
  value: string;
  tone: "primary" | "accent" | "secondary";
  action?: { href: string; label: string };
  testId?: string;
}) {
  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  }[tone];

  return (
    <Card className="overflow-hidden" data-testid={testId}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
            <p className="mt-2 truncate text-lg font-semibold leading-tight">{value}</p>
            {action && (
              <Link href={action.href}>
                <Button variant="link" className="mt-2 h-auto p-0 text-xs">
                  {action.label} <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof MessageCircle;
  label: string;
}) {
  return (
    <Link href={href}>
      <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-sm font-medium transition-colors hover:bg-secondary">
        <span className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </Link>
  );
}
