import { createFileRoute } from "@tanstack/react-router";

type McsrvstatResponse = {
  online?: boolean;
  players?: { online?: number; max?: number };
  version?: string;
  motd?: { clean?: string[] };
};

async function fetchStatus(url: string) {
  const started = Date.now();
  try {
    const res = await fetch(url, { headers: { "user-agent": "mysticblockssmp-site" } });
    const ping = Date.now() - started;
    if (!res.ok) {
      return { online: false, players: { online: 0, max: 0 }, version: "", ping: null as number | null, motd: "" };
    }
    const json = (await res.json()) as McsrvstatResponse;
    return {
      online: Boolean(json.online),
      players: {
        online: json.players?.online ?? 0,
        max: json.players?.max ?? 0,
      },
      version: json.version ?? "",
      ping: json.online ? ping : null,
      motd: (json.motd?.clean ?? []).join(" ").trim(),
    };
  } catch {
    return { online: false, players: { online: 0, max: 0 }, version: "", ping: null as number | null, motd: "" };
  }
}

export const Route = createFileRoute("/api/status")({
  server: {
    handlers: {
      GET: async () => {
        const host = "mysticblockssmp.mcsh.io";
        let paused = false;
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data } = await supabaseAdmin
            .from("site_settings")
            .select("server_paused")
            .eq("id", "main")
            .maybeSingle();
          paused = Boolean((data as { server_paused?: boolean } | null)?.server_paused);
        } catch {
          paused = false;
        }
        const fetched = await fetchStatus(`https://api.mcsrvstat.us/3/${host}`);
        const java = paused
          ? { online: false, players: { online: 0, max: 0 }, version: "", ping: null as number | null, motd: "Server gepauzeerd" }
          : fetched;
        return new Response(JSON.stringify({ java: { ...java, checkedAt: new Date().toISOString() } }), {
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
