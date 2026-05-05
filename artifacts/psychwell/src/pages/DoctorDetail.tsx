import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import {
  ChevronLeft,
  Stethoscope,
  Star,
  MapPin,
  Phone,
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  Languages as LanguagesIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetDoctor } from "@workspace/api-client-react";
import { useLang } from "@/lib/lang-context";
import { store, uid, todayIso } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function DoctorDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { t } = useLang();
  const { toast } = useToast();
  const { data: doctor, isLoading } = useGetDoctor(params.id);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayIso());
  const [time, setTime] = useState("10:00");
  const [reason, setReason] = useState("");

  if (isLoading || !doctor) {
    return <div className="mx-auto max-w-3xl p-8 text-sm text-muted-foreground">Loading...</div>;
  }

  function book() {
    if (!doctor) return;
    const appt = {
      id: uid(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      time,
      reason: reason.trim(),
      status: "booked" as const,
      createdAt: new Date().toISOString(),
    };
    store.setAppointments([appt, ...store.getAppointments()]);
    toast({ description: t("booked_toast") });
    setOpen(false);
    setReason("");
    navigate("/appointments");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/doctors">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("back")}
        </Button>
      </Link>

      <Card>
        <CardContent className="space-y-6 p-6 md:p-8">
          <div className="flex flex-wrap items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Stethoscope className="h-9 w-9" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{doctor.name}</h1>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-amber-700 dark:text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {doctor.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  {doctor.experienceYears} {t("years")} {t("experience").toLowerCase()}
                </span>
                <span className="font-semibold text-foreground">PKR {doctor.feePkr.toLocaleString()}</span>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" data-testid="button-book">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("book_appointment")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("book_appointment")}</DialogTitle>
                  <DialogDescription>{doctor.name} · {doctor.specialty}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t("date")}</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} data-testid="input-date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">{t("time")}</Label>
                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} data-testid="input-time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">{t("reason")}</Label>
                    <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} data-testid="input-reason" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>{t("cancel")}</Button>
                  <Button onClick={book} data-testid="button-confirm-booking">{t("confirm_booking")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={GraduationCap} title={t("qualifications")} value={doctor.qualifications} />
            <InfoRow icon={Building2} title={t("hospital")} value={doctor.hospital} />
            <InfoRow icon={MapPin} title={t("address")} value={`${doctor.address}, ${doctor.city}`} />
            <InfoRow icon={Phone} title={t("phone")} value={doctor.phone} />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("bio")}</h3>
            <p className="leading-relaxed">{doctor.bio}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" /> {t("available_days")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {doctor.availableDays.map((d) => (
                  <Badge key={d} variant="outline">{d}</Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <LanguagesIcon className="h-4 w-4 text-primary" /> {t("languages")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {doctor.languages.map((l) => (
                  <Badge key={l} variant="secondary">{l}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, title, value }: { icon: typeof Stethoscope; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
