import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { settingsQuery, eventsQuery, staffQuery, ranksQuery, changelogQuery, type SiteSettings, type StaffRow, type RankRow, type ChangelogRow } from "@/lib/queries";
import { adminLogin, adminLogout, adminStatus } from "@/lib/admin.functions";
import {
  updateSettings,
  createEvent,
  deleteEvent,
  createStaff,
  deleteStaff,
  updateStaff,
  createRank,
  updateRank,
  deleteRank,
  swapRankOrder,
  createChangelog,
  updateChangelog,
  deleteChangelog,
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
const PAGES = [
  { path: "/", label: "Home" },
  { path: "/events", label: "Events" },
  { path: "/ranks", label: "Ranks" },
  { path: "/rules", label: "Regels" },
  { path: "/staff", label: "Staff" },
  { path: "/changelog", label: "Changelog" },
];
const btnCls =
  "rounded-lg bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90 transition disabled:opacity-50";

function AdminPage() {
  const statusFn = useServerFn(adminStatus);
  const { data: status, refetch } = useQuery({
    queryKey: ["admin_status"],
    queryFn: () => statusFn(),
  });

  return (
    <SiteLayout bypassMaintenance>
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
  const [tab, setTab] = useState<"settings" | "events" | "staff" | "ranks" | "changelog">("settings");
  const tabs = [
    { id: "settings" as const, label: "Instellingen" },
    { id: "events" as const, label: "Events" },
    { id: "staff" as const, label: "Staff" },
    { id: "ranks" as const, label: "Ranks" },
    { id: "changelog" as const, label: "Changelog" },
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
      {tab === "changelog" && <ChangelogPanel />}
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
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-primary"
          checked={current.opening_hours_enabled ?? true}
          onChange={(e) => set({ opening_hours_enabled: e.target.checked })}
        />
        <span className="text-sm font-medium">🕕 Openingstijden tonen op de homepage</span>
      </label>
      <Field label="Openingstijden (één regel per dag)">
        <textarea
          rows={7}
          className={inputCls}
          value={current.opening_hours ?? ""}
          onChange={(e) => set({ opening_hours: e.target.value })}
        />
      </Field>
      <div className="p-4 rounded-xl border border-border bg-background/40 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary"
            checked={current.maintenance_enabled}
            onChange={(e) => set({ maintenance_enabled: e.target.checked })}
          />
          <span className="text-sm font-medium">🛠️ Onderhoudsmodus (site tonen als onderhoud, admin blijft bereikbaar)</span>
        </label>
        <Field label="Onderhoudstekst">
          <textarea rows={3} className={inputCls} value={current.maintenance_text} onChange={(e) => set({ maintenance_text: e.target.value })} />
        </Field>
        <div>
          <span className="text-xs uppercase text-muted-foreground">Pagina's in onderhoud</span>
          <div className="mt-2 grid sm:grid-cols-2 gap-2">
            {PAGES.map((p) => {
              const list = current.maintenance_pages ?? [];
              const checked = list.includes(p.path);
              return (
                <label key={p.path} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary"
                    checked={checked}
                    onChange={(e) =>
                      set({
                        maintenance_pages: e.target.checked
                          ? [...list, p.path]
                          : list.filter((x) => x !== p.path),
                      })
                    }
                  />
                  <span>{p.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
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
          <StaffRow key={s.id} row={s} onDelete={async () => {
            await delFn({ data: { id: s.id } });
            await qc.invalidateQueries({ queryKey: ["staff"] });
          }} />
        ))}
      </div>
    </Panel>
  );
}

function StaffRow({ row, onDelete }: { row: StaffRow; onDelete: () => void | Promise<void> }) {
  const qc = useQueryClient();
  const updateFn = useServerFn(updateStaff);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(row.name);
  const [role, setRole] = useState(row.role);
  const [description, setDescription] = useState(row.description);
  const [saving, setSaving] = useState(false);

  if (editing) {
    return (
      <div className="p-3 rounded-lg bg-background/40 border border-border space-y-2">
        <div className="grid md:grid-cols-3 gap-2">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputCls} value={role} onChange={(e) => setRole(e.target.value)} />
          <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button
            className={btnCls}
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await updateFn({ data: { id: row.id, name, role, description } });
                await qc.invalidateQueries({ queryKey: ["staff"] });
                setEditing(false);
              } finally { setSaving(false); }
            }}
          >Opslaan</button>
          <button className="text-sm px-3 py-2 rounded-md border border-border hover:bg-secondary transition" onClick={() => {
            setName(row.name); setRole(row.role); setDescription(row.description); setEditing(false);
          }}>Annuleren</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background/40 border border-border">
      <div>
        <p className="font-medium">
          {row.name} <span className="text-primary text-sm">· {row.role}</span>
        </p>
        <p className="text-sm text-muted-foreground">{row.description}</p>
      </div>
      <div className="flex gap-3">
        <button className="text-sm text-primary hover:underline" onClick={() => setEditing(true)}>Bewerk</button>
        <button className="text-sm text-destructive hover:underline" onClick={onDelete}>Verwijder</button>
      </div>
    </div>
  );
}

function RanksPanel() {
  return <RanksPanelInner />;
}

function ChangelogPanel() {
  const qc = useQueryClient();
  const { data: entries } = useQuery(changelogQuery);
  const createFn = useServerFn(createChangelog);
  const delFn = useServerFn(deleteChangelog);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState("");

  return (
    <Panel title="Changelog beheren">
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Titel"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Datum"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <div className="md:col-span-2">
          <Field label="Beschrijving"><textarea rows={4} className={inputCls} value={body} onChange={(e) => setBody(e.target.value)} /></Field>
        </div>
      </div>
      <button
        className={btnCls}
        onClick={async () => {
          if (!title) return;
          const iso = date ? new Date(date).toISOString() : new Date().toISOString();
          await createFn({ data: { title, body, entry_date: iso } });
          setTitle(""); setBody(""); setDate("");
          await qc.invalidateQueries({ queryKey: ["changelog"] });
        }}
      >
        Update toevoegen
      </button>
      <div className="space-y-2 pt-4">
        {entries?.map((c) => (
          <ChangelogRowEditor key={c.id} row={c} onDelete={async () => {
            await delFn({ data: { id: c.id } });
            await qc.invalidateQueries({ queryKey: ["changelog"] });
          }} />
        ))}
      </div>
    </Panel>
  );
}

function ChangelogRowEditor({ row, onDelete }: { row: ChangelogRow; onDelete: () => void | Promise<void> }) {
  const qc = useQueryClient();
  const updateFn = useServerFn(updateChangelog);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(row.title);
  const [body, setBody] = useState(row.body);
  const [date, setDate] = useState(row.entry_date.slice(0, 10));
  const [saving, setSaving] = useState(false);

  if (editing) {
    return (
      <div className="p-3 rounded-lg bg-background/40 border border-border space-y-2">
        <div className="grid md:grid-cols-2 gap-2">
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <textarea rows={4} className={inputCls} value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="flex gap-2">
          <button
            className={btnCls}
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await updateFn({ data: { id: row.id, title, body, entry_date: new Date(date).toISOString() } });
                await qc.invalidateQueries({ queryKey: ["changelog"] });
                setEditing(false);
              } finally { setSaving(false); }
            }}
          >Opslaan</button>
          <button className="text-sm px-3 py-2 rounded-md border border-border hover:bg-secondary transition" onClick={() => {
            setTitle(row.title); setBody(row.body); setDate(row.entry_date.slice(0, 10)); setEditing(false);
          }}>Annuleren</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-background/40 border border-border">
      <div className="min-w-0">
        <p className="text-xs text-primary font-mono">{new Date(row.entry_date).toLocaleDateString("nl-NL", { dateStyle: "long" })}</p>
        <p className="font-medium">{row.title}</p>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{row.body}</p>
      </div>
      <div className="flex gap-3 shrink-0">
        <button className="text-sm text-primary hover:underline" onClick={() => setEditing(true)}>Bewerk</button>
        <button className="text-sm text-destructive hover:underline" onClick={onDelete}>Verwijder</button>
      </div>
    </div>
  );
}

