import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { changelogQuery } from "@/lib/queries";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog · MysticBlocksSMP" },
      { name: "description", content: "Alle updates en wijzigingen op de MysticBlocksSMP Minecraft server, op datum gesorteerd." },
      { property: "og:title", content: "Changelog · MysticBlocksSMP" },
      { property: "og:description", content: "Alle updates en wijzigingen op de MysticBlocksSMP Minecraft server." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChangelogPage,
});

function ChangelogPage() {
  const { data, isLoading } = useQuery(changelogQuery);

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow text-center mb-4">Changelog</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">Alle updates van de server en website.</p>

        {isLoading && <p className="text-center text-muted-foreground">Laden...</p>}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <p className="text-center text-muted-foreground">Nog geen updates.</p>
        )}

        <div className="relative space-y-6">
          {data?.map((c) => (
            <article key={c.id} className="relative pl-4 sm:pl-6 border-l-2 border-primary/40">
              <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-primary shadow-glow" />
              <p className="text-xs font-mono text-primary mb-1">
                {new Date(c.entry_date).toLocaleDateString("nl-NL", { dateStyle: "long" })}
              </p>
              <h2 className="text-base sm:text-lg font-semibold mb-2 break-words">{c.title}</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}