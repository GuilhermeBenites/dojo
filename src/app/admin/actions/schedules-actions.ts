"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { scheduleSchema } from "@/lib/validations/schedule-schema";

type ActionResult = { success: true } | { error: string };

export async function createScheduleAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = scheduleSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("schedules").insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/schedules");
  revalidatePath("/horarios");
  return { success: true };
}

export async function updateScheduleAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = scheduleSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("schedules").update(parsed.data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/schedules");
  revalidatePath("/horarios");
  return { success: true };
}

export async function deleteScheduleAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("schedules").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/schedules");
  revalidatePath("/horarios");
  return { success: true };
}
