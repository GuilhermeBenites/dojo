"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PaymentRow, PaymentType } from "@/types/database";

type ActionResult = { success: true } | { error: string };

export async function addPaymentAction(
  studentId: string,
  data: {
    amount: number;
    payment_type: PaymentType;
    payment_date: string; // YYYY-MM-DD
    months?: number; // only for mensalidade
    notes?: string;
  },
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const { error: insertError } = await supabase.from("payments").insert({
    student_id: studentId,
    amount: data.amount,
    payment_type: data.payment_type,
    payment_date: data.payment_date,
    notes: data.notes || null,
  } as never);

  if (insertError) return { error: insertError.message };

  // Only update next_payment_date for subscriptions
  if (data.payment_type === "mensalidade" && data.months) {
    const base = new Date(data.payment_date + "T12:00:00");
    base.setDate(base.getDate() + data.months * 30);
    const nextDate = base.toISOString().split("T")[0]!;

    const { error: updateError } = await supabase
      .from("students")
      .update({ next_payment_date: nextDate } as never)
      .eq("id", studentId);

    if (updateError) return { error: updateError.message };
  }

  revalidatePath("/admin/finance");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function getStudentPaymentsAction(
  studentId: string,
): Promise<PaymentRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .order("payment_date", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  return (data ?? []) as PaymentRow[];
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}
