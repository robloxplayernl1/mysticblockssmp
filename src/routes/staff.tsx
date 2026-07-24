import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { staffQuery } from "@/lib/queries";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff · MysticBlocksSMP" },
      { name: "description", content: "Maak kennis met het staff team van MysticBlocksSMP." },
      { property: "og:title", content: "Staff · MysticBlocksSMP" },
      { property: "og:description", content: "Het staff team van MysticBlocksSMP." },
    ],
  }),
  component: StaffPage,
});

function StaffPage() {
  const { data: staff } = useQuery(staffQuery);
  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Ons Team</h1>
        <p className="text-center text-muted-foreground mb-12">
          De mensen die MysticBlocksSMP draaiende houden.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {staff?.map((s) => (
            <div key={s.id} className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/50 transition">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow">
                {s.name.slice(0, 1).toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p className="text-primary text-sm mb-3">{s.role}</p>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}