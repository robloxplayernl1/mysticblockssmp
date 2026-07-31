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