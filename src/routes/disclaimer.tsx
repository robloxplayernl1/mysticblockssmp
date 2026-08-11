import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer · MysticBlocksSMP" },
      { name: "description", content: "Disclaimer en juridische mededelingen voor MysticBlocksSMP." },
      { property: "og:title", content: "Disclaimer · MysticBlocksSMP" },
      { property: "og:description", content: "Disclaimer en juridische mededelingen voor MysticBlocksSMP." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mysticblockssmp.lovable.app/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "https://mysticblockssmp.lovable.app/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Disclaimer</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">
          Juridische mededelingen en voorwaarden voor het gebruik van deze website.
        </p>

        <div className="space-y-8">
          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Onafhankelijkheid</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              MysticBlocksSMP is een onafhankelijke communityserver en is niet gelieerd aan, goedgekeurd door of 
              gesponsord door Mojang Studios of Microsoft Corporation. Minecraft is een handelsmerk van 
              Mojang Studios, een dochteronderneming van Microsoft Corporation. Alle gerelateerde merken en 
              handelsmerken zijn eigendom van hun respectieve eigenaren.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Gebruik van de website</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              De informatie op deze website wordt met zorg samengesteld, maar kan zonder voorafgaande kennisgeving 
              worden gewijzigd. We doen ons best om de serverstatus, evenementen en andere informatie actueel te 
              houden, maar kunnen niet garanderen dat alle gegevens te allen tijd correct of volledig zijn.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Beschikbaarheid</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              De MysticBlocksSMP server en website worden aangeboden zoals ze zijn. We kunnen geen garantie geven 
              over continue beschikbaarheid, foutloze werking of het behoud van data zoals builds, items of 
              speelvoortgang. Onderhoud, updates of technische storingen kunnen leiden tot onderbrekingen.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Gedrag op de server</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Spelers zijn zelf verantwoordelijk voor hun gedrag op de server. Het staffteam behoudt zich het 
              recht voor om spelers te waarschuwen, tijdelijk te bannen of permanent te verwijderen bij overtreding 
              van de serverregels.
            </p>
          </section>

          <section className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Contact</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Vragen over deze disclaimer? Neem contact op via onze Discord server.
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
