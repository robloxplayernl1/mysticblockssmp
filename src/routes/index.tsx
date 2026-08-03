import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { settingsQuery, eventsQuery } from "@/lib/queries";
import { ServerStatus } from "@/components/server-status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MysticBlocksSMP · Magische Minecraft SMP Server" },
      {
        name: "description",
        content:
          "Sluit je aan bij MysticBlocksSMP, een magische Minecraft SMP (Java + Bedrock). IP: mysticblockssmp.mcsh.io. Join onze Discord community!",
      },
      { property: "og:title", content: "MysticBlocksSMP · Magische Minecraft SMP Server" },
      { property: "og:description", content: "Sluit je aan bij MysticBlocksSMP, een magische Minecraft SMP (Java + Bedrock). IP: mysticblockssmp.mcsh.io. Join onze Discord community!" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: events } = useQuery(eventsQuery);
  const [copied, setCopied] = useState<string | null>(null);

  const ip = settings?.server_ip ?? "mysticblockssmp.mcsh.io";
  const bedrockPort = "19132";
  const upcoming = (events ?? [])
    .filter((e) => new Date(e.event_date).getTime() > Date.now() - 24 * 60 * 60 * 1000)
    .slice(0, 3);
  const openingLines = (settings?.opening_hours_enabled === false ? "" : settings?.opening_hours ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 pt-14 pb-20 sm:pt-24 sm:pb-32">
          <div className="mb-6 flex justify-center">
            <ServerStatus />
          </div>
          <h1 className="text-[2rem] leading-tight break-words sm:text-5xl md:text-7xl font-bold tracking-tight text-glow mb-6">
            {settings?.hero_title ?? "MysticBlocksSMP"}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
            {settings?.hero_subtitle ?? "Een magische Minecraft SMP wereld vol avontuur"}
          </p>
          <div className="flex w-full max-w-md mx-auto flex-col sm:inline-flex sm:w-auto sm:flex-row items-stretch gap-2 bg-card/70 border border-border rounded-xl p-2 shadow-elegant backdrop-blur">
            <div className="min-w-0 px-4 sm:px-5 py-3 text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Server IP</p>
              <p className="text-sm sm:text-lg font-mono text-primary break-all">{ip}</p>
            </div>
            <button
              onClick={() => copy(ip, "ip")}
              className="shrink-0 px-5 sm:px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-glow"
            >
              {copied === "ip" ? "Gekopieerd ✓" : "Kopieer IP"}
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Ondersteunt Java Edition én Bedrock (crossplay)
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={settings?.discord_link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/40 hover:bg-primary/10 transition"
            >
              💬 Join Discord
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Hoe join je?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🖥️</span>
              <h3 className="font-semibold text-lg">Java Edition</h3>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground mb-4 list-decimal list-inside">
              <li>Open Minecraft Java (1.20+)</li>
              <li>Multiplayer → Add Server</li>
              <li>Plak het IP hieronder en join</li>
            </ol>
            <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-background/50 border border-border">
              <span className="min-w-0 font-mono text-xs sm:text-sm text-primary truncate">{ip}</span>
              <button onClick={() => copy(ip, "java")} className="shrink-0 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                {copied === "java" ? "✓" : "Kopieer"}
              </button>
            </div>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📱</span>
              <h3 className="font-semibold text-lg">Bedrock Edition</h3>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground mb-4 list-decimal list-inside">
              <li>Open Minecraft Bedrock (PC, mobiel, console)</li>
              <li>Servers tab → Server toevoegen</li>
              <li>Vul het adres en de poort in</li>
            </ol>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-background/50 border border-border">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Adres</p>
                  <p className="font-mono text-xs sm:text-sm text-primary truncate">{ip}</p>
                </div>
                <button onClick={() => copy(ip, "be-ip")} className="shrink-0 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                  {copied === "be-ip" ? "✓" : "Kopieer"}
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-background/50 border border-border">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Poort</p>
                  <p className="font-mono text-xs sm:text-sm text-primary">{bedrockPort}</p>
                </div>
                <button onClick={() => copy(bedrockPort, "be-port")} className="shrink-0 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                  {copied === "be-port" ? "✓" : "Kopieer"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 sm:p-6 rounded-2xl border border-primary/30 bg-primary/5 text-center">
          <h3 className="font-semibold text-base sm:text-lg mb-1">✨ Ranks verdien je door te spelen</h3>
          <p className="text-sm text-muted-foreground">
            Geen webshop — hoe meer speeltijd je hebt, hoe hoger je rank. Simpel en eerlijk.
          </p>
        </div>
      </section>

      {openingLines.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">🕕 Openingstijden</h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            De server is alleen online tijdens deze tijden.
          </p>
          <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
            {openingLines.map((line, i) => {
              const [day, ...rest] = line.split(/:(.+)/);
              const time = rest.join("").trim();
              return (
                <div key={i} className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 text-sm">
                  <span className="font-medium">{day.trim()}</span>
                  <span className="font-mono text-primary">{time || "—"}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">💬 Onze Discord</h2>
        <div className="flex justify-center">
          <iframe
            src="https://discord.com/widget?id=1511390409035743292&theme=dark"
            title="MysticBlocksSMP Discord"
            width="350"
            height="500"
            allowTransparency
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            className="w-full max-w-[350px] rounded-xl border border-border shadow-elegant"
          />
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">Aankomende evenementen</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {upcoming.map((e) => (
              <div key={e.id} className="p-5 sm:p-6 rounded-2xl bg-card border border-border">
                <p className="text-xs text-primary font-mono mb-2">
                  {new Date(e.event_date).toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" })}
                </p>
                <h3 className="font-semibold text-base sm:text-lg mb-2 break-words">{e.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
