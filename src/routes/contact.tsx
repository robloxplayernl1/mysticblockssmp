import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { RequestForm } from "@/components/request-form";
import { settingsQuery } from "@/lib/queries";

const title = "Contact · MysticBlocksSMP";
const description =
  "Neem contact op met het team van MysticBlocksSMP via Discord of het contactformulier. Vragen, meldingen en samenwerkingen.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mysticblockssmp.lovable.app/contact" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://mysticblockssmp.lovable.app/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Contact</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">
          Vragen, ideeën of een melding? Laat het ons weten.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-8 sm:mb-12">
          <a
            href={settings?.discord_link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-card border border-border shadow-elegant hover:border-primary/60 transition"
          >
            <div className="text-2xl mb-2">💬</div>
            <h2 className="font-semibold mb-1">Discord</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              De snelste manier om ons te bereiken. Stel je vraag in het support-kanaal.
            </p>
          </a>
          <div className="p-5 rounded-2xl bg-card border border-border shadow-elegant">
            <div className="text-2xl mb-2">🔒</div>
            <h2 className="font-semibold mb-1">Privacy</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Gaat het over je gegevens? Gebruik dan het{" "}
              <Link to="/data-verzoek" className="text-primary hover:underline">
                datavezoek-formulier
              </Link>
              .
            </p>
          </div>
        </div>

        <RequestForm kinds={[{ value: "contact", label: "Algemene vraag" }]} defaultKind="contact" kindLabel="Onderwerp" />
      </div>
    </SiteLayout>
  );
}
