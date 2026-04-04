import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import {
  HallOfFameAdmin,
  type HofEntry,
} from "@/components/admin/cms/championships/hall-of-fame-admin";
import type { ChampionshipResultRow, HallOfFameRow } from "@/types/database";

export const metadata: Metadata = {
  title: "Hall da Fama | Admin Dojo",
};

export default async function HallOfFamePage() {
  const supabase = await createSupabaseServerClient();

  const [resultsRes, hofRes] = await Promise.all([
    supabase.from("championship_results").select("athlete_name, placement, student_id"),
    supabase.from("hall_of_fame").select("*"),
  ]);

  const results = (resultsRes.data ?? []) as Pick<
    ChampionshipResultRow,
    "athlete_name" | "placement" | "student_id"
  >[];
  const hofRows = (hofRes.data ?? []) as HallOfFameRow[];

  // Aggregate medals per athlete — key by student_id when available
  const medalMap = new Map<
    string,
    { originalName: string; studentId: string | null; gold: number; silver: number; bronze: number }
  >();
  for (const r of results) {
    const key = r.student_id ?? r.athlete_name.toLowerCase().trim();
    if (!medalMap.has(key)) {
      medalMap.set(key, {
        originalName: r.athlete_name,
        studentId: r.student_id ?? null,
        gold: 0,
        silver: 0,
        bronze: 0,
      });
    }
    const entry = medalMap.get(key)!;
    if (r.placement === 1) entry.gold++;
    else if (r.placement === 2) entry.silver++;
    else entry.bronze++;
  }

  const top4 = Array.from(medalMap.values())
    .filter((m) => m.gold > 0)
    .sort(
      (a, b) =>
        b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze
    )
    .slice(0, 4);

  const hofByStudentId = new Map(
    hofRows.filter((r) => r.student_id).map((r) => [r.student_id!, r])
  );
  const hofByName = new Map(
    hofRows.map((r) => [r.name.toLowerCase().trim(), r])
  );

  const entries: HofEntry[] = top4.map((medals) => {
    const hof =
      (medals.studentId ? hofByStudentId.get(medals.studentId) : undefined) ??
      hofByName.get(medals.originalName.toLowerCase().trim());
    return {
      athleteName: hof?.name ?? medals.originalName,
      studentId: medals.studentId,
      medals,
      photoUrl: hof?.photo_url ?? null,
      achievement: hof?.achievement ?? null,
    };
  });

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content/championships" label="Campeonatos" />
      <CmsPageHeader
        title="Hall da Fama"
        description="Top 4 atletas calculados automaticamente pelas medalhas de ouro. Clique em editar para definir foto e texto de conquista."
      />
      <HallOfFameAdmin entries={entries} />
    </div>
  );
}
