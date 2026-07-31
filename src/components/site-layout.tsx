import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/ranks", label: "Ranks" },
  { to: "/rules", label: "Regels" },
  { to: "/staff", label: "Staff" },
  { to: "/changelog", label: "Changelog" },
];

export function SiteLayout({ children, bypassMaintenance }: { children: ReactNode; bypassMaintenance?: boolean }) {
  const { data: settings } = useQuery(settingsQuery);

  if (settings?.maintenance_enabled && !bypassMaintenance) {
    return (
      <div className="min-h-screen bg-hero text-foreground flex items-center justify-center px-6">
        <div className="max-w-lg text-center p-10 rounded-2xl bg-card/80 border border-border shadow-elegant backdrop-blur">
          <div className="text-5xl mb-4">🛠️</div>
          <h1 className="text-3xl font-bold text-glow mb-4">Onderhoud</h1>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {settings.maintenance_text || "We zijn even bezig met onderhoud. Kom later terug!"}
          </p>
          <Link to="/admin" className="mt-8 inline-block text-xs text-muted-foreground/60 hover:text-primary">
            Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero text-foreground">
      {settings?.announcement && (
        <div className="w-full bg-accent/90 text-accent-foreground text-center text-sm py-2 px-4 font-medium">
          ✨ {settings.announcement}
        </div>
      )}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🔮</span>
            <span className="font-semibold tracking-wide text-lg text-glow group-hover:text-primary transition-colors">
              MysticBlocks<span className="text-primary">SMP</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                activeProps={{ className: "px-3 py-2 rounded-md text-sm text-primary bg-secondary/60" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <a
            href={settings?.discord_link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-glow"
          >
            Discord
          </a>
        </div>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2 border-t border-border/50">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-md text-xs text-muted-foreground whitespace-nowrap"
              activeProps={{ className: "px-3 py-2 rounded-md text-xs text-primary whitespace-nowrap" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border mt-24 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MysticBlocksSMP · Niet aangesloten bij Mojang of Microsoft</p>
        <Link to="/admin" className="text-xs text-muted-foreground/60 hover:text-primary mt-2 inline-block">
          Admin
        </Link>
      </footer>
    </div>
  );
}