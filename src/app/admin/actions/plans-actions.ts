"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  planSchema,
  beltExamSchema,
  dropInSchema,
  faqSchema,
} from "@/lib/validations/plan-schema";

type ActionResult = { success: true } | { error: string };

export async function createPlanAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = planSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = {
    ...parsed.data,
    subtitle: parsed.data.subtitle ?? "",
    recommended: parsed.data.recommended ?? false,
  };

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("plans").insert(data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}

export async function updatePlanAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = planSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = {
    ...parsed.data,
    subtitle: parsed.data.subtitle ?? "",
    recommended: parsed.data.recommended ?? false,
  };

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("plans").update(data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}

export async function deletePlanAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("plans").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}

export async function updateBeltExamAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = beltExamSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = {
    ...parsed.data,
    highlighted: parsed.data.highlighted ?? false,
  };

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("belt_exams").update(data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}

export async function updateDropInAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = dropInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("drop_in_classes").update(parsed.data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}

export async function createFaqAction(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("faq_items").insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}

export async function updateFaqAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = faqSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("faq_items").update(parsed.data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}

export async function deleteFaqAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/plans");
  revalidatePath("/planos");
  return { success: true };
}
