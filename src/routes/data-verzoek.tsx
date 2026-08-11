import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { RequestForm } from "@/components/request-form";

const title = "Datavezoek indienen · MysticBlocksSMP";
const description =
  "Vraag inzage, verwijdering of een export van je persoonsgegevens aan bij MysticBlocksSMP. Wij reageren binnen 30 dagen.";

export const Route = createFileRoute("/data-verzoek")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mysticblockssmp.lovable.app/data-verzoek" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://mysticblockssmp.lovable.app/data-verzoek" }],
  }),
  component: DataRequestPage,
});

const kinds = [
  { value: "inzage" as const, label: "Inzage in mijn gegevens" },
  { value: "verwijdering" as const, label: "Verwijdering van mijn gegevens" },
  { value: "export" as const, label: "Export (kopie) van mijn gegevens" },
];

function DataRequestPage() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Datavezoek</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">
          Vraag inzage, verwijdering of een export van de gegevens die wij van je bewaren.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 mb-8 sm:mb-12">
          {[
            { icon: "🔍", t: "Inzage", d: "Bekijk welke gegevens wij van je hebben." },
            { icon: "🗑️", t: "Verwijdering", d: "Laat je gegevens permanent wissen." },
            { icon: "📦", t: "Export", d: "Ontvang een kopie van je gegevens." },
          ].map((c) => (
            <div key={c.t} className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-elegant text-center">
              <div className="text-2xl mb-2">{c.icon}</div>
              <h2 className="font-semibold mb-1">{c.t}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>

        <RequestForm kinds={kinds} defaultKind="inzage" kindLabel="Type verzoek" />

        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-card/60 border border-border text-sm text-muted-foreground space-y-2">
          <p>
            We behandelen je verzoek binnen 30 dagen. Om misbruik te voorkomen kunnen we je vragen te bevestigen dat
            het account of de Minecraft-naam van jou is, bijvoorbeeld via Discord of vanaf hetzelfde e-mailadres.
          </p>
          <p>
            Meer informatie over welke gegevens we bewaren vind je in onze{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              privacyverklaring
            </Link>
            .
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
