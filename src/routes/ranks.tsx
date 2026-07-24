import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { ranksQuery } from "@/lib/queries";

export const Route = createFileRoute("/ranks")({
  head: () => ({
    meta: [
      { title: "Ranks · MysticBlocksSMP" },
      { name: "description", content: "Bekijk alle ranks op MysticBlocksSMP en hun voordelen." },
      { property: "og:title", content: "Ranks · MysticBlocksSMP" },
      { property: "og:description", content: "Ranks en perks op MysticBlocksSMP." },
    ],
  }),
  component: RanksPage,
});

function RanksPage() {
  const { data: ranks } = useQuery(ranksQuery);
  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Ranks</h1>
        <p className="text-center text-muted-foreground mb-12">
          Ondersteun de server en ontgrendel exclusieve voordelen.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {ranks?.map((r, i) => (
            <div
              key={r.id}
              className={`p-6 rounded-2xl border relative ${
                i === 1
                  ? "bg-gradient-to-b from-primary/20 to-card border-primary shadow-glow"
                  : "bg-card border-border"
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold">
                  Populair
                </span>
              )}
              <h2 className="text-2xl font-bold text-center mb-2">{r.name}</h2>
              <p className="text-3xl font-bold text-center text-primary mb-4">{r.price}</p>
              <p className="text-sm text-muted-foreground text-center mb-4">{r.description}</p>
              <div className="border-t border-border pt-4">
                <p className="text-xs uppercase text-muted-foreground mb-2">Perks</p>
                <p className="text-sm whitespace-pre-wrap">{r.perks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}