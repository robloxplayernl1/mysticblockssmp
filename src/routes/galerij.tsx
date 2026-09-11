import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { galleryQuery } from "@/lib/queries";

export const Route = createFileRoute("/galerij")({
  head: () => ({
    meta: [
      { title: "Galerij · MysticBlocksSMP" },
      { name: "description", content: "Screenshots en bouwwerken van spelers op de MysticBlocksSMP Minecraft server." },
      { property: "og:title", content: "Galerij · MysticBlocksSMP" },
      { property: "og:description", content: "Screenshots en bouwwerken van spelers op de MysticBlocksSMP Minecraft server." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data, isLoading } = useQuery(galleryQuery);
  const items = data ?? [];

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-glow text-center mb-3">Galerij</h1>
        <p className="text-center text-sm text-muted-foreground mb-10">
          Screenshots en bouwwerken uit onze wereld.
        </p>
        {isLoading ? (
          <p className="text-center text-muted-foreground">Laden...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Er staan nog geen foto's in de galerij.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <figure key={item.id} className="rounded-2xl overflow-hidden bg-card border border-border">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title || "Screenshot van MysticBlocksSMP"}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-4xl bg-secondary/40">🖼️</div>
                )}
                {(item.title || item.description) && (
                  <figcaption className="p-4">
                    {item.title && <h2 className="font-semibold break-words">{item.title}</h2>}
                    {item.description && (
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
