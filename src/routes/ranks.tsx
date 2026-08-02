import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { ranksQuery } from "@/lib/queries";

export const Route = createFileRoute("/ranks")({
  head: () => ({
    meta: [
      { title: "Ranks · MysticBlocksSMP" },
      {
        name: "description",
        content:
          "Ranks op MysticBlocksSMP verdien je door speeltijd — geen webshop. Bekijk hoe je elke rank kunt behalen.",
      },
      { property: "og:title", content: "Ranks · MysticBlocksSMP" },
      { property: "og:description", content: "Verdien ranks door te spelen op MysticBlocksSMP." },
    ],
  }),
  component: RanksPage,
});

function RanksPage() {
  const { data: ranks } = useQuery(ranksQuery);

  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4">Ranks</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Ranks verdien je puur door te spelen op de server. Geen webshop, geen betaalde
            voordelen — hoe meer speeltijd je hebt, hoe hoger je klimt.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(ranks ?? []).map((r) => (
      <div
              key={r.id}
              className="relative p-5 sm:p-6 rounded-2xl bg-card border border-border overflow-hidden"
            >
              <div
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: r.color }}
              />
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 mb-2">
                <h2 className="min-w-0 break-words text-xl sm:text-2xl font-bold" style={{ color: r.color }}>
                  {r.name}
                </h2>
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground text-right">
                  {r.requirement || "—"}
                </span>
              </div>
              {r.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {r.description}
                </p>
              )}
            </div>
          ))}
          {ranks?.length === 0 && (
            <p className="text-center text-muted-foreground md:col-span-2 py-12">
              Er zijn nog geen ranks ingesteld.
            </p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}