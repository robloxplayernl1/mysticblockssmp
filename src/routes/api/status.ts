import { createFileRoute } from "@tanstack/react-router";

type McsrvstatResponse = {
  online?: boolean;
  players?: { online?: number; max?: number };
};

async function fetchStatus(url: string) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "mysticblockssmp-site" } });
    if (!res.ok) return { online: false, players: { online: 0, max: 0 } };
    const json = (await res.json()) as McsrvstatResponse;
    return {
      online: Boolean(json.online),
      players: {
        online: json.players?.online ?? 0,
        max: json.players?.max ?? 0,
      },
    };
  } catch {
    return { online: false, players: { online: 0, max: 0 } };
  }
}

export const Route = createFileRoute("/api/status")({
  server: {
    handlers: {
      GET: async () => {
        const host = "mysticblockssmp.mcsh.io";
        const java = await fetchStatus(`https://api.mcsrvstat.us/3/${host}`);
        return new Response(JSON.stringify({ java }), {
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=30, s-maxage=30",
          },
        });
      },
    },
  },
});