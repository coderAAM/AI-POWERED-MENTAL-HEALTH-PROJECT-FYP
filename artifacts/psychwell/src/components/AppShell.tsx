import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  MessageCircle,
  ClipboardList,
  HeartPulse,
  Stethoscope,
  CalendarDays,
  PhoneCall,
  Settings,
  LogOut,
  Menu,
  Languages,
  Sun,
  Moon,
} from "lucide-react";
import logoImg from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useLang } from "@/lib/lang-context";
import { useTheme } from "@/lib/theme-context";
import { store } from "@/lib/storage";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/chat", icon: MessageCircle, key: "chat" as const },
  { href: "/assess", icon: ClipboardList, key: "assess" as const },
  { href: "/mood", icon: HeartPulse, key: "mood" as const },
  { href: "/doctors", icon: Stethoscope, key: "doctors" as const },
  { href: "/appointments", icon: CalendarDays, key: "appointments" as const },
  { href: "/call-doctor", icon: PhoneCall, key: "call_doctor" as const },
  { href: "/settings", icon: Settings, key: "settings" as const },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { t } = useLang();
  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            data-testid={`link-nav-${item.key}`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2 px-4 py-5">
      <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-md">
        <img src={logoImg} alt="Psychwell" className="h-9 w-9 object-cover" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight">Psychwell</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Mind care
        </span>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = store.getUser();
  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "PW";

  function logout() {
    store.setUser(null);
    navigate("/welcome");
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <BrandMark />
        <SidebarNav />
      </aside>

      {/* Mobile sheet sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Psychwell navigation</SheetTitle>
          </SheetHeader>
          <BrandMark />
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            title={theme === "dark" ? t("theme_light") : t("theme_dark")}
            className="h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Language toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className="gap-2"
            data-testid="button-lang-toggle"
          >
            <Languages className="h-4 w-4" />
            <span className="font-medium">
              {lang === "en" ? "اردو" : "English"}
            </span>
          </Button>

          {/* User avatar */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
              {user?.name || "Guest"}
            </span>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            data-testid="button-logout"
            title={t("logout")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const user = store.getUser();
  if (!user) {
    navigate("/welcome");
    return null;
  }
  return <AppShell>{children}</AppShell>;
}
