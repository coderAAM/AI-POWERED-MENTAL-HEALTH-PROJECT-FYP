import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Star, Stethoscope, Languages as LanguagesIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useListDoctors,
  useListDoctorCities,
  useListDoctorSpecialties,
} from "@workspace/api-client-react";
import { useLang } from "@/lib/lang-context";

export default function Doctors() {
  const { t } = useLang();
  const [city, setCity] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");
  const [search, setSearch] = useState("");

  const cities = useListDoctorCities();
  const specialties = useListDoctorSpecialties();
  const params = {
    ...(city ? { city } : {}),
    ...(specialty ? { specialty } : {}),
  };
  const list = useListDoctors(Object.keys(params).length ? params : undefined);

  const filtered = useMemo(() => {
    const arr = list.data ?? [];
    if (!search.trim()) return arr;
    const q = search.toLowerCase();
    return arr.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
    );
  }, [list.data, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("doctors")}</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr,auto,auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_doctors")}
            className="pl-9"
            data-testid="input-doctor-search"
          />
        </div>
        <Select value={city || "all"} onValueChange={(v) => setCity(v === "all" ? "" : v)}>
          <SelectTrigger className="md:w-[180px]" data-testid="select-city">
            <SelectValue placeholder={t("filter_city")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_cities")}</SelectItem>
            {(cities.data ?? []).map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={specialty || "all"} onValueChange={(v) => setSpecialty(v === "all" ? "" : v)}>
          <SelectTrigger className="md:w-[220px]" data-testid="select-specialty">
            <SelectValue placeholder={t("filter_specialty")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_specialties")}</SelectItem>
            {(specialties.data ?? []).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {list.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="h-48 animate-pulse" /></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("no_doctors")}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Card key={d.id} className="group transition-all hover:-translate-y-1 hover:shadow-lg" data-testid={`card-doctor-${d.id}`}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <Star className="h-3 w-3 fill-current" />
                    {d.rating.toFixed(1)}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-tight">{d.name}</h3>
                  <p className="text-xs text-muted-foreground">{d.specialty}</p>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{d.hospital}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{d.city}</span>
                  <span>{d.experienceYears} {t("years")}</span>
                  <span>PKR {d.feePkr.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {d.languages.slice(0, 3).map((l) => (
                    <Badge key={l} variant="secondary" className="gap-1 text-[10px]">
                      <LanguagesIcon className="h-2.5 w-2.5" />{l}
                    </Badge>
                  ))}
                </div>
                <Link href={`/doctors/${d.id}`}>
                  <Button variant="outline" className="w-full" data-testid={`button-view-${d.id}`}>
                    {t("view_profile")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
