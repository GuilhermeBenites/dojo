"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { senseiSchema } from "@/lib/validations/sensei-schema";

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

export async function createSenseiAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = senseiSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = {
    ...parsed.data,
    photo_url: parsed.data.photo_url || null,
    is_founder: parsed.data.is_founder ?? false,
  };

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("senseis").insert(data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/senseis");
  revalidatePath("/senseis");
  return { success: true };
}

export async function updateSenseiAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = senseiSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = {
    ...parsed.data,
    photo_url: parsed.data.photo_url || null,
    is_founder: parsed.data.is_founder ?? false,
  };

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("senseis").update(data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/senseis");
  revalidatePath("/senseis");
  return { success: true };
}

export async function deleteSenseiAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const res = await supabase
    .from("senseis")
    .select("photo_url")
    .eq("id", id)
    .single();
  const sensei = res.data as { photo_url?: string } | null;

  if (sensei?.photo_url) {
    const path = extractPathFromStorageUrl(sensei.photo_url);
    if (path) {
      await supabase.storage.from("senseis").remove([path]);
    }
  }

  const { error } = await supabase.from("senseis").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/senseis");
  revalidatePath("/senseis");
  return { success: true };
}
