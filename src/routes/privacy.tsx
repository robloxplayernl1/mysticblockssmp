import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacyverklaring · MysticBlocksSMP" },
      { name: "description", content: "Lees hoe MysticBlocksSMP omgaat met jouw gegevens, cookies en contactgegevens." },
      { property: "og:title", content: "Privacyverklaring · MysticBlocksSMP" },
      { property: "og:description", content: "Lees hoe MysticBlocksSMP omgaat met jouw gegevens, cookies en contactgegevens." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mysticblockssmp.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://mysticblockssmp.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Privacyverklaring</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">
          Laatst bijgewerkt: {new Date().getFullYear()}
        </p>

        <div className="space-y-8">
          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">1. Welke gegevens verzamelen we?</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              MysticBlocksSMP verzamelt alleen gegevens die je zelf met ons deelt, bijvoorbeeld via Discord of e-mail. 
              Wanneer je onze website bezoekt, kunnen er standaard serverlogs worden bijgehouden zoals je IP-adres, 
              browsertype en bezochte pagina&apos;s. Deze logs gebruiken we uitsluitend voor technisch beheer en 
              het oplossen van problemen.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">2. Cookies</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Onze website gebruikt alleen functionele cookies die noodzakelijk zijn voor het correct werken van 
              de site, zoals het onthouden van je sessie als je bent ingelogd op het admin paneel. We gebruiken 
              geen tracking- of advertentiecookies.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">3. Gegevensdeling</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We verkopen, verhuren of delen je persoonsgegevens niet met derden, tenzij we daartoe wettelijk 
              verplicht zijn of je hier zelf toestemming voor hebt gegeven.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">4. Beveiliging</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen tegen 
              verlies, misbruik of onbevoegde toegang. Toegang tot het admin paneel is beveiligd met een 
              wachtwoord en server-side sessies.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">5. Je rechten</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Je hebt het recht om te vragen welke gegevens we van je hebben, om deze te laten corrigeren of 
              verwijderen, en om bezwaar te maken tegen bepaalde verwerkingen. Neem hiervoor contact op via Discord.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">6. Contact</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Vragen over deze privacyverklaring? Stuur een bericht in onze Discord server.
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
