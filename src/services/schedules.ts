import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DayGroup } from "@/types/schedule";
import type { ScheduleRow } from "@/types/database";

function groupRows(rows: ScheduleRow[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const row of rows) {
    const slot = {
      time: `${row.time_start} - ${row.time_end}`,
      sensei: row.instructor ?? "",
    };
    const key = `${row.day_group_id}-${row.category}`;
    const existing = map.get(key);
    if (existing) {
      existing.slots.push(slot);
    } else {
      map.set(key, {
        id: key,
        label: row.day_label,
        category: row.category === "infantil" ? "Infantil" : "Adultos",
        slots: [slot],
        isPrimary: row.day_group_id.startsWith("seg"),
      });
    }
  }
  return Array.from(map.values());
}

export async function getScheduleGroups(): Promise<DayGroup[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .order("display_order");

  if (error || !data?.length) {
    const { SCHEDULE_GROUPS } =
      await import("@/components/horarios/horarios-data");
    return SCHEDULE_GROUPS;
  }
  return groupRows(data);
}
