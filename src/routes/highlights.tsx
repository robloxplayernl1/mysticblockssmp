import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { highlightsQuery } from "@/lib/queries";

export const Route = createFileRoute("/highlights")({
  head: () => ({
    meta: [
      { title: "Highlights · MysticBlocksSMP" },
      { name: "description", content: "Speler-highlights en het bouwwerk van de maand op de MysticBlocksSMP server." },
      { property: "og:title", content: "Highlights · MysticBlocksSMP" },
      { property: "og:description", content: "Speler-highlights en het bouwwerk van de maand op de MysticBlocksSMP server." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HighlightsPage,
});

function HighlightsPage() {
  const { data, isLoading } = useQuery(highlightsQuery);
  const items = (data ?? []).filter((h) => h.is_active);

  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-glow text-center mb-3">Highlights</h1>
        <p className="text-center text-sm text-muted-foreground mb-10">
          Uitgelichte spelers en bouwwerken van de maand.
        </p>
        {isLoading ? (
          <p className="text-center text-muted-foreground">Laden...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Er zijn nog geen highlights.</p>
        ) : (
          <div className="space-y-6">
            {items.map((h) => (
              <article key={h.id} className="rounded-2xl bg-card border border-border overflow-hidden md:flex">
                {h.image_url && (
                  <img
                    src={h.image_url}
                    alt={h.title}
                    loading="lazy"
                    className="w-full md:w-64 h-48 md:h-auto object-cover"
                  />
                )}
                <div className="p-5 sm:p-6 flex-1">
                  {h.period && <p className="text-xs uppercase tracking-wider text-primary mb-1">{h.period}</p>}
                  <h2 className="text-xl font-semibold break-words">{h.title}</h2>
                  {h.player_name && (
                    <p className="mt-1 text-sm text-muted-foreground">Speler: <span className="text-foreground">{h.player_name}</span></p>
                  )}
                  {h.description && (
                    <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{h.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
