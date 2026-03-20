import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadRow } from "@/types/database";

export interface DashboardStats {
  activeStudents: number;
  newLeadsThisMonth: number;
  birthdaysThisMonth: number;
  overduePayments: number;
}

export async function getDashboardStats(
  birthdayCount: number,
): Promise<DashboardStats> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayIso = firstDay.toISOString();
  const todayIso = new Date().toISOString().split("T")[0]!;

  const [activeRes, leadsRes, overdueRes] = await Promise.all([
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", firstDayIso),
    supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("active", true)
      .lt("next_payment_date", todayIso),
  ]);

  return {
    activeStudents: activeRes.count ?? 0,
    newLeadsThisMonth: leadsRes.count ?? 0,
    birthdaysThisMonth: birthdayCount,
    overduePayments: overdueRes.count ?? 0,
  };
}

export async function getRecentLeads(limit = 5): Promise<LeadRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent leads:", error);
    return [];
  }

  return (data ?? []) as LeadRow[];
}
