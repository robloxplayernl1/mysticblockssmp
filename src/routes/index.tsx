import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { settingsQuery, eventsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MysticBlocksSMP · Magische Minecraft SMP Server" },
      {
        name: "description",
        content:
          "Sluit je aan bij MysticBlocksSMP, een magische Minecraft SMP wereld. IP: mysticblockssmp.mcsh.io. Join onze Discord community!",
      },
      { property: "og:title", content: "MysticBlocksSMP · Magische Minecraft SMP" },
      { property: "og:description", content: "Sluit je aan bij onze magische Minecraft SMP wereld." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: events } = useQuery(eventsQuery);
  const [copied, setCopied] = useState(false);

  const ip = settings?.server_ip ?? "mysticblockssmp.mcsh.io";
  const upcoming = (events ?? [])
    .filter((e) => new Date(e.event_date).getTime() > Date.now() - 24 * 60 * 60 * 1000)
    .slice(0, 3);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center px-6 pt-24 pb-32">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Server is online
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-glow mb-6">
            {settings?.hero_title ?? "MysticBlocksSMP"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {settings?.hero_subtitle ?? "Een magische Minecraft SMP wereld vol avontuur"}
          </p>
          <div className="inline-flex flex-col sm:flex-row items-stretch gap-2 bg-card/70 border border-border rounded-xl p-2 shadow-elegant backdrop-blur">
            <div className="px-5 py-3 text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Server IP</p>
              <p className="text-lg font-mono text-primary">{ip}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(ip);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-glow"
            >
              {copied ? "Gekopieerd ✓" : "Kopieer IP"}
            </button>
          </div>
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

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Hoe join je?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: 1, t: "Open Minecraft", d: "Start Minecraft Java Edition (1.20+)." },
            { n: 2, t: "Voeg server toe", d: `Ga naar Multiplayer → Add Server en gebruik het IP: ${ip}` },
            { n: 3, t: "Speel!", d: "Verbind, en betreed onze mystieke wereld." },
          ].map((s) => (
            <div key={s.n} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition group">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold mb-4 group-hover:shadow-glow transition">
                {s.n}
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {upcoming.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Aankomende evenementen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {upcoming.map((e) => (
              <div key={e.id} className="p-6 rounded-2xl bg-card border border-border">
                <p className="text-xs text-primary font-mono mb-2">
                  {new Date(e.event_date).toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" })}
                </p>
                <h3 className="font-semibold text-lg mb-2">{e.title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
