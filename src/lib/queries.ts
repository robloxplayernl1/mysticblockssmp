import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listPublicRsvps, listPublicVotes } from "./public-data.functions";

export type SiteSettings = {
  hero_title: string;
  hero_subtitle: string;
  server_ip: string;
  discord_link: string;
  announcement: string;
  rules_text: string;
  opening_hours: string;
  maintenance_enabled: boolean;
  maintenance_text: string;
  maintenance_pages: string[];
  opening_hours_enabled: boolean;
  server_paused: boolean;
};

export type ChangelogRow = {
  id: string;
  title: string;
  body: string;
  entry_date: string;
};

export type EventRow = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  created_at: string;
  rsvp_enabled: boolean;
  end_date: string | null;
  location: string;
  max_participants: number;
};

export type StaffRow = {
  id: string;
  name: string;
  role: string;
  description: string;
  sort_order: number;
  avatar_url: string;
};

export type RankRow = {
  id: string;
  name: string;
  requirement: string;
  description: string;
  color: string;
  sort_order: number;
};

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("hero_title, hero_subtitle, server_ip, discord_link, announcement, rules_text, opening_hours, maintenance_enabled, maintenance_text, maintenance_pages, opening_hours_enabled, server_paused")
      .eq("id", "main")
      .maybeSingle();
    if (error) throw error;
    return (
      (data as unknown as SiteSettings) ?? {
        hero_title: "MysticBlocksSMP",
        hero_subtitle: "",
        server_ip: "mysticblockssmp.mcsh.io",
        discord_link: "https://discord.gg/Y4BchzeFJH",
        announcement: "",
        rules_text: "",
        opening_hours: "",
        maintenance_enabled: false,
        maintenance_text: "",
        maintenance_pages: [],
        opening_hours_enabled: true,
        server_paused: false,
      }
    );
  },
});

export const changelogQuery = queryOptions({
  queryKey: ["changelog"],
  queryFn: async (): Promise<ChangelogRow[]> => {
    const { data, error } = await supabase
      .from("changelog" as never)
      .select("id, title, body, entry_date")
      .order("entry_date", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as ChangelogRow[];
  },
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: async (): Promise<EventRow[]> => {
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, event_date, created_at, rsvp_enabled, end_date, location, max_participants")
      .order("event_date", { ascending: true });
    if (error) throw error;
    return (data ?? []) as EventRow[];
  },
});

export const staffQuery = queryOptions({
  queryKey: ["staff"],
  queryFn: async (): Promise<StaffRow[]> => {
    const { data, error } = await supabase
      .from("staff")
      .select("id, name, role, description, sort_order, avatar_url")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as StaffRow[];
  },
});

export const ranksQuery = queryOptions({
  queryKey: ["ranks"],
  queryFn: async (): Promise<RankRow[]> => {
    const { data, error } = await supabase
      .from("ranks" as never)
      .select("id, name, requirement, description, color, sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as RankRow[];
  },
});

export type RsvpRow = { id: string; event_id: string; minecraft_name: string; created_at: string };

export const rsvpsQuery = queryOptions({
  queryKey: ["event_rsvps"],
  queryFn: async (): Promise<RsvpRow[]> => {
    return (await listPublicRsvps()) as RsvpRow[];
  },
});

export type PollOptionRow = { id: string; poll_id: string; label: string; sort_order: number };
export type PollRow = { id: string; question: string; description: string; is_open: boolean; created_at: string };
export type PollVoteRow = { id: string; poll_id: string; option_id: string };

export const pollsQuery = queryOptions({
  queryKey: ["polls"],
  queryFn: async (): Promise<{ polls: PollRow[]; options: PollOptionRow[]; votes: PollVoteRow[] }> => {
    const [p, o, v] = await Promise.all([
      supabase.from("polls" as never).select("id, question, description, is_open, created_at").order("created_at", { ascending: false }),
      supabase.from("poll_options" as never).select("id, poll_id, label, sort_order").order("sort_order", { ascending: true }),
      supabase.from("poll_votes" as never).select("id, poll_id, option_id"),
    ]);
    if (p.error) throw p.error;
    if (o.error) throw o.error;
    if (v.error) throw v.error;
    return {
      polls: (p.data ?? []) as unknown as PollRow[],
      options: (o.data ?? []) as unknown as PollOptionRow[],
      votes: (v.data ?? []) as unknown as PollVoteRow[],
    };
  },
});

export type ServerStatus = {
  java: {
    online: boolean;
    players: { online: number; max: number };
    version: string;
    ping: number | null;
    motd: string;
    checkedAt: string;
  };
};

export const statusQuery = queryOptions({
  queryKey: ["server_status"],
  queryFn: async (): Promise<ServerStatus> => {
    const res = await fetch(`/api/status?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("status fetch failed");
    return (await res.json()) as ServerStatus;
  },
  refetchInterval: 30_000,
  staleTime: 0,
  gcTime: 60_000,
});