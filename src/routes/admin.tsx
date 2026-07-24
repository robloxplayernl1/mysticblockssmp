import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { settingsQuery, eventsQuery, staffQuery, ranksQuery, type SiteSettings } from "@/lib/queries";
import { adminLogin, adminLogout, adminStatus } from "@/lib/admin.functions";
import {
  updateSettings,
  createEvent,
  deleteEvent,
  createStaff,
  deleteStaff,
  createRank,
  deleteRank,
} from "@/lib/site.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · MysticBlocksSMP" },
      { name: "description", content: "Admin panel voor MysticBlocksSMP." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const inputCls = "w-full rounded-lg bg-input border border-border px-3 py-2";
const btnCls =
  "rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition disabled:opacity-50";

function AdminPage() {
  const statusFn = useServerFn(adminStatus);
  const { data: status, refetch } = useQuery({
    queryKey: ["admin_status"],
    queryFn: () => statusFn(),
  });

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-glow mb-8 text-center">Admin Panel</h1>
        {status?.admin ? (
          <AdminDashboard onLogout={() => refetch()} />
        ) : (
          <LoginForm onLoggedIn={() => refetch()} />
        )}
      </div>
    </SiteLayout>
  );
}

function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const loginFn = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginFn({ data: { username, password } });
      if (!res.ok) setError("Onjuiste inloggegevens.");
      else onLoggedIn();
    } catch {
      setError("Er ging iets mis, probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto p-8 rounded-2xl bg-card border border-border shadow-elegant space-y-4">
      <h2 className="text-lg font-semibold text-center">Inloggen</h2>
      <div>
        <label className="text-xs uppercase text-muted-foreground">Gebruikersnaam</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputCls + " mt-1"} autoComplete="username" required />
      </div>
      <div>
        <label className="text-xs uppercase text-muted-foreground">Wachtwoord</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls + " mt-1"} autoComplete="current-password" required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={loading} className={btnCls + " w-full"}>
        {loading ? "Bezig..." : "Inloggen"}
      </button>
    </form>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const logoutFn = useServerFn(adminLogout);
  const [tab, setTab] = useState<"settings" | "events" | "staff" | "ranks">("settings");
  const tabs = [
    { id: "settings" as const, label: "Instellingen" },
    { id: "events" as const, label: "Events" },
    { id: "staff" as const, label: "Staff" },
    { id: "ranks" as const, label: "Ranks" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-card rounded-lg border border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm transition ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={async () => {
            await logoutFn();
            onLogout();
          }}
          className="text-sm px-4 py-2 rounded-md border border-border hover:bg-secondary transition"
        >
          Uitloggen
        </button>
      </div>
      {tab === "settings" && <SettingsPanel />}
      {tab === "events" && <EventsPanel />}
      {tab === "staff" && <StaffPanel />}
      {tab === "ranks" && <RanksPanel />}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-elegant space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function SettingsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const updateFn = useServerFn(updateSettings);
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const current = form ?? data;
  if (!current) return <Panel title="Instellingen">Laden...</Panel>;
  const set = (patch: Partial<SiteSettings>) => setForm({ ...current, ...patch });

  return (
    <Panel title="Site instellingen">
      <Field label="Hero titel">
        <input className={inputCls} value={current.hero_title} onChange={(e) => set({ hero_title: e.target.value })} />
      </Field>
      <Field label="Hero ondertitel">
        <input className={inputCls} value={current.hero_subtitle} onChange={(e) => set({ hero_subtitle: e.target.value })} />
      </Field>
      <Field label="Server IP">
        <input className={inputCls} value={current.server_ip} onChange={(e) => set({ server_ip: e.target.value })} />
      </Field>
      <Field label="Discord link">
        <input className={inputCls} value={current.discord_link} onChange={(e) => set({ discord_link: e.target.value })} />
      </Field>
      <Field label="Aankondiging banner (leeg = uit)">
        <input className={inputCls} value={current.announcement} onChange={(e) => set({ announcement: e.target.value })} />
      </Field>
      <Field label="Regels tekst">
        <textarea rows={8} className={inputCls} value={current.rules_text} onChange={(e) => set({ rules_text: e.target.value })} />
      </Field>
      <div className="flex items-center gap-3">
        <button
          className={btnCls}
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setMsg(null);
            try {
              await updateFn({ data: current });
              await qc.invalidateQueries({ queryKey: ["site_settings"] });
              setMsg("Opgeslagen ✓");
            } catch (e: unknown) {
              setMsg(e instanceof Error ? e.message : "Opslaan mislukt");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </Panel>
  );
}

function EventsPanel() {
  const qc = useQueryClient();
  const { data: events } = useQuery(eventsQuery);
  const createFn = useServerFn(createEvent);
  const delFn = useServerFn(deleteEvent);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  return (
    <Panel title="Events beheren">
      <div className="grid md:grid-cols-3 gap-3">
        <Field label="Titel"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Datum & tijd"><input type="datetime-local" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <div className="md:col-span-3">
          <Field label="Beschrijving"><textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        </div>
      </div>
      <button
        className={btnCls}
        onClick={async () => {
          if (!title || !date) return;
          await createFn({ data: { title, description, event_date: new Date(date).toISOString() } });
          setTitle(""); setDescription(""); setDate("");
          await qc.invalidateQueries({ queryKey: ["events"] });
        }}
      >
        Event toevoegen
      </button>
      <div className="space-y-2 pt-4">
        {events?.map((e) => (
          <div key={e.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-background/40 border border-border">
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-xs text-primary">
                {new Date(e.event_date).toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" })}
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{e.description}</p>
            </div>
            <button
              className="text-sm text-destructive hover:underline"
              onClick={async () => {
                await delFn({ data: { id: e.id } });
                await qc.invalidateQueries({ queryKey: ["events"] });
              }}
            >
              Verwijder
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function StaffPanel() {
  const qc = useQueryClient();
  const { data: staff } = useQuery(staffQuery);
  const createFn = useServerFn(createStaff);
  const delFn = useServerFn(deleteStaff);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Panel title="Staff beheren">
      <div className="grid md:grid-cols-3 gap-3">
        <Field label="Naam"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Rol"><input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Beschrijving"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      </div>
      <button
        className={btnCls}
        onClick={async () => {
          if (!name || !role) return;
          await createFn({ data: { name, role, description, sort_order: (staff?.length ?? 0) + 1 } });
          setName(""); setRole(""); setDescription("");
          await qc.invalidateQueries({ queryKey: ["staff"] });
        }}
      >
        Staff toevoegen
      </button>
      <div className="space-y-2 pt-4">
        {staff?.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background/40 border border-border">
            <div>
              <p className="font-medium">
                {s.name} <span className="text-primary text-sm">· {s.role}</span>
              </p>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
            <button
              className="text-sm text-destructive hover:underline"
              onClick={async () => {
                await delFn({ data: { id: s.id } });
                await qc.invalidateQueries({ queryKey: ["staff"] });
              }}
            >
              Verwijder
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RanksPanel() {
  const qc = useQueryClient();
  const { data: ranks } = useQuery(ranksQuery);
  const createFn = useServerFn(createRank);
  const delFn = useServerFn(deleteRank);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState("");
  const [price, setPrice] = useState("");

  return (
    <Panel title="Ranks beheren">
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Naam"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Prijs"><input className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€4,99 of Gratis" /></Field>
        <div className="md:col-span-2">
          <Field label="Beschrijving"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Perks (één per regel)"><textarea rows={4} className={inputCls} value={perks} onChange={(e) => setPerks(e.target.value)} /></Field>
        </div>
      </div>
      <button
        className={btnCls}
        onClick={async () => {
          if (!name) return;
          await createFn({ data: { name, description, perks, price, sort_order: (ranks?.length ?? 0) + 1 } });
          setName(""); setDescription(""); setPerks(""); setPrice("");
          await qc.invalidateQueries({ queryKey: ["ranks"] });
        }}
      >
        Rank toevoegen
      </button>
      <div className="space-y-2 pt-4">
        {ranks?.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-background/40 border border-border">
            <div>
              <p className="font-medium">
                {r.name} <span className="text-primary text-sm">· {r.price}</span>
              </p>
              <p className="text-sm text-muted-foreground">{r.description}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap mt-1">{r.perks}</p>
            </div>
            <button
              className="text-sm text-destructive hover:underline"
              onClick={async () => {
                await delFn({ data: { id: r.id } });
                await qc.invalidateQueries({ queryKey: ["ranks"] });
              }}
            >
              Verwijder
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}