import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Lang } from "./translations";
import { store } from "./storage";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations) => string;
  dir: "ltr" | "rtl";
};

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => store.getLang());

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ur" ? "rtl" : "ltr");
    if (lang === "ur") html.classList.add("font-urdu");
    else html.classList.remove("font-urdu");
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    store.setLang(l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: keyof typeof translations) => {
      const entry = translations[key];
      return entry ? entry[lang] || entry.en : String(key);
    },
    [lang]
  );

  const value = useMemo<LangCtx>(
    () => ({ lang, setLang, t, dir: lang === "ur" ? "rtl" : "ltr" }),
    [lang, setLang, t]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLang must be inside LangProvider");
  return v;
}
