import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { eventsQuery, rsvpsQuery, type EventRow, type RsvpRow } from "@/lib/queries";
import { submitRsvp, cancelRsvp } from "@/lib/site.functions";
import { getBrowserToken } from "@/lib/browser-token";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events · MysticBlocksSMP" },
      { name: "description", content: "Bekijk alle aankomende evenementen op MysticBlocksSMP en meld je direct aan." },
      { property: "og:title", content: "Events · MysticBlocksSMP" },
      { property: "og:description", content: "Alle aankomende evenementen op MysticBlocksSMP, met aanmelden." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EventsPage,
});

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function Calendar({
  events,
  selected,
  onSelect,
}: {
  events: EventRow[];
  selected: string | null;
  onSelect: (key: string | null) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) {
      const k = dayKey(new Date(e.event_date));
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const todayKey = dayKey(new Date());

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 mb-8">
      <div className="flex items-center justify-between gap-2 mb-4">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary transition"
        >
          ←
        </button>
        <span className="font-semibold capitalize text-sm sm:text-base">
          {cursor.toLocaleDateString("nl-NL", { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary transition"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-muted-foreground mb-1">
        {DAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} />;
          const key = `${year}-${month}-${day}`;
          const count = byDay.get(key) ?? 0;
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(isSelected ? null : count ? key : null)}
              className={`aspect-square rounded-lg text-xs sm:text-sm flex flex-col items-center justify-center gap-0.5 transition border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : count
                    ? "border-primary/50 bg-primary/10 hover:bg-primary/20"
                    : "border-transparent text-muted-foreground"
              } ${key === todayKey && !isSelected ? "ring-1 ring-primary/40" : ""}`}
            >
              {day}
              {count > 0 && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"}`} />}
            </button>
          );
        })}
      </div>
      {selected && (
        <button onClick={() => onSelect(null)} className="mt-3 text-xs text-primary hover:underline">
          Toon alle evenementen
        </button>
      )}
    </div>
  );
}

function RsvpBox({ event, rsvps }: { event: EventRow; rsvps: RsvpRow[] }) {
  const qc = useQueryClient();
  const join = useServerFn(submitRsvp);
  const leave = useServerFn(cancelRsvp);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mine, setMine] = useState<string | null>(null);

  const storageKey = `mbs-rsvp-${event.id}`;
  useEffect(() => {
    setMine(window.localStorage.getItem(storageKey));
  }, [storageKey]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await join({ data: { event_id: event.id, minecraft_name: name.trim(), browser_token: getBrowserToken() } });
      window.localStorage.setItem(storageKey, name.trim());
      setMine(name.trim());
      setName("");
      await qc.invalidateQueries({ queryKey: ["event_rsvps"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Aanmelden mislukt");
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    setError(null);
    try {
      await leave({ data: { event_id: event.id, browser_token: getBrowserToken() } });
      window.localStorage.removeItem(storageKey);
      setMine(null);
      await qc.invalidateQueries({ queryKey: ["event_rsvps"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Afmelden mislukt");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      <p className="text-sm">
        <span className="font-medium">{rsvps.length}</span> speler{rsvps.length === 1 ? "" : "s"} aangemeld
      </p>
      {rsvps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {rsvps.map((r) => (
            <span key={r.id} className="text-xs px-2 py-1 rounded-md bg-secondary/60 border border-border">
              {r.minecraft_name}
            </span>
          ))}
        </div>
      )}
      {mine ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-primary">✓ Je bent aangemeld als {mine}</span>
          <button
            onClick={cancel}
            disabled={busy}
            className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-secondary transition disabled:opacity-50"
          >
            Afmelden
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            placeholder="Je Minecraft-naam"
            className="w-full min-w-0 rounded-lg bg-input border border-border px-3 py-2 text-sm"
          />
          <button
            onClick={submit}
            disabled={busy || name.trim().length < 2}
            className="shrink-0 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            Ik doe mee
          </button>
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function EventsPage() {
  const { data: events, isLoading } = useQuery(eventsQuery);
  const { data: rsvps } = useQuery(rsvpsQuery);
  const [selected, setSelected] = useState<string | null>(null);

  const all = events ?? [];
  const shown = selected ? all.filter((e) => dayKey(new Date(e.event_date)) === selected) : all;

  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Evenementen</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">
          Doe mee aan onze speciale events en verdien exclusieve rewards!
        </p>
        <Calendar events={all} selected={selected} onSelect={setSelected} />
        {isLoading && <p className="text-center text-muted-foreground">Laden...</p>}
        {!isLoading && shown.length === 0 && (
          <p className="text-center text-muted-foreground">Geen evenementen gepland op dit moment.</p>
        )}
        <div className="space-y-4">
          {shown.map((e) => {
            const isPast = new Date(e.event_date).getTime() < Date.now();
            const eventRsvps = (rsvps ?? []).filter((r) => r.event_id === e.id);
            return (
              <div
                key={e.id}
                className={`p-5 sm:p-6 rounded-2xl border ${
                  isPast ? "bg-card/40 border-border/50 opacity-70" : "bg-card border-border hover:border-primary/50"
                } transition`}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 mb-3">
                  <h2 className="min-w-0 break-words text-lg sm:text-xl font-semibold">{e.title}</h2>
                  {isPast && (
                    <span className="shrink-0 text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Voorbij</span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-primary font-mono mb-3 break-words">
                  📅 {new Date(e.event_date).toLocaleString("nl-NL", { dateStyle: "full", timeStyle: "short" })}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words">{e.description}</p>
                {!isPast && e.rsvp_enabled && <RsvpBox event={e} rsvps={eventRsvps} />}
              </div>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}
