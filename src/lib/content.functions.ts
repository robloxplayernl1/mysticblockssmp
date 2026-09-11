import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function requireAdmin() {
  await (await import("./admin-session.server")).requireAdminSession();
}

// ---------- Gallery ----------
const gallerySchema = z.object({
  title: z.string().trim().max(120).default(""),
  description: z.string().trim().max(500).default(""),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const createGalleryItem = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof gallerySchema>) => gallerySchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { data: row, error } = await db.from("gallery_items").insert(data).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true as const, id: (row as { id: string }).id };
  });

const galleryUpdateSchema = gallerySchema.extend({ id: z.string().uuid() });

export const updateGalleryItem = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof galleryUpdateSchema>) => galleryUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { id, ...rest } = data;
    const { error } = await db.from("gallery_items").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("gallery_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const imageSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  dataBase64: z.string().min(1).max(7_000_000),
});

async function uploadImage(data: z.infer<typeof imageSchema>) {
  if (!/^image\/(png|jpeg|jpg|webp|gif)$/.test(data.contentType)) {
    throw new Error("Alleen afbeeldingen zijn toegestaan");
  }
  const bin = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
  if (bin.byteLength > 5_000_000) throw new Error("Afbeelding is te groot (max 5MB)");
  const ext = (data.fileName.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const path = `${data.id}-${Date.now()}.${ext}`;
  const db = await admin();
  const { error } = await db.storage.from("gallery").upload(path, bin, {
    contentType: data.contentType,
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return `/api/public/gallery-image/${path}`;
}

export const uploadGalleryImage = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof imageSchema>) => imageSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const url = await uploadImage(data);
    const db = await admin();
    const { error } = await db.from("gallery_items").update({ image_url: url }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const, url };
  });

// ---------- Highlights ----------
const highlightSchema = z.object({
  title: z.string().trim().min(1).max(120),
  player_name: z.string().trim().max(80).default(""),
  description: z.string().trim().max(1000).default(""),
  period: z.string().trim().max(80).default(""),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const createHighlight = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof highlightSchema>) => highlightSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { data: row, error } = await db.from("highlights").insert(data).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true as const, id: (row as { id: string }).id };
  });

const highlightUpdateSchema = highlightSchema.extend({ id: z.string().uuid() });

export const updateHighlight = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof highlightUpdateSchema>) => highlightUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { id, ...rest } = data;
    const { error } = await db.from("highlights").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteHighlight = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("highlights").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const uploadHighlightImage = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof imageSchema>) => imageSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const url = await uploadImage(data);
    const db = await admin();
    const { error } = await db.from("highlights").update({ image_url: url }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const, url };
  });

// ---------- FAQ ----------
const faqSchema = z.object({
  question: z.string().trim().min(1).max(200),
  answer: z.string().trim().max(3000).default(""),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const createFaqItem = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof faqSchema>) => faqSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("faq_items").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const faqUpdateSchema = faqSchema.extend({ id: z.string().uuid() });

export const updateFaqItem = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof faqUpdateSchema>) => faqUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { id, ...rest } = data;
    const { error } = await db.from("faq_items").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteFaqItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("faq_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
