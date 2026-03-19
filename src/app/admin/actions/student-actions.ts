"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { studentSchema } from "@/lib/validations/student-schema";
import type { StudentInsert } from "@/types/database";

type ActionResult = { success: true } | { error: string };

export async function createStudentAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = studentSchema.safeParse(rawData);

    if (!validated.success) {
      return { error: "Dados inválidos. Verifique os campos." };
    }

    const data = validated.data;
    const supabase = await createSupabaseServerClient();

    const insertData = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      belt: data.belt,
      plan_id: data.plan_id || null,
      enrollment_date: data.enrollment_date,
      birth_date: data.birth_date || null,
      active: data.active,
      notes: data.notes || null,
    };

    const { error } = await supabase
      .from("students")
      // PostgREST types resolve `students` to `never` in this client version; payload is validated above.
      .insert(insertData as never);

    if (error) {
      console.error("Error creating student:", error);
      return { error: "Erro ao criar aluno." };
    }

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Exception creating student:", error);
    return { error: "Erro interno ao criar aluno." };
  }
}

export async function updateStudentAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = studentSchema.safeParse(rawData);

    if (!validated.success) {
      return { error: "Dados inválidos. Verifique os campos." };
    }

    const data = validated.data;
    const supabase = await createSupabaseServerClient();

    const updateData = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      belt: data.belt,
      plan_id: data.plan_id || null,
      enrollment_date: data.enrollment_date,
      birth_date: data.birth_date || null,
      active: data.active,
      notes: data.notes || null,
    };

    const { error } = await supabase
      .from("students")
      .update(updateData as never)
      .eq("id", id);

    if (error) {
      console.error("Error updating student:", error);
      return { error: "Erro ao atualizar aluno." };
    }

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Exception updating student:", error);
    return { error: "Erro interno ao atualizar aluno." };
  }
}

export async function deleteStudentAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      console.error("Error deleting student:", error);
      return { error: "Erro ao excluir aluno." };
    }

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Exception deleting student:", error);
    return { error: "Erro interno ao excluir aluno." };
  }
}

export async function toggleStudentActiveAction(
  id: string,
  active: boolean,
): Promise<ActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("students")
      .update({ active } as never)
      .eq("id", id);

    if (error) {
      console.error("Error toggling student status:", error);
      return { error: "Erro ao alterar status do aluno." };
    }

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Exception toggling student status:", error);
    return { error: "Erro interno ao alterar status do aluno." };
  }
}