function RanksPanelInner() {
  const qc = useQueryClient();
  const { data: ranks } = useQuery(ranksQuery);
  const createFn = useServerFn(createRank);
  const delFn = useServerFn(deleteRank);
  const [name, setName] = useState("");
  const [requirement, setRequirement] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#a78bfa");

  return (
    <Panel title="Ranks beheren">
      <div className="grid md:grid-cols-4 gap-3">
        <Field label="Naam"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Vereiste"><input className={inputCls} placeholder="bv. 10 uur speeltijd" value={requirement} onChange={(e) => setRequirement(e.target.value)} /></Field>
        <Field label="Beschrijving"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <Field label="Kleur"><input type="color" className="w-full h-10 rounded-lg bg-input border border-border" value={color} onChange={(e) => setColor(e.target.value)} /></Field>
      </div>
      <button
        className={btnCls}
        onClick={async () => {
          if (!name) return;
          await createFn({ data: { name, requirement, description, color, sort_order: (ranks?.length ?? 0) + 1 } });
          setName(""); setRequirement(""); setDescription(""); setColor("#a78bfa");
          await qc.invalidateQueries({ queryKey: ["ranks"] });
        }}
      >
        Rank toevoegen
      </button>
      <div className="space-y-2 pt-4">
        {ranks?.map((r) => (
          <RankRowEditor key={r.id} row={r} onDelete={async () => {
            await delFn({ data: { id: r.id } });
            await qc.invalidateQueries({ queryKey: ["ranks"] });
          }} />
        ))}
      </div>
    </Panel>
  );
}

