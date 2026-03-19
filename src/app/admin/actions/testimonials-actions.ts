"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { testimonialSchema } from "@/lib/validations/testimonial-schema";

type ActionResult = { success: true } | { error: string };

export async function createTestimonialAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("testimonials").insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function updateTestimonialAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("testimonials").update(parsed.data).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonialAction(
  id: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
  return { success: true };
}
