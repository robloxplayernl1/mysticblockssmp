import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { eventsQuery } from "@/lib/queries";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events · MysticBlocksSMP" },
      { name: "description", content: "Bekijk alle aankomende evenementen op MysticBlocksSMP." },
      { property: "og:title", content: "Events · MysticBlocksSMP" },
      { property: "og:description", content: "Alle aankomende evenementen op MysticBlocksSMP." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { data: events, isLoading } = useQuery(eventsQuery);

  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Evenementen</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">
          Doe mee aan onze speciale events en verdien exclusieve rewards!
        </p>
        {isLoading && <p className="text-center text-muted-foreground">Laden...</p>}
        {!isLoading && (events?.length ?? 0) === 0 && (
          <p className="text-center text-muted-foreground">Geen evenementen gepland op dit moment.</p>
        )}
        <div className="space-y-4">
          {events?.map((e) => {
            const isPast = new Date(e.event_date).getTime() < Date.now();
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
              </div>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}