function RankRowEditor({ row, onDelete }: { row: RankRow; onDelete: () => void | Promise<void> }) {
  const qc = useQueryClient();
  const updateFn = useServerFn(updateRank);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(row.name);
  const [requirement, setRequirement] = useState(row.requirement);
  const [description, setDescription] = useState(row.description);
  const [color, setColor] = useState(row.color);
  const [sortOrder, setSortOrder] = useState(row.sort_order);
  const [saving, setSaving] = useState(false);

  if (editing) {
    return (
      <div className="p-3 rounded-lg bg-background/40 border border-border space-y-2">
        <div className="grid md:grid-cols-5 gap-2">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputCls} value={requirement} onChange={(e) => setRequirement(e.target.value)} />
          <input className={inputCls + " md:col-span-2"} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex gap-2">
            <input type="color" className="w-14 h-10 rounded-lg bg-input border border-border" value={color} onChange={(e) => setColor(e.target.value)} />
            <input type="number" className={inputCls} value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value || "0", 10))} />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className={btnCls}
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await updateFn({ data: { id: row.id, name, requirement, description, color, sort_order: sortOrder } });
                await qc.invalidateQueries({ queryKey: ["ranks"] });
                setEditing(false);
              } finally { setSaving(false); }
            }}
          >Opslaan</button>
          <button className="text-sm px-3 py-2 rounded-md border border-border hover:bg-secondary transition" onClick={() => {
            setName(row.name); setRequirement(row.requirement); setDescription(row.description); setColor(row.color); setSortOrder(row.sort_order); setEditing(false);
          }}>Annuleren</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background/40 border border-border">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
        <div className="min-w-0">
          <p className="font-medium truncate">
            {row.name} <span className="text-muted-foreground text-sm">· {row.requirement || "—"}</span>
          </p>
          <p className="text-sm text-muted-foreground truncate">{row.description}</p>
        </div>
      </div>
      <div className="flex gap-3 shrink-0">
        <button className="text-sm text-primary hover:underline" onClick={() => setEditing(true)}>Bewerk</button>
        <button className="text-sm text-destructive hover:underline" onClick={onDelete}>Verwijder</button>
      </div>
    </div>
  );
}