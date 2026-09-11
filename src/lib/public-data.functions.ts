import { createServerFn } from "@tanstack/react-start";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export type PublicRsvpRow = { id: string; event_id: string; minecraft_name: string; created_at: string };
export type PublicVoteRow = { id: string; poll_id: string; option_id: string };

/** Public RSVP list without browser_token. */
export const listPublicRsvps = createServerFn({ method: "GET" }).handler(async () => {
  const db = await admin();
  const { data, error } = await db
    .from("event_rsvps" as never)
    .select("id, event_id, minecraft_name, created_at")
    .order("created_at", { ascending: true })
    .limit(5000);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as PublicRsvpRow[];
});

/** Public vote rows without browser_token, used only for counting. */
export const listPublicVotes = createServerFn({ method: "GET" }).handler(async () => {
  const db = await admin();
  const { data, error } = await db
    .from("poll_votes" as never)
    .select("id, poll_id, option_id")
    .limit(20000);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as PublicVoteRow[];
});
