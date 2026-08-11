import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitRequest } from "@/lib/site.functions";

type Kind = "contact" | "inzage" | "verwijdering" | "export";

const input =
  "w-full rounded-md bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:border-primary transition";

export function RequestForm({
  kinds,
  defaultKind,
  kindLabel,
}: {
  kinds: { value: Kind; label: string }[];
  defaultKind: Kind;
  kindLabel: string;
}) {
  const send = useServerFn(submitRequest);
  const [kind, setKind] = useState<Kind>(defaultKind);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mc, setMc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-primary/40 shadow-elegant text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-xl font-semibold mb-2">Verzoek verstuurd</h2>
        <p className="text-sm text-muted-foreground">
          We hebben je bericht ontvangen en reageren zo snel mogelijk via het opgegeven e-mailadres.
        </p>
      </div>
    );
  }

  return (
    <form
      className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-elegant space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await send({ data: { kind, name, email, minecraft_name: mc, subject, message } });
          setDone(true);
        } catch {
          setError("Versturen is niet gelukt. Controleer je gegevens en probeer het opnieuw.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {kinds.length > 1 && (
        <label className="block">
          <span className="text-xs uppercase text-muted-foreground">{kindLabel}</span>
          <select className={`${input} mt-1`} value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {kinds.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase text-muted-foreground">Naam</span>
          <input className={`${input} mt-1`} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
        </label>
        <label className="block">
          <span className="text-xs uppercase text-muted-foreground">E-mailadres</span>
          <input
            type="email"
            className={`${input} mt-1`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            required
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase text-muted-foreground">Minecraft-naam (optioneel)</span>
          <input className={`${input} mt-1`} value={mc} onChange={(e) => setMc(e.target.value)} maxLength={60} />
        </label>
        <label className="block">
          <span className="text-xs uppercase text-muted-foreground">Onderwerp (optioneel)</span>
          <input className={`${input} mt-1`} value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={150} />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase text-muted-foreground">Bericht</span>
        <textarea
          className={`${input} mt-1 min-h-[140px]`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          required
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full sm:w-auto rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition disabled:opacity-50"
      >
        {busy ? "Versturen..." : "Verzoek versturen"}
      </button>
    </form>
  );
}
