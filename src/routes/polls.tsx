import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { pollsQuery, type PollRow, type PollOptionRow, type PollVoteRow } from "@/lib/queries";
import { submitVote } from "@/lib/site.functions";
import { getBrowserToken } from "@/lib/browser-token";

export const Route = createFileRoute("/polls")({
  head: () => ({
    meta: [
      { title: "Polls · MysticBlocksSMP" },
      { name: "description", content: "Stem mee over de toekomst van MysticBlocksSMP en bekijk direct de uitslag." },
      { property: "og:title", content: "Polls · MysticBlocksSMP" },
      { property: "og:description", content: "Stem mee over de toekomst van MysticBlocksSMP en bekijk direct de uitslag." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PollsPage,
});

const VOTED_KEY = "mbs-voted-polls";

function readVoted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(VOTED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function PollCard({
  poll,
  options,
  votes,
  voted,
  onVoted,
}: {
  poll: PollRow;
  options: PollOptionRow[];
  votes: PollVoteRow[];
  voted: boolean;
  onVoted: (pollId: string) => void;
}) {
  const vote = useServerFn(submitVote);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showResults = voted || !poll.is_open;
  const total = votes.length;

  const cast = async (optionId: string) => {
    setBusy(true);
    setError(null);
    try {
      await vote({ data: { poll_id: poll.id, option_id: optionId, browser_token: getBrowserToken() } });
      onVoted(poll.id);
      await qc.invalidateQueries({ queryKey: ["polls"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er ging iets mis");
      onVoted(poll.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold break-words">{poll.question}</h2>
        {!poll.is_open && <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">Gesloten</span>}
      </div>
      {poll.description && <p className="text-sm text-muted-foreground mb-4 break-words">{poll.description}</p>}
      <div className="space-y-2">
        {options.map((o) => {
          const count = votes.filter((v) => v.option_id === o.id).length;
          const pct = total ? Math.round((count / total) * 100) : 0;
          if (!showResults) {
            return (
              <button
                key={o.id}
                disabled={busy}
                onClick={() => cast(o.id)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary/60 hover:bg-primary/10 transition text-sm disabled:opacity-50"
              >
                {o.label}
              </button>
            );
          }
          return (
            <div key={o.id} className="rounded-xl border border-border overflow-hidden">
              <div className="relative px-4 py-3">
                <div className="absolute inset-y-0 left-0 bg-primary/20" style={{ width: `${pct}%` }} />
                <div className="relative flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 break-words">{o.label}</span>
                  <span className="shrink-0 font-mono text-primary">
                    {pct}% ({count})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <p className="mt-3 text-xs text-muted-foreground">
        {total} stem{total === 1 ? "" : "men"} · één stem per browser
      </p>
    </div>
  );
}

function PollsPage() {
  const { data, isLoading } = useQuery(pollsQuery);
  const [voted, setVoted] = useState<string[]>([]);

  useEffect(() => {
    setVoted(readVoted());
  }, []);

  const markVoted = (pollId: string) => {
    const next = Array.from(new Set([...readVoted(), pollId]));
    window.localStorage.setItem(VOTED_KEY, JSON.stringify(next));
    setVoted(next);
  };

  const polls = data?.polls ?? [];

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow mb-4 text-center">Peilingen</h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-12">
          Laat weten wat jij wilt zien op de server. Je stem telt!
        </p>
        {isLoading && <p className="text-center text-muted-foreground">Laden...</p>}
        {!isLoading && polls.length === 0 && (
          <p className="text-center text-muted-foreground">Er lopen op dit moment geen peilingen.</p>
        )}
        <div className="space-y-4">
          {polls.map((p) => (
            <PollCard
              key={p.id}
              poll={p}
              options={(data?.options ?? []).filter((o) => o.poll_id === p.id)}
              votes={(data?.votes ?? []).filter((v) => v.poll_id === p.id)}
              voted={voted.includes(p.id)}
              onVoted={markVoted}
            />
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
