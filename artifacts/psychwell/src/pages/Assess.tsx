import { useState } from "react";
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Moon,
  Apple,
  Activity,
  Pill,
  HeartHandshake,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/lang-context";
import { store, uid } from "@/lib/storage";
import {
  ALL_ASSESSMENTS,
  scoreAssessment,
  questionLabel,
  type AssessmentDef,
} from "@/lib/assessments";
import { useAiAssess } from "@workspace/api-client-react";
import type { AssessmentPlan, AssessmentInputScores } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Stage =
  | { kind: "list" }
  | { kind: "running"; def: AssessmentDef; index: number; answers: number[] }
  | { kind: "loading"; def: AssessmentDef; scores: Record<string, number> }
  | { kind: "result"; plan: AssessmentPlan; def: AssessmentDef; scores: Record<string, number> };

const severityClasses: Record<AssessmentPlan["severity"], string> = {
  minimal: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  mild: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  moderate: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  severe: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

export default function Assess() {
  const { t, lang } = useLang();
  const user = store.getUser();
  const [stage, setStage] = useState<Stage>({ kind: "list" });
  const assess = useAiAssess();
  const moods = store.getMood();
  const previousAssessments = store.getAssessments();

  function start(def: AssessmentDef) {
    setStage({ kind: "running", def, index: 0, answers: Array(def.questions.length).fill(-1) });
  }

  function answer(value: number) {
    if (stage.kind !== "running") return;
    const answers = [...stage.answers];
    answers[stage.index] = value;
    if (stage.index < stage.def.questions.length - 1) {
      setStage({ ...stage, answers, index: stage.index + 1 });
    } else {
      finish(stage.def, answers);
    }
  }

  function back() {
    if (stage.kind !== "running") return;
    if (stage.index === 0) setStage({ kind: "list" });
    else setStage({ ...stage, index: stage.index - 1 });
  }

  async function finish(def: AssessmentDef, answers: number[]) {
    const scores = scoreAssessment(def, answers);
    setStage({ kind: "loading", def, scores });

    // Merge with previous assessments to provide complete scores
    const merged = mergeScores(previousAssessments, scores);

    const recentNotes = moods
      .slice(0, 5)
      .map((m) => m.note)
      .filter(Boolean);

    try {
      const data = await assess.mutateAsync({
        data: {
          language: lang,
          userName: user?.name,
          scores: merged,
          recentMoodNotes: recentNotes.length ? recentNotes : undefined,
        },
      });
      const record = {
        id: uid(),
        type: def.type,
        date: format(new Date(), "yyyy-MM-dd"),
        scores,
        plan: data,
      };
      store.setAssessments([record, ...previousAssessments]);
      setStage({ kind: "result", plan: data, def, scores });
    } catch {
      setStage({ kind: "list" });
    }
  }

  if (stage.kind === "running") {
    return <Running stage={stage} onAnswer={answer} onBack={back} onCancel={() => setStage({ kind: "list" })} />;
  }
  if (stage.kind === "loading") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
        <p className="text-lg font-medium">{t("generating_plan")}</p>
      </div>
    );
  }
  if (stage.kind === "result") {
    return <Result plan={stage.plan} onDone={() => setStage({ kind: "list" })} />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("assess_pick")}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ALL_ASSESSMENTS.map((def) => {
          const lastTaken = previousAssessments.find((a) => a.type === def.type);
          return (
            <Card key={def.type} className="group transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <CardTitle data-testid={`text-assess-${def.type}`}>{t(def.titleKey)}</CardTitle>
                <CardDescription>{t(def.descKey)}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground">
                  {lastTaken ? (
                    <Badge variant="outline" className={cn("text-xs", severityClasses[lastTaken.plan.severity])}>
                      {t(`severity_${lastTaken.plan.severity}` as never)}
                    </Badge>
                  ) : null}
                </div>
                <Button onClick={() => start(def)} data-testid={`button-start-${def.type}`}>
                  {lastTaken ? t("retake") : t("start_assessment")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Running({
  stage,
  onAnswer,
  onBack,
  onCancel,
}: {
  stage: Extract<Stage, { kind: "running" }>;
  onAnswer: (v: number) => void;
  onBack: () => void;
  onCancel: () => void;
}) {
  const { t, lang } = useLang();
  const q = stage.def.questions[stage.index];
  const progress = ((stage.index + 1) / stage.def.questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("back")}
        </Button>
        <span className="text-xs text-muted-foreground">
          {t("question")} {stage.index + 1} {t("of")} {stage.def.questions.length}
        </span>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {t("cancel")}
        </Button>
      </div>
      <Progress value={progress} className="h-1.5" />

      <Card className="mt-8">
        <CardContent className="space-y-6 p-6 md:p-8">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            {t(stage.def.scale.scaleHeader)}
          </p>
          <h2 className="text-xl leading-relaxed md:text-2xl" data-testid="text-question">
            {questionLabel(q, lang)}
          </h2>

          <div className="space-y-2">
            {stage.def.scale.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onAnswer(opt.value)}
                data-testid={`button-answer-${opt.value}`}
                className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-card px-4 py-3 text-left transition-all hover:border-primary hover:bg-primary/5"
              >
                <span>{opt.label[lang] || opt.label.en}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Result({ plan, onDone }: { plan: AssessmentPlan; onDone: () => void }) {
  const { t } = useLang();
  const items: { icon: typeof Moon; key: keyof AssessmentPlan; titleKey: "sleep" | "food" | "exercise" | "supplements" }[] = [
    { icon: Moon, key: "sleep", titleKey: "sleep" },
    { icon: Apple, key: "food", titleKey: "food" },
    { icon: Activity, key: "exercise", titleKey: "exercise" },
    { icon: Pill, key: "supplements", titleKey: "supplements" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-8 text-primary-foreground shadow-xl">
        <p className="text-xs uppercase tracking-widest opacity-80">{t("your_plan")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Badge className={cn("border", severityClasses[plan.severity])}>
            {t(`severity_${plan.severity}` as never)}
          </Badge>
        </div>
        <p className="mt-4 leading-relaxed" data-testid="text-plan-summary">{plan.summary}</p>
      </div>

      {plan.warning && (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardContent className="flex gap-3 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{t("warning")}</p>
              <p className="mt-1 text-sm leading-relaxed">{plan.warning}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, key, titleKey }) => {
          const item = plan[key] as { title: string; detail: string };
          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{t(titleKey)} · {item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <CardTitle className="text-base">{t("coping")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.coping.map((c, i) => (
            <div key={i} className="rounded-lg border border-border bg-secondary/40 p-4">
              <p className="font-medium">{c.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={onDone} variant="outline" size="lg" className="w-full gap-2" data-testid="button-plan-done">
        <RefreshCw className="h-4 w-4" />
        {t("plan_again")}
      </Button>
    </div>
  );
}

function mergeScores(prev: ReturnType<typeof store.getAssessments>, latest: Record<string, number>): AssessmentInputScores {
  const last = (key: "anxiety" | "depression" | "stress" | "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism", def?: number) => {
    if (key in latest) return latest[key];
    for (const a of prev) {
      if (key in a.scores) return a.scores[key];
    }
    return def ?? 0;
  };
  return {
    anxiety: last("anxiety", 0),
    depression: last("depression", 0),
    stress: last("stress", 0),
    openness: last("openness", 3),
    conscientiousness: last("conscientiousness", 3),
    extraversion: last("extraversion", 3),
    agreeableness: last("agreeableness", 3),
    neuroticism: last("neuroticism", 3),
  };
}
