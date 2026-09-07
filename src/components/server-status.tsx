import { useQuery } from "@tanstack/react-query";
import { statusQuery } from "@/lib/queries";

function Badge({ label, online, players }: { label: string; online: boolean; players: { online: number; max: number } }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/70 border border-border backdrop-blur">
      <span
        className={`w-2.5 h-2.5 rounded-full ${online ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" : "bg-rose-500"}`}
      />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">
        {online ? `${players.online}/${players.max}` : "Offline"}
      </span>
    </div>
  );
}

export function ServerStatus() {
  const { data, isLoading } = useQuery(statusQuery);
  if (isLoading || !data) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
        Status laden...
      </div>
    );
  }
  const online = data.java.online && data.java.players.max > 0;
  return (
    <div className="flex justify-center">
      <Badge label="Server" online={online} players={data.java.players} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-background/50 border border-border px-3 py-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm sm:text-base font-mono text-primary break-words">{value}</p>
    </div>
  );
}

export function ServerStatusWidget() {
  const { data, isLoading, isFetching, refetch } = useQuery(statusQuery);
  const java = data?.java;
  const online = Boolean(java?.online && java.players.max > 0);

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl bg-card/80 border border-border shadow-elegant backdrop-blur p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-3 h-3 rounded-full shrink-0 ${
              online ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" : "bg-rose-500"
            } ${isLoading ? "animate-pulse" : ""}`}
          />
          <span className="font-semibold truncate">{online ? "Server online" : isLoading ? "Status laden..." : "Server offline"}</span>
        </div>
        <button
          onClick={() => refetch()}
          className="shrink-0 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-secondary transition"
        >
          {isFetching ? "..." : "Ververs"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Spelers" value={online ? `${java?.players.online ?? 0}/${java?.players.max ?? 0}` : "—"} />
        <Stat label="Versie" value={online && java?.version ? java.version : "—"} />
        <Stat label="Ping" value={online && java?.ping != null ? `${java.ping} ms` : "—"} />
      </div>
      {online && java?.motd && (
        <p className="mt-3 text-center text-xs text-muted-foreground break-words">{java.motd}</p>
      )}
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        {java?.checkedAt
          ? `Laatst ververst om ${new Date(java.checkedAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · elke 30 sec.`
          : "Wordt elke 30 seconden ververst."}
      </p>
    </div>
  );
}
