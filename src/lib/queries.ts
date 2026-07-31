import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  hero_title: string;
  hero_subtitle: string;
  server_ip: string;
  discord_link: string;
  announcement: string;
  rules_text: string;
  maintenance_enabled: boolean;
  maintenance_text: string;
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
};

export type StaffRow = {
  id: string;
  name: string;
  role: string;
  description: string;
  sort_order: number;
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
      .select("hero_title, hero_subtitle, server_ip, discord_link, announcement, rules_text, maintenance_enabled, maintenance_text")
      .eq("id", "main")
      .maybeSingle();
    if (error) throw error;
    return (
      (data as SiteSettings) ?? {
        hero_title: "MysticBlocksSMP",
        hero_subtitle: "",
        server_ip: "mysticblockssmp.mcsh.io",
        discord_link: "https://discord.gg/Y4BchzeFJH",
        announcement: "",
        rules_text: "",
        maintenance_enabled: false,
        maintenance_text: "",
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
      .select("id, title, description, event_date, created_at")
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
      .select("id, name, role, description, sort_order")
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

export type ServerStatus = {
  java: { online: boolean; players: { online: number; max: number } };
};

export const statusQuery = queryOptions({
  queryKey: ["server_status"],
  queryFn: async (): Promise<ServerStatus> => {
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("status fetch failed");
    return (await res.json()) as ServerStatus;
  },
  refetchInterval: 60_000,
  staleTime: 30_000,
});