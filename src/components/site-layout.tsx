import { Link, useRouterState } from "@tanstack/react-router";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const normalized = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const pageInMaintenance = (settings?.maintenance_pages ?? []).includes(normalized);

  if ((settings?.maintenance_enabled || pageInMaintenance) && !bypassMaintenance) {
    return (
      <div className="min-h-screen bg-hero text-foreground flex items-center justify-center px-6">
        <div className="max-w-lg text-center p-10 rounded-2xl bg-card/80 border border-border shadow-elegant backdrop-blur">
          <div className="text-5xl mb-4">🛠️</div>
          <h1 className="text-3xl font-bold text-glow mb-4">Onderhoud</h1>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {settings?.maintenance_text || "We zijn even bezig met onderhoud. Kom later terug!"}
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
          ✨ {settings.announcement} ✨
        </div>
      )}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 md:gap-4 px-4 sm:px-6 py-3 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 group">
            <span className="shrink-0 text-xl sm:text-2xl">🔮</span>
            <span className="truncate font-semibold tracking-wide text-base sm:text-lg text-glow group-hover:text-primary transition-colors">
              MysticBlocks<span className="text-primary">SMP</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 justify-self-end">
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
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-glow"
          >
            Discord
          </a>
        </div>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-3 pb-2 pt-1 border-t border-border/50 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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