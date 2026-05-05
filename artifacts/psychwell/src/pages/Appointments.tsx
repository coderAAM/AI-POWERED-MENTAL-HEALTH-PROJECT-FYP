import { useState } from "react";
import { Calendar, X, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang-context";
import { store, type Appointment } from "@/lib/storage";
import { isAfter, parseISO, subDays } from "date-fns";

export default function Appointments() {
  const { t } = useLang();
  const [items, setItems] = useState<Appointment[]>(() => store.getAppointments());

  const yesterday = subDays(new Date(), 1);
  const upcoming = items
    .filter((a) => a.status === "booked" && isAfter(parseISO(a.date), yesterday))
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = items
    .filter((a) => a.status === "cancelled" || !isAfter(parseISO(a.date), yesterday))
    .sort((a, b) => b.date.localeCompare(a.date));

  function cancel(id: string) {
    const next = items.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a));
    setItems(next);
    store.setAppointments(next);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("appointments")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-primary" />
            {t("upcoming")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcoming.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">{t("no_appts")}</p>
          ) : (
            upcoming.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 p-4"
                data-testid={`appt-${a.id}`}
              >
                <div>
                  <p className="font-semibold">{a.doctorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.date} · {a.time}
                  </p>
                  {a.reason && <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{t("status_booked")}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => cancel(a.id)} data-testid={`button-cancel-${a.id}`}>
                    <X className="mr-1 h-3.5 w-3.5" />
                    {t("cancel_appt")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {past.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4 text-primary" />
              {t("past")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {past.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/20 p-4 opacity-80"
              >
                <div>
                  <p className="font-medium">{a.doctorName}</p>
                  <p className="text-sm text-muted-foreground">{a.date} · {a.time}</p>
                </div>
                <Badge variant="outline">
                  {t(a.status === "cancelled" ? "status_cancelled" : "status_booked")}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
