import { useState } from "react";
import { useLocation } from "wouter";
import { Save, Trash2, Languages as LanguagesIcon, Sun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLang } from "@/lib/lang-context";
import { useTheme } from "@/lib/theme-context";
import { store } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const initial = store.getUser();
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");

  function save() {
    if (!initial) return;
    store.setUser({ ...initial, name: name.trim(), email: email.trim() });
    toast({ description: t("saved_profile") });
  }

  function clearAll() {
    store.clearAll();
    toast({ description: t("cleared") });
    navigate("/welcome");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("edit_profile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-name">{t("name")}</Label>
            <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-settings-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-email">{t("email")}</Label>
            <Input id="s-email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-settings-email" />
          </div>
          <Button onClick={save} className="gap-2" data-testid="button-save-profile">
            <Save className="h-4 w-4" />
            {t("save")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LanguagesIcon className="h-4 w-4 text-primary" />
            {t("language")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant={lang === "en" ? "default" : "outline"}
            onClick={() => setLang("en")}
            data-testid="button-lang-en"
          >
            {t("english")}
          </Button>
          <Button
            variant={lang === "ur" ? "default" : "outline"}
            onClick={() => setLang("ur")}
            data-testid="button-lang-ur"
          >
            {t("urdu")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-primary" />
            ) : (
              <Sun className="h-4 w-4 text-primary" />
            )}
            {t("theme")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="gap-2"
            data-testid="button-theme-light"
          >
            <Sun className="h-4 w-4" />
            {t("theme_light")}
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="gap-2"
            data-testid="button-theme-dark"
          >
            <Moon className="h-4 w-4" />
            {t("theme_dark")}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base">{t("data")}</CardTitle>
          <CardDescription>{t("data_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2" data-testid="button-clear">
                <Trash2 className="h-4 w-4" />
                {t("clear_data")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("clear_data")}</AlertDialogTitle>
                <AlertDialogDescription>{t("data_desc")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={clearAll} className="bg-destructive text-destructive-foreground">
                  {t("confirm_clear")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
