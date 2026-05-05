import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Languages } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { store } from "@/lib/storage";
import logoImg from "@/assets/logo.png";

export default function Login() {
  const { lang, setLang, t } = useLang();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (store.getUser()) navigate("/dashboard");
  }, [navigate]);

  function fillDemo() {
    setName(lang === "ur" ? "علی احمد" : "Ali Ahmed");
    setEmail("ali.ahmed@example.com");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    store.setUser({
      name: name.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
    });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/30 p-4">
      <div className="mx-auto flex max-w-md items-center justify-between py-4">
        <button
          onClick={() => navigate("/welcome")}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow">
            <img src={logoImg} alt="Psychwell" className="h-9 w-9 object-cover" />
          </div>
          <span className="text-base font-semibold">Psychwell</span>
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLang(lang === "en" ? "ur" : "en")}
          className="gap-2"
          data-testid="button-login-lang"
        >
          <Languages className="h-4 w-4" />
          {lang === "en" ? "اردو" : "English"}
        </Button>
      </div>

      <div className="mx-auto mt-8 max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
        <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-login-title">
          {t("login_title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("login_subtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="input-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" data-testid="button-login">
            {t("login")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={fillDemo}
            data-testid="button-demo"
          >
            {t("continue_demo")}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {t("login_disclaimer")}
        </p>
      </div>
    </div>
  );
}
