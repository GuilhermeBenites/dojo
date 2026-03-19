"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  championshipSchema,
  championshipResultSchema,
} from "@/lib/validations/championship-schema";

type ActionResult = { success: true } | { error: string };

export async function createChampionshipAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = championshipSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("championships").insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function updateChampionshipAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = championshipSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("championships").update(parsed.data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function deleteChampionshipAction(
  id: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("championships").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function createResultAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = championshipResultSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("championship_results").insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function deleteResultAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("championship_results")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}
