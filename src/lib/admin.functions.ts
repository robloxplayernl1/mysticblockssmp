import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) =>
    z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { getAdminSession, safeEqual, hashPassword } = await import("./admin-session.server");

    // 1) Beheerdersaccounts uit de database
    const client = await db();
    const { data: rows } = await client
      .from("admin_users" as never)
      .select("username, password_hash, salt")
      .eq("username", data.username)
      .maybeSingle();
    const user = rows as unknown as { username: string; password_hash: string; salt: string } | null;
    if (user) {
      const hash = await hashPassword(data.password, user.salt);
      if (safeEqual(hash, user.password_hash)) {
        const session = await getAdminSession();
        await session.update({ admin: true, username: user.username });
        return { ok: true as const };
      }
      return { ok: false as const };
    }

    // 2) Hoofdaccount uit de instellingen
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass) return { ok: false as const };
    const ok = safeEqual(data.username, expectedUser) && safeEqual(data.password, expectedPass);
    if (!ok) return { ok: false as const };
    const session = await getAdminSession();
    await session.update({ admin: true, username: expectedUser });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const session = await getAdminSession();
  return { admin: !!session.data.admin, username: session.data.username ?? "" };
});

export type AdminUserRow = { id: string; username: string; created_at: string };

export const listAdmins = createServerFn({ method: "POST" }).handler(async () => {
  await (await import("./admin-session.server")).requireAdminSession();
  const client = await db();
  const { data, error } = await client
    .from("admin_users" as never)
    .select("id, username, created_at")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as AdminUserRow[];
});

const newAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[A-Za-z0-9_.-]+$/, "Alleen letters, cijfers, _ . en -"),
  password: z.string().min(8).max(200),
});

export const createAdminUser = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof newAdminSchema>) => newAdminSchema.parse(data))
  .handler(async ({ data }) => {
    const { requireAdminSession, makeSalt, hashPassword } = await import("./admin-session.server");
    await requireAdminSession();
    const salt = makeSalt();
    const password_hash = await hashPassword(data.password, salt);
    const client = await db();
    const { error } = await client
      .from("admin_users" as never)
      .insert({ username: data.username, salt, password_hash } as never);
    if (error) {
      if (error.code === "23505") throw new Error("Deze gebruikersnaam bestaat al");
      throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const changeAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; password: string }) =>
    z.object({ id: z.string().uuid(), password: z.string().min(8).max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { requireAdminSession, makeSalt, hashPassword } = await import("./admin-session.server");
    await requireAdminSession();
    const salt = makeSalt();
    const password_hash = await hashPassword(data.password, salt);
    const client = await db();
    const { error } = await client
      .from("admin_users" as never)
      .update({ salt, password_hash } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const session = await (await import("./admin-session.server")).requireAdminSession();
    const client = await db();
    const { data: row } = await client
      .from("admin_users" as never)
      .select("username")
      .eq("id", data.id)
      .maybeSingle();
    const target = row as unknown as { username: string } | null;
    if (target && target.username === session.data.username) {
      throw new Error("Je kunt je eigen account niet verwijderen");
    }
    const { error } = await client.from("admin_users" as never).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
