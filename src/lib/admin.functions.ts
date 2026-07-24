import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short");
  }
  return {
    password,
    name: "mbs-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

export async function requireAdminSession() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) {
    throw new Error("Niet ingelogd als admin");
  }
  return session;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) =>
    z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass) throw new Error("Admin credentials niet geconfigureerd");
    const ok = safeEqual(data.username, expectedUser) && safeEqual(data.password, expectedPass);
    if (!ok) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { admin: !!session.data.admin };
});