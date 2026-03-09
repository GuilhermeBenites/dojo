import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const tables = [
      "senseis",
      "testimonials",
      "schedules",
      "gallery_images",
      "championships",
      "hall_of_fame",
      "dojo_stats",
      "plans",
      "belt_exams",
      "drop_in_classes",
      "faq_items",
    ] as const;

    const counts: Record<string, number> = {};

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        return NextResponse.json(
          { status: "error", table, message: error.message },
          { status: 500 },
        );
      }

      counts[table] = count ?? 0;
    }

    return NextResponse.json({ status: "ok", counts });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: String(err) },
      { status: 500 },
    );
  }
}
