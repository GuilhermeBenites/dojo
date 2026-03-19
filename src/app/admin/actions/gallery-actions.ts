"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { gallerySchema } from "@/lib/validations/gallery-schema";

type ActionResult = { success: true } | { error: string };

function extractPathFromStorageUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function aspectRatioToDb(value: string): string {
  const map: Record<string, string> = {
    square: "1/1",
    portrait: "3/4",
    landscape: "16/9",
  };
  return map[value] ?? value;
}

function categoryToDb(value: string): string {
  const map: Record<string, string> = {
    "sensei-luciano": "Sensei Luciano",
    "belt-ceremonies": "Cerimônias de Faixa",
    kids: "Aulas Infantis",
    dojo: "Dojo",
  };
  return map[value] ?? value;
}

export async function createGalleryImageAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = gallerySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = {
    title: parsed.data.title,
    category: categoryToDb(parsed.data.category),
    image_url: parsed.data.image_url,
    aspect_ratio: aspectRatioToDb(parsed.data.aspect_ratio),
    display_order: parsed.data.display_order,
  };

  const supabase = createSupabaseAdminClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("gallery_images").insert(data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/gallery");
  revalidatePath("/galeria");
  return { success: true };
}

export async function updateGalleryImageAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = gallerySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = {
    title: parsed.data.title,
    category: categoryToDb(parsed.data.category),
    image_url: parsed.data.image_url,
    aspect_ratio: aspectRatioToDb(parsed.data.aspect_ratio),
    display_order: parsed.data.display_order,
  };

  const supabase = createSupabaseAdminClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("gallery_images").update(data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/gallery");
  revalidatePath("/galeria");
  return { success: true };
}

export async function deleteGalleryImageAction(
  id: string
): Promise<ActionResult> {
  const supabase = createSupabaseAdminClient();
  const { data: img } = await supabase
    .from("gallery_images")
    .select("image_url")
    .eq("id", id)
    .single() as { data: { image_url?: string } | null };

  if (img?.image_url) {
    const path = extractPathFromStorageUrl(img.image_url);
    if (path) {
      await supabase.storage.from("gallery").remove([path]);
    }
  }

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/gallery");
  revalidatePath("/galeria");
  return { success: true };
}

export async function reorderGalleryAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  const supabase = createSupabaseAdminClient();
  const res = await supabase
    .from("gallery_images")
    .select("id, display_order")
    .order("display_order");
  const items = res.data as Array<{ id: string; display_order: number }> | null;

  if (!items || items.length < 2) return { error: "Não há itens para reordenar" };

  const idx = items.findIndex((i) => i.id === id);
  if (idx < 0) return { error: "Item não encontrado" };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= items.length) return { success: true };

  const [a, b] = [items[idx], items[swapIdx]];
  // @ts-expect-error - Database type inference issue with Supabase client
  await supabase.from("gallery_images").update({ display_order: b.display_order }).eq("id", a.id);
  // @ts-expect-error - Database type inference issue with Supabase client
  await supabase.from("gallery_images").update({ display_order: a.display_order }).eq("id", b.id);

  revalidatePath("/admin/content/gallery");
  revalidatePath("/galeria");
  return { success: true };
}
