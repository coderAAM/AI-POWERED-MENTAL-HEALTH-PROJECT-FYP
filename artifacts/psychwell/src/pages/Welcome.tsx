import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Languages, MessageCircle, ClipboardList, HeartPulse, Stethoscope, ShieldCheck } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { store } from "@/lib/storage";
import heroImg from "@/assets/hero.png";
import logoImg from "@/assets/logo.png";

export default function Welcome() {
  const { lang, setLang, t } = useLang();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (store.getUser()) navigate("/dashboard");
  }, [navigate]);

  const features = [
    { icon: MessageCircle, titleKey: "feature_chat_title" as const, descKey: "feature_chat_desc" as const },
    { icon: ClipboardList, titleKey: "feature_assess_title" as const, descKey: "feature_assess_desc" as const },
    { icon: HeartPulse, titleKey: "feature_plan_title" as const, descKey: "feature_plan_desc" as const },
    { icon: Stethoscope, titleKey: "feature_doctor_title" as const, descKey: "feature_doctor_desc" as const },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-secondary via-background to-accent/40">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md">
            <img src={logoImg} alt="Psychwell" className="h-10 w-10 object-cover" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight">{t("app_name")}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("brand_tagline")}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLang(lang === "en" ? "ur" : "en")}
          className="gap-2"
          data-testid="button-welcome-lang"
        >
          <Languages className="h-4 w-4" />
          {lang === "en" ? "اردو" : "English"}
        </Button>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-10 md:grid-cols-2 md:items-center md:gap-16 md:px-8 md:py-20">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("login_disclaimer")}
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl" data-testid="text-welcome-title">
            {t("welcome_title")}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("welcome_subtitle")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-7" data-testid="button-get-started">
                {t("get_started")}
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="ghost">
                {t("learn_more")}
              </Button>
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-accent/30 to-secondary blur-2xl" />
          <img
            src={heroImg}
            alt=""
            className="relative w-full rounded-[2rem] border border-border shadow-2xl"
          />
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:grid-cols-2 md:px-8 md:gap-6 lg:grid-cols-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.titleKey}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-base font-semibold">{t(f.titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(f.descKey)}</p>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-border bg-background/50 py-6 text-center text-xs text-muted-foreground">
        Psychwell · Made for Pakistan · Crisis: Umang 0311-7786264
      </footer>
    </div>
  );
}
