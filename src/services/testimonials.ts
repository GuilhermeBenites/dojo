import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TestimonialRow } from "@/types/database";

export type TestimonialItem = Pick<
  TestimonialRow,
  "author" | "role" | "quote"
>;

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("author, role, quote")
    .order("display_order");

  if (error || !data?.length) {
    const { TESTIMONIALS } =
      await import("@/components/home/testimonials-section");
    return TESTIMONIALS;
  }
  return data;
}
