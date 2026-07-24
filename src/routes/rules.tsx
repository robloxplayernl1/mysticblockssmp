import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Regels · MysticBlocksSMP" },
      { name: "description", content: "De regels van MysticBlocksSMP. Lees ze door voordat je speelt." },
      { property: "og:title", content: "Regels · MysticBlocksSMP" },
      { property: "og:description", content: "De regels van MysticBlocksSMP." },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  const { data: settings } = useQuery(settingsQuery);
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Server Regels</h1>
        <p className="text-center text-muted-foreground mb-12">
          Om ervoor te zorgen dat iedereen plezier heeft, gelden de volgende regels.
        </p>
        <div className="p-8 rounded-2xl bg-card border border-border shadow-elegant">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {settings?.rules_text ?? "Regels worden binnenkort toegevoegd."}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}