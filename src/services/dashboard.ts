import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface DashboardStats {
  activeStudents: number;
  birthdaysThisMonth: number;
  overduePayments: number;
}

export async function getDashboardStats(
  birthdayCount: number,
): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();
  const todayIso = new Date().toISOString().split("T")[0]!;

  const [activeRes, overdueRes] = await Promise.all([
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("active", true)
      .lt("next_payment_date", todayIso),
  ]);

  return {
    activeStudents: activeRes.count ?? 0,
    birthdaysThisMonth: birthdayCount,
    overduePayments: overdueRes.count ?? 0,
  };
}
