import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { settingsQuery, eventsQuery, staffQuery, ranksQuery, changelogQuery, rsvpsQuery, pollsQuery, type SiteSettings, type StaffRow, type RankRow, type ChangelogRow } from "@/lib/queries";
import {
  adminLogin,
  adminLogout,
  adminStatus,
  listAdmins,
  createAdminUser,
  changeAdminPassword,
  deleteAdminUser,
  type AdminUserRow,
} from "@/lib/admin.functions";
import {
  updateSettings,
  createEvent,
  deleteEvent,
  createStaff,
  deleteStaff,
  updateStaff,
  uploadStaffAvatar,
  removeStaffAvatar,
  createRank,
  updateRank,
  deleteRank,
  swapRankOrder,
  createChangelog,
  updateChangelog,
  deleteChangelog,
  listRequests,
  setRequestHandled,
  deleteRequest,
  deleteRsvp,
  setEventRsvpEnabled,
  createPoll,
  setPollOpen,
  deletePoll,
  type AdminRequestRow,
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

const inputCls = "w-full min-w-0 rounded-lg bg-input border border-border px-3 py-2 text-sm sm:text-base";
const PAGES = [
  { path: "/", label: "Home" },
  { path: "/events", label: "Events" },
  { path: "/ranks", label: "Ranks" },
  { path: "/rules", label: "Regels" },
  { path: "/staff", label: "Staff" },
  { path: "/polls", label: "Peilingen" },
  { path: "/changelog", label: "Changelog" },
];
const btnCls =
  "rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm sm:text-base font-medium hover:opacity-90 transition disabled:opacity-50";

function AdminPage() {
  const statusFn = useServerFn(adminStatus);
  const { data: status, refetch } = useQuery({
    queryKey: ["admin_status"],
    queryFn: () => statusFn(),
  });

  return (
    <SiteLayout bypassMaintenance>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        <h1 className="text-2xl sm:text-4xl font-bold text-glow mb-6 sm:mb-8 text-center">Admin Panel</h1>
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
    <form onSubmit={submit} className="max-w-sm mx-auto p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant space-y-4">
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
  const [tab, setTab] = useState<
    "settings" | "events" | "polls" | "staff" | "ranks" | "changelog" | "requests" | "admins"
  >("settings");
  const tabs = [
    { id: "settings" as const, label: "Instellingen" },
    { id: "events" as const, label: "Events" },
    { id: "polls" as const, label: "Peilingen" },
    { id: "staff" as const, label: "Staff" },
    { id: "ranks" as const, label: "Ranks" },
    { id: "changelog" as const, label: "Changelog" },
    { id: "requests" as const, label: "Verzoeken" },
    { id: "admins" as const, label: "Beheerders" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
        <div className="flex gap-1 p-1 bg-card rounded-lg border border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm whitespace-nowrap transition ${
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
          className="shrink-0 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-md border border-border hover:bg-secondary transition"
        >
          Uitloggen
        </button>
      </div>
      {tab === "settings" && <SettingsPanel />}
      {tab === "events" && <EventsPanel />}
      {tab === "polls" && <PollsPanel />}
      {tab === "staff" && <StaffPanel />}
      {tab === "ranks" && <RanksPanel />}
      {tab === "changelog" && <ChangelogPanel />}
      {tab === "requests" && <RequestsPanel />}
      {tab === "admins" && <AdminsPanel />}
    </div>
  );
}

function AdminsPanel() {
  const load = useServerFn(listAdmins);
  const createFn = useServerFn(createAdminUser);
  const passFn = useServerFn(changeAdminPassword);
  const delFn = useServerFn(deleteAdminUser);
  const { data, refetch } = useQuery<AdminUserRow[]>({
    queryKey: ["admin_users"],
    queryFn: () => load() as Promise<AdminUserRow[]>,
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [newPass, setNewPass] = useState<Record<string, string>>({});

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await createFn({ data: { username: username.trim(), password } });
      setUsername("");
      setPassword("");
      setMsg("Beheerder aangemaakt.");
      await refetch();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Aanmaken mislukt");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Nieuwe beheerder">
        <form onSubmit={addAdmin} className="grid gap-3 sm:grid-cols-2">
          <Field label="Gebruikersnaam">
            <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputCls} required minLength={3} />
          </Field>
          <Field label="Wachtwoord (min. 8 tekens)">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </Field>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={busy} className={btnCls}>
              {busy ? "Bezig..." : "Beheerder toevoegen"}
            </button>
            {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          </div>
        </form>
      </Panel>

      <Panel title="Beheerders">
        {(data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">Nog geen extra beheerders. Het hoofdaccount blijft altijd werken.</p>
        )}
        <div className="space-y-3">
          {(data ?? []).map((a) => (
            <div key={a.id} className="p-3 sm:p-4 rounded-lg bg-secondary/40 border border-border space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium break-words">{a.username}</span>
                <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("nl-NL")}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  placeholder="Nieuw wachtwoord"
                  value={newPass[a.id] ?? ""}
                  onChange={(e) => setNewPass({ ...newPass, [a.id]: e.target.value })}
                  className={inputCls + " sm:max-w-xs"}
                  autoComplete="new-password"
                />
                <button
                  onClick={async () => {
                    const pw = newPass[a.id] ?? "";
                    if (pw.length < 8) {
                      setMsg("Wachtwoord moet minstens 8 tekens zijn");
                      return;
                    }
                    try {
                      await passFn({ data: { id: a.id, password: pw } });
                      setNewPass({ ...newPass, [a.id]: "" });
                      setMsg("Wachtwoord aangepast.");
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Aanpassen mislukt");
                    }
                  }}
                  className="text-xs px-3 py-2 rounded-md border border-border hover:bg-secondary transition"
                >
                  Wachtwoord wijzigen
                </button>
                <button
                  onClick={async () => {
                    try {
                      await delFn({ data: { id: a.id } });
                      await refetch();
                    } catch (err) {
                      setMsg(err instanceof Error ? err.message : "Verwijderen mislukt");
                    }
                  }}
                  className="text-xs px-3 py-2 rounded-md border border-destructive/50 text-destructive hover:bg-destructive/10 transition"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RequestsPanel() {
  const load = useServerFn(listRequests);
  const toggle = useServerFn(setRequestHandled);
  const remove = useServerFn(deleteRequest);
  const { data, refetch } = useQuery<AdminRequestRow[]>({
    queryKey: ["admin_requests"],
    queryFn: () => load() as Promise<AdminRequestRow[]>,
  });

  const labels: Record<string, string> = {
    contact: "Contact",
    inzage: "Inzage",
    verwijdering: "Verwijdering",
    export: "Export",
  };

  return (
    <Panel title="Binnengekomen verzoeken">
      {(data ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nog geen verzoeken.</p>}
      <div className="space-y-3">
        {(data ?? []).map((r) => (
          <div key={r.id} className="p-3 sm:p-4 rounded-lg bg-secondary/40 border border-border space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary">{labels[r.kind] ?? r.kind}</span>
              <span className="text-muted-foreground">{new Date(r.created_at).toLocaleString("nl-NL")}</span>
              {r.handled && <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400">Afgehandeld</span>}
            </div>
            <div className="text-sm font-medium break-words">
              {r.name} · {r.email}
              {r.minecraft_name ? ` · MC: ${r.minecraft_name}` : ""}
            </div>
            {r.subject && <div className="text-sm break-words">{r.subject}</div>}
            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{r.message}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  await toggle({ data: { id: r.id, handled: !r.handled } });
                  await refetch();
                }}
                className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-secondary transition"
              >
                {r.handled ? "Markeer als open" : "Markeer afgehandeld"}
              </button>
              <button
                onClick={async () => {
                  await remove({ data: { id: r.id } });
                  await refetch();
                }}
                className="text-xs px-3 py-1.5 rounded-md border border-destructive/50 text-destructive hover:bg-destructive/10 transition"
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-card border border-border shadow-elegant space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
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

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EventEditor({ event, onDone }: { event: EventRow; onDone: () => void }) {
  const qc = useQueryClient();
  const saveFn = useServerFn(updateEvent);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(toLocalInput(event.event_date));
  const [endDate, setEndDate] = useState(toLocalInput(event.end_date));
  const [location, setLocation] = useState(event.location);
  const [max, setMax] = useState(String(event.max_participants ?? 0));
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Field label="Titel"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Start"><input type="datetime-local" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Einde (optioneel)"><input type="datetime-local" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Field>
        <Field label="Locatie"><input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} /></Field>
        <Field label="Max. deelnemers (0 = geen limiet)">
          <input type="number" min={0} className={inputCls} value={max} onChange={(e) => setMax(e.target.value)} />
        </Field>
        <div className="sm:col-span-2 md:col-span-3">
          <Field label="Beschrijving"><textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button
          className={btnCls}
          onClick={async () => {
            setError(null);
            try {
              await saveFn({
                data: {
                  id: event.id,
                  title,
                  description,
                  event_date: new Date(date).toISOString(),
                  end_date: endDate ? new Date(endDate).toISOString() : null,
                  location,
                  max_participants: Number(max) || 0,
                },
              });
              await qc.invalidateQueries({ queryKey: ["events"] });
              onDone();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Opslaan mislukt");
            }
          }}
        >
          Opslaan
        </button>
        <button className="text-sm px-4 py-2 rounded-lg border border-border hover:bg-secondary transition" onClick={onDone}>
          Annuleren
        </button>
      </div>
    </div>
  );
}

function EventsPanel() {
  const qc = useQueryClient();
  const { data: events } = useQuery(eventsQuery);
  const { data: rsvps } = useQuery(rsvpsQuery);
  const createFn = useServerFn(createEvent);
  const delFn = useServerFn(deleteEvent);
  const rsvpToggle = useServerFn(setEventRsvpEnabled);
  const rsvpDelete = useServerFn(deleteRsvp);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [max, setMax] = useState("0");
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <Panel title="Events beheren">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Field label="Titel"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Start"><input type="datetime-local" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Einde (optioneel)"><input type="datetime-local" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Field>
        <Field label="Locatie"><input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="bijv. Spawn arena" /></Field>
        <Field label="Max. deelnemers (0 = geen limiet)">
          <input type="number" min={0} className={inputCls} value={max} onChange={(e) => setMax(e.target.value)} />
        </Field>
        <div className="sm:col-span-2 md:col-span-3">
          <Field label="Beschrijving"><textarea rows={3} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        </div>
      </div>
      <button
        className={btnCls}
        onClick={async () => {
          if (!title || !date) return;
          await createFn({
            data: {
              title,
              description,
              event_date: new Date(date).toISOString(),
              end_date: endDate ? new Date(endDate).toISOString() : null,
              location,
              max_participants: Number(max) || 0,
            },
          });
          setTitle(""); setDescription(""); setDate(""); setEndDate(""); setLocation(""); setMax("0");
          await qc.invalidateQueries({ queryKey: ["events"] });
        }}
      >
        Event toevoegen
      </button>
      <div className="space-y-2 pt-4">
        {events?.map((e) => (
          <div key={e.id} className="p-3 rounded-lg bg-background/40 border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <p className="font-medium break-words">{e.title}</p>
                <p className="text-xs text-primary">
                  {new Date(e.event_date).toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" })}
                  {e.end_date
                    ? ` – ${new Date(e.end_date).toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" })}`
                    : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {e.location ? `📍 ${e.location}` : "Geen locatie"} ·{" "}
                  {e.max_participants > 0 ? `max ${e.max_participants} deelnemers` : "geen deelnemerslimiet"}
                </p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{e.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-start">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={e.rsvp_enabled}
                    onChange={async (ev) => {
                      await rsvpToggle({ data: { id: e.id, enabled: ev.target.checked } });
                      await qc.invalidateQueries({ queryKey: ["events"] });
                    }}
                  />
                  Aanmelden aan
                </label>
                <button className="text-sm text-primary hover:underline" onClick={() => setEditing(editing === e.id ? null : e.id)}>
                  {editing === e.id ? "Sluit" : "Bewerk"}
                </button>
                <button
                  className="text-sm text-destructive hover:underline"
                  onClick={async () => {
                    await delFn({ data: { id: e.id } });
                    await qc.invalidateQueries({ queryKey: ["events"] });
                    await qc.invalidateQueries({ queryKey: ["event_rsvps"] });
                  }}
                >
                  Verwijder
                </button>
              </div>
            </div>
            {editing === e.id && <EventEditor event={e} onDone={() => setEditing(null)} />}
            <div>
              <p className="text-xs uppercase text-muted-foreground mb-1">
                Aanmeldingen ({(rsvps ?? []).filter((r) => r.event_id === e.id).length})
              </p>
              <div className="flex flex-wrap gap-2">
                {(rsvps ?? []).filter((r) => r.event_id === e.id).map((r) => (
                  <span key={r.id} className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md border border-border bg-card">
                    {r.minecraft_name}
                    <button
                      className="text-destructive"
                      title="Verwijder aanmelding"
                      onClick={async () => {
                        await rsvpDelete({ data: { id: r.id } });
                        await qc.invalidateQueries({ queryKey: ["event_rsvps"] });
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {(rsvps ?? []).filter((r) => r.event_id === e.id).length === 0 && (
                  <span className="text-xs text-muted-foreground">Nog geen aanmeldingen</span>
                )}
              </div>
            </div>
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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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
  const uploadFn = useServerFn(uploadStaffAvatar);
  const removeAvatarFn = useServerFn(removeStaffAvatar);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(row.name);
  const [role, setRole] = useState(row.role);
  const [description, setDescription] = useState(row.description);
  const [saving, setSaving] = useState(false);

  if (editing) {
    return (
      <div className="p-3 rounded-lg bg-background/40 border border-border space-y-2">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 rounded-lg bg-background/40 border border-border">
      <div className="flex items-center gap-3 min-w-0">
        {row.avatar_url ? (
          <img src={row.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold shrink-0">
            {row.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
        <p className="font-medium break-words">
          {row.name} <span className="text-primary text-sm">· {row.role}</span>
        </p>
        <p className="text-sm text-muted-foreground break-words">{row.description}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <label className="text-xs text-primary hover:underline cursor-pointer">
            {uploading ? "Uploaden…" : row.avatar_url ? "Foto wijzigen" : "Foto uploaden"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setUploadError(null);
                if (file.size > 3_000_000) { setUploadError("Max 3MB"); return; }
                setUploading(true);
                try {
                  const buf = new Uint8Array(await file.arrayBuffer());
                  let bin = "";
                  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
                  await uploadFn({ data: { id: row.id, fileName: file.name, contentType: file.type, dataBase64: btoa(bin) } });
                  await qc.invalidateQueries({ queryKey: ["staff"] });
                } catch (err) {
                  setUploadError(err instanceof Error ? err.message : "Upload mislukt");
                } finally { setUploading(false); }
              }}
            />
          </label>
          {row.avatar_url && (
            <button
              className="text-xs text-destructive hover:underline"
              onClick={async () => {
                await removeAvatarFn({ data: { id: row.id } });
                await qc.invalidateQueries({ queryKey: ["staff"] });
              }}
            >Foto verwijderen</button>
          )}
          {uploadError && <span className="text-xs text-destructive">{uploadError}</span>}
        </div>
        </div>
      </div>
      <div className="flex gap-3 shrink-0">
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
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Titel"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Datum"><input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <div className="sm:col-span-2">
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
        <div className="grid sm:grid-cols-2 gap-2">
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
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 p-3 rounded-lg bg-background/40 border border-border">
      <div className="min-w-0">
        <p className="text-xs text-primary font-mono">{new Date(row.entry_date).toLocaleDateString("nl-NL", { dateStyle: "long" })}</p>
        <p className="font-medium break-words">{row.title}</p>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{row.body}</p>
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
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
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
        {ranks?.map((r, i) => (
          <RankRowEditor
            key={r.id}
            row={r}
            prevId={ranks[i - 1]?.id}
            nextId={ranks[i + 1]?.id}
            onDelete={async () => {
              await delFn({ data: { id: r.id } });
              await qc.invalidateQueries({ queryKey: ["ranks"] });
            }}
          />
        ))}
      </div>
    </Panel>
  );
}

function RankRowEditor({ row, prevId, nextId, onDelete }: { row: RankRow; prevId?: string; nextId?: string; onDelete: () => void | Promise<void> }) {
  const qc = useQueryClient();
  const updateFn = useServerFn(updateRank);
  const swapFn = useServerFn(swapRankOrder);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(row.name);
  const [requirement, setRequirement] = useState(row.requirement);
  const [description, setDescription] = useState(row.description);
  const [color, setColor] = useState(row.color);
  const [sortOrder, setSortOrder] = useState(row.sort_order);
  const [saving, setSaving] = useState(false);

  const swap = async (otherId?: string) => {
    if (!otherId) return;
    await swapFn({ data: { idA: row.id, idB: otherId } });
    await qc.invalidateQueries({ queryKey: ["ranks"] });
  };

  if (editing) {
    return (
      <div className="p-3 rounded-lg bg-background/40 border border-border space-y-2">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputCls} value={requirement} onChange={(e) => setRequirement(e.target.value)} />
          <input className={inputCls + " sm:col-span-2"} value={description} onChange={(e) => setDescription(e.target.value)} />
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 rounded-lg bg-background/40 border border-border">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
        <div className="min-w-0">
          <p className="font-medium truncate">
            {row.name} <span className="text-muted-foreground text-sm">· {row.requirement || "—"}</span>
          </p>
          <p className="text-sm text-muted-foreground truncate">{row.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
        <div className="flex flex-col">
          <button
            disabled={!prevId}
            onClick={() => swap(prevId)}
            className="px-2 py-0.5 text-xs rounded-t-md border border-border hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Omhoog"
          >▲</button>
          <button
            disabled={!nextId}
            onClick={() => swap(nextId)}
            className="px-2 py-0.5 text-xs rounded-b-md border border-t-0 border-border hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Omlaag"
          >▼</button>
        </div>
        <button className="text-sm text-primary hover:underline" onClick={() => setEditing(true)}>Bewerk</button>
        <button className="text-sm text-destructive hover:underline" onClick={onDelete}>Verwijder</button>
      </div>
    </div>
  );
}
function PollsPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(pollsQuery);
  const createFn = useServerFn(createPoll);
  const openFn = useServerFn(setPollOpen);
  const delFn = useServerFn(deletePoll);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [msg, setMsg] = useState<string | null>(null);

  const polls = data?.polls ?? [];
  const allOptions = data?.options ?? [];
  const votes = data?.votes ?? [];

  return (
    <Panel title="Peilingen beheren">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Vraag"><input className={inputCls} value={question} onChange={(e) => setQuestion(e.target.value)} /></Field>
        <Field label="Toelichting"><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase text-muted-foreground">Antwoordopties</p>
        {options.map((o, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls}
              value={o}
              placeholder={`Optie ${i + 1}`}
              onChange={(e) => setOptions(options.map((v, j) => (j === i ? e.target.value : v)))}
            />
            {options.length > 2 && (
              <button
                className="text-sm text-destructive px-2"
                onClick={() => setOptions(options.filter((_, j) => j !== i))}
              >✕</button>
            )}
          </div>
        ))}
        {options.length < 10 && (
          <button className="text-sm text-primary hover:underline" onClick={() => setOptions([...options, ""])}>
            + Optie toevoegen
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          className={btnCls}
          onClick={async () => {
            setMsg(null);
            try {
              await createFn({
                data: { question, description, options: options.map((o) => o.trim()).filter(Boolean) },
              });
              setQuestion(""); setDescription(""); setOptions(["", ""]);
              await qc.invalidateQueries({ queryKey: ["polls"] });
            } catch (e: unknown) {
              setMsg(e instanceof Error ? e.message : "Aanmaken mislukt");
            }
          }}
        >
          Peiling aanmaken
        </button>
        {msg && <span className="text-sm text-destructive">{msg}</span>}
      </div>

      <div className="space-y-3 pt-4">
        {polls.map((p) => {
          const opts = allOptions.filter((o) => o.poll_id === p.id);
          const total = votes.filter((v) => v.poll_id === p.id).length;
          return (
            <div key={p.id} className="p-3 rounded-lg bg-background/40 border border-border space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium break-words">{p.question}</p>
                  <p className="text-xs text-muted-foreground">{p.is_open ? "Open" : "Gesloten"} · {total} stemmen</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    className="text-sm text-primary hover:underline"
                    onClick={async () => {
                      await openFn({ data: { id: p.id, open: !p.is_open } });
                      await qc.invalidateQueries({ queryKey: ["polls"] });
                    }}
                  >
                    {p.is_open ? "Sluiten" : "Openen"}
                  </button>
                  <button
                    className="text-sm text-destructive hover:underline"
                    onClick={async () => {
                      await delFn({ data: { id: p.id } });
                      await qc.invalidateQueries({ queryKey: ["polls"] });
                    }}
                  >
                    Verwijder
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {opts.map((o) => {
                  const count = votes.filter((v) => v.option_id === o.id).length;
                  const pct = total ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={o.id}>
                      <div className="flex justify-between text-xs">
                        <span className="truncate">{o.label}</span>
                        <span className="text-muted-foreground shrink-0 ml-2">{count} · {pct}%</span>
                      </div>
                      <div className="h-2 rounded bg-secondary overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
