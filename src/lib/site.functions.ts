import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";


async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// ---------- Site settings ----------
const settingsSchema = z.object({
  hero_title: z.string().trim().min(1).max(120),
  hero_subtitle: z.string().trim().max(300),
  server_ip: z.string().trim().min(1).max(200),
  discord_link: z.string().trim().url().max(300),
  announcement: z.string().trim().max(300),
  rules_text: z.string().trim().max(5000),
  opening_hours: z.string().trim().max(2000).default(""),
  maintenance_enabled: z.boolean().default(false),
  maintenance_text: z.string().trim().max(1000),
  maintenance_pages: z.array(z.string().trim().max(60)).max(20).default([]),
  opening_hours_enabled: z.boolean().default(true),
});

export const updateSettings = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof settingsSchema>) => settingsSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db
      .from("site_settings")
      .update({ ...data, updated_at: new Date().toISOString() } as never)
      .eq("id", "main");
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Events ----------
const eventSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000),
  event_date: z.string().min(1),
});

export const createEvent = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof eventSchema>) => eventSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("events").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("events").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Staff ----------
const staffSchema = z.object({
  name: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const createStaff = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof staffSchema>) => staffSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("staff").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteStaff = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("staff").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const staffUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500),
});

export const updateStaff = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof staffUpdateSchema>) => staffUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { id, ...rest } = data;
    const { error } = await db.from("staff").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

// ---------- Ranks ----------
const avatarSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  dataBase64: z.string().min(1).max(4_000_000),
});

export const uploadStaffAvatar = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof avatarSchema>) => avatarSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    if (!/^image\/(png|jpeg|jpg|webp|gif)$/.test(data.contentType)) {
      throw new Error("Alleen afbeeldingen zijn toegestaan");
    }
    const bin = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    if (bin.byteLength > 3_000_000) throw new Error("Afbeelding is te groot (max 3MB)");
    const ext = (data.fileName.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
    const path = `${data.id}-${Date.now()}.${ext}`;
    const db = await admin();
    const { error: upErr } = await db.storage
      .from("staff-avatars")
      .upload(path, bin, { contentType: data.contentType, upsert: true });
    if (upErr) throw new Error(upErr.message);
    const url = `/api/public/staff-avatar/${path}`;
    const { error } = await db.from("staff").update({ avatar_url: url } as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const, url };
  });

export const removeStaffAvatar = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("staff").update({ avatar_url: "" } as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const rankSchema = z.object({
  name: z.string().trim().min(1).max(80),
  requirement: z.string().trim().max(200),
  description: z.string().trim().max(500),
  color: z.string().trim().min(1).max(30),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const createRank = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof rankSchema>) => rankSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("ranks" as never).insert(data as never);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const rankUpdateSchema = rankSchema.extend({ id: z.string().uuid() });

export const updateRank = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof rankUpdateSchema>) => rankUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { id, ...rest } = data;
    const { error } = await db.from("ranks" as never).update(rest as never).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteRank = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("ranks" as never).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const swapRanksSchema = z.object({
  idA: z.string().uuid(),
  idB: z.string().uuid(),
});

export const swapRankOrder = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof swapRanksSchema>) => swapRanksSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { data: rows, error: fetchError } = await db
      .from("ranks" as never)
      .select("id, sort_order")
      .in("id", [data.idA, data.idB]);
    if (fetchError) throw new Error(fetchError.message);
    const list = (rows ?? []) as { id: string; sort_order: number }[];
    if (list.length !== 2) throw new Error("Ranks niet gevonden");
    const [a, b] = list;
    const { error: errA } = await db.from("ranks" as never).update({ sort_order: b.sort_order } as never).eq("id", a.id);
    if (errA) throw new Error(errA.message);
    const { error: errB } = await db.from("ranks" as never).update({ sort_order: a.sort_order } as never).eq("id", b.id);
    if (errB) throw new Error(errB.message);
    return { ok: true as const };
  });

// ---------- Changelog ----------
const changelogSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().max(3000),
  entry_date: z.string().min(1),
});

export const createChangelog = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof changelogSchema>) => changelogSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("changelog" as never).insert(data as never);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const changelogUpdateSchema = changelogSchema.extend({ id: z.string().uuid() });

export const updateChangelog = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof changelogUpdateSchema>) => changelogUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { id, ...rest } = data;
    const { error } = await db.from("changelog" as never).update(rest as never).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteChangelog = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await (await import("./admin-session.server")).requireAdminSession();
    const db = await admin();
    const { error } = await db.from("changelog" as never).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
