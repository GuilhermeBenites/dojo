import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StudentFinanceRow, StudentRow } from "@/types/database";

export interface StudentsFilter {
  search?: string;
  belt?: string;
  active?: "active" | "inactive" | "all";
}

export async function getStudents(
  filter: StudentsFilter = {},
): Promise<StudentRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("students").select("*");

  if (filter.search) {
    query = query.ilike("name", `%${filter.search}%`);
  }

  if (filter.belt && filter.belt !== "all") {
    query = query.eq("belt", filter.belt);
  }

  if (filter.active && filter.active !== "all") {
    query = query.eq("active", filter.active === "active");
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }

  return (data ?? []) as StudentRow[];
}

export async function getStudentById(id: string): Promise<StudentRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching student by id:", error);
    return null;
  }

  return data as StudentRow;
}

export async function getBirthdaysThisMonth(): Promise<StudentRow[]> {
  const supabase = await createSupabaseServerClient();
  
  // Fetch all active students with a birth_date
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("active", true)
    .not("birth_date", "is", null);

  if (error || !data) {
    console.error("Error fetching birthdays:", error);
    return [];
  }

  const rows = data as StudentRow[];
  const currentMonth = new Date().getMonth();

  // Filter in JS by month
  const birthdays = rows.filter((student) => {
    if (!student.birth_date) return false;
    const studentMonth = new Date(student.birth_date).getMonth();
    return studentMonth === currentMonth;
  });

  // Sort by day of month
  return birthdays.sort((a, b) => {
    const dayA = new Date(a.birth_date!).getDate();
    const dayB = new Date(b.birth_date!).getDate();
    return dayA - dayB;
  });
}

export async function getStudentsForFinance(): Promise<StudentFinanceRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, name, belt, plan_id, next_payment_date, phone")
    .eq("active", true)
    .order("next_payment_date", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error fetching students for finance:", error);
    return [];
  }

  return (data ?? []) as StudentFinanceRow[];
}
