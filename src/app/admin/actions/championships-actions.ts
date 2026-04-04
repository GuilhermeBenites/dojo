"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  championshipSchema,
  championshipResultSchema,
} from "@/lib/validations/championship-schema";
import type { ChampionshipResultRow, ChampionshipRow, DojoStatsRow } from "@/types/database";

type ActionResult = { success: true } | { error: string };

type MedalField = "gold" | "silver" | "bronze";

function getMedalFieldFromPlacement(placement: number): MedalField {
  if (placement === 1) return "gold";
  if (placement === 2) return "silver";
  return "bronze";
}

async function adjustChampionshipMedalCount(
  championshipId: string,
  placement: number,
  delta: 1 | -1
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const medalField = getMedalFieldFromPlacement(placement);

  const { data: championship, error: championshipError } = await supabase
    .from("championships")
    .select("gold, silver, bronze")
    .eq("id", championshipId)
    .single();

  if (championshipError || !championship) {
    return { error: championshipError?.message ?? "Campeonato não encontrado" };
  }

  const current = championship[medalField] ?? 0;
  const nextValue = Math.max(0, current + delta);

  const { error: updateError } = await supabase
    .from("championships")
    // @ts-expect-error - Database type inference issue with Supabase client
    .update({ [medalField]: nextValue })
    .eq("id", championshipId);

  if (updateError) return { error: updateError.message };
  return { success: true };
}

async function syncDojoStatsFromChampionships(): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  const { data: championships, error: championshipsError } = (await supabase
    .from("championships")
    .select("gold, silver, bronze")) as {
    data: Pick<ChampionshipRow, "gold" | "silver" | "bronze">[] | null;
    error: { message: string } | null;
  };

  if (championshipsError) return { error: championshipsError.message };

  const totals = (championships ?? []).reduce(
    (acc, championship) => ({
      gold: acc.gold + (championship.gold ?? 0),
      silver: acc.silver + (championship.silver ?? 0),
      bronze: acc.bronze + (championship.bronze ?? 0),
    }),
    { gold: 0, silver: 0, bronze: 0 }
  );

  const { data: statsRow, error: statsRowError } = (await supabase
    .from("dojo_stats")
    .select("id")
    .limit(1)
    .maybeSingle()) as {
    data: Pick<DojoStatsRow, "id"> | null;
    error: { message: string } | null;
  };

  if (statsRowError) return { error: statsRowError.message };

  const payload = {
    total_gold: totals.gold,
    total_silver: totals.silver,
    total_bronze: totals.bronze,
    // "Troféus Gerais" acompanha o total de ouros no agregado atual.
    total_trophies: totals.gold,
  };

  if (statsRow?.id) {
    const { error: updateError } = await supabase
      .from("dojo_stats")
      // @ts-expect-error - Database type inference issue with Supabase client
      .update(payload)
      .eq("id", statsRow.id);
    if (updateError) return { error: updateError.message };
  } else {
    const { error: insertError } = await supabase
      .from("dojo_stats")
      // @ts-expect-error - Database type inference issue with Supabase client
      .insert(payload);
    if (insertError) return { error: insertError.message };
  }

  return { success: true };
}

export async function createChampionshipAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = championshipSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("championships").insert(parsed.data);

  if (error) return { error: error.message };
  const statsSync = await syncDojoStatsFromChampionships();
  if ("error" in statsSync) return statsSync;

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function updateChampionshipAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = championshipSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("championships").update(parsed.data).eq("id", id);

  if (error) return { error: error.message };
  const statsSync = await syncDojoStatsFromChampionships();
  if ("error" in statsSync) return statsSync;

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function deleteChampionshipAction(
  id: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("championships").delete().eq("id", id);

  if (error) return { error: error.message };
  const statsSync = await syncDojoStatsFromChampionships();
  if ("error" in statsSync) return statsSync;

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function createResultAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = championshipResultSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createSupabaseServerClient();

  const { data: student } = (await supabase
    .from("students")
    .select("name")
    .eq("id", parsed.data.student_id)
    .single()) as { data: { name: string } | null };

  if (!student) return { error: "Aluno não encontrado" };

  // @ts-expect-error - Database type inference issue with Supabase client
  const { error } = await supabase.from("championship_results").insert({
    ...parsed.data,
    athlete_name: student.name,
  });

  if (error) return { error: error.message };

  const medalUpdate = await adjustChampionshipMedalCount(
    parsed.data.championship_id,
    parsed.data.placement,
    1
  );
  if ("error" in medalUpdate) {
    // Keep aggregate counters consistent with event rows on failure
    await supabase.from("championship_results").delete().match({
      championship_id: parsed.data.championship_id,
      student_id: parsed.data.student_id,
      placement: parsed.data.placement,
      category: parsed.data.category,
    });
    return medalUpdate;
  }
  const statsSync = await syncDojoStatsFromChampionships();
  if ("error" in statsSync) return statsSync;

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function deleteResultAction(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: resultRow, error: resultError } = (await supabase
    .from("championship_results")
    .select("*")
    .eq("id", id)
    .single()) as { data: ChampionshipResultRow | null; error: { message: string } | null };

  if (resultError || !resultRow) {
    return { error: resultError?.message ?? "Resultado não encontrado" };
  }

  const { error } = await supabase
    .from("championship_results")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  const medalUpdate = await adjustChampionshipMedalCount(
    resultRow.championship_id,
    resultRow.placement,
    -1
  );
  if ("error" in medalUpdate) {
    // Try to roll back delete to avoid desync with medal counters
    // @ts-expect-error - Database type inference issue with Supabase client
    await supabase.from("championship_results").insert(resultRow);
    return medalUpdate;
  }
  const statsSync = await syncDojoStatsFromChampionships();
  if ("error" in statsSync) return statsSync;

  revalidatePath("/admin/content/championships");
  revalidatePath("/campeonatos");
  return { success: true };
}

export async function upsertHallOfFameAction(
  athleteName: string,
  photoUrl: string,
  achievement: string,
  studentId?: string
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();

  // Look up existing entry by student_id first, then fall back to name match
  const query = studentId
    ? supabase.from("hall_of_fame").select("id").eq("student_id", studentId)
    : supabase.from("hall_of_fame").select("id").ilike("name", athleteName);

  const { data: existing } = (await query.maybeSingle()) as {
    data: { id: string } | null;
  };

  const payload = {
    achievement,
    photo_url: photoUrl || null,
    ...(studentId ? { student_id: studentId, name: athleteName } : {}),
  };

  if (existing) {
    const { error } = await supabase
      .from("hall_of_fame")
      // @ts-expect-error - Database type inference issue with Supabase client
      .update(payload)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { data: maxRow } = (await supabase
      .from("hall_of_fame")
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle()) as { data: { display_order: number } | null };

    // @ts-expect-error - Database type inference issue with Supabase client
    const { error } = await supabase.from("hall_of_fame").insert({
      name: athleteName,
      achievement,
      photo_url: photoUrl || null,
      display_order: (maxRow?.display_order ?? 0) + 1,
      ...(studentId ? { student_id: studentId } : {}),
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/content/championships/hall-of-fame");
  revalidatePath("/campeonatos");
  return { success: true };
}
