import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AgeCategory,
  AthleteRanking,
  BeltColor,
  ChampionshipEvent,
  HallOfFameAthlete,
  MedalCounterCard,
} from "@/types/championships";
import type {
  ChampionshipRow,
  ChampionshipResultRow,
  DojoStatsRow,
  HallOfFameRow,
  StudentRow,
} from "@/types/database";

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatStatus(status: ChampionshipRow["status"]): string {
  const map: Record<string, string> = {
    finalizado: "Finalizado",
    "em-andamento": "Em Andamento",
    futuro: "Futuro",
  };
  return map[status] ?? status;
}

function toMedalCards(stats: DojoStatsRow): MedalCounterCard[] {
  return [
    {
      label: "Ouro",
      count: stats.total_gold,
      iconName: "military_tech",
      iconColorClass: "text-yellow-400",
      cardVariant: "default",
    },
    {
      label: "Prata",
      count: stats.total_silver,
      iconName: "military_tech",
      iconColorClass: "text-slate-300",
      cardVariant: "default",
    },
    {
      label: "Bronze",
      count: stats.total_bronze,
      iconName: "military_tech",
      iconColorClass: "text-orange-400",
      cardVariant: "default",
    },
  ];
}

const HOF_COLORS = [
  "text-yellow-400",
  "text-primary",
  "text-orange-400",
  "text-slate-300",
];

function computeHallOfFame(
  results: ChampionshipResultRow[],
  hofRows: HallOfFameRow[]
): HallOfFameAthlete[] {
  // Key by student_id when available, fall back to normalised name
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

  const top4 = Array.from(medalMap.entries())
    .filter(([, m]) => m.gold > 0)
    .sort(
      (a, b) =>
        b[1].gold - a[1].gold ||
        b[1].silver - a[1].silver ||
        b[1].bronze - a[1].bronze
    )
    .slice(0, 4);

  // Index HOF overrides by student_id (preferred) and by name
  const hofByStudentId = new Map(
    hofRows.filter((r) => r.student_id).map((r) => [r.student_id!, r])
  );
  const hofByName = new Map(
    hofRows.map((r) => [r.name.toLowerCase().trim(), r])
  );

  return top4.map(([, medals], index) => {
    const hof =
      (medals.studentId ? hofByStudentId.get(medals.studentId) : undefined) ??
      hofByName.get(medals.originalName.toLowerCase().trim());
    const name = hof?.name ?? medals.originalName;
    const achievement =
      hof?.achievement ??
      `${medals.gold} Medalha${medals.gold > 1 ? "s" : ""} de Ouro`;
    return {
      id: hof?.id ?? medals.studentId ?? medals.originalName,
      name,
      achievement,
      achievementColorClass: HOF_COLORS[index] ?? "text-white",
      photoSrc: hof?.photo_url ?? "/images/campeonatos/placeholder.jpg",
      photoAlt: `${name} com medalha`,
    };
  });
}

interface ChampWithResults extends ChampionshipRow {
  championship_results: ChampionshipResultRow[];
}

function normalizeBelt(belt: string): BeltColor {
  if (belt.startsWith("preta")) return "preta";
  const known: BeltColor[] = [
    "branca",
    "amarela",
    "laranja",
    "verde",
    "azul",
    "roxa",
    "marrom",
    "vermelha",
  ];
  return known.includes(belt as BeltColor) ? (belt as BeltColor) : "branca";
}

function deriveAgeCategory(birthDate: string | null): AgeCategory {
  if (!birthDate) return "adulto";
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    now.getMonth() > birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
  if (!hasBirthdayPassed) age -= 1;
  if (age < 14) return "infantil";
  if (age < 18) return "juvenil";
  if (age < 35) return "adulto";
  return "master";
}

function buildAthleteRankings(
  students: Pick<StudentRow, "id" | "name" | "belt" | "birth_date">[],
  results: ChampionshipResultRow[]
): AthleteRanking[] {
  // Key by student_id when available, fall back to normalised name
  const medalMapById = new Map<string, { gold: number; silver: number; bronze: number }>();
  const medalMapByName = new Map<string, { gold: number; silver: number; bronze: number }>();

  for (const r of results) {
    if (r.student_id) {
      const entry = medalMapById.get(r.student_id) ?? { gold: 0, silver: 0, bronze: 0 };
      if (r.placement === 1) entry.gold++;
      else if (r.placement === 2) entry.silver++;
      else entry.bronze++;
      medalMapById.set(r.student_id, entry);
    } else {
      const key = r.athlete_name.toLowerCase().trim();
      const entry = medalMapByName.get(key) ?? { gold: 0, silver: 0, bronze: 0 };
      if (r.placement === 1) entry.gold++;
      else if (r.placement === 2) entry.silver++;
      else entry.bronze++;
      medalMapByName.set(key, entry);
    }
  }

  return students.map((s) => {
    const medals =
      medalMapById.get(s.id) ??
      medalMapByName.get(s.name.toLowerCase().trim()) ??
      { gold: 0, silver: 0, bronze: 0 };
    return {
      id: s.id,
      name: s.name,
      photoSrc: "",
      photoAlt: s.name,
      belt: normalizeBelt(s.belt),
      ageCategory: deriveAgeCategory(s.birth_date),
      medals,
    };
  });
}

function toChampionshipEvent(row: ChampWithResults): ChampionshipEvent {
  return {
    id: row.id,
    title: row.name,
    date: formatDate(row.event_date),
    eventDateIso: row.event_date,
    location: row.location,
    status: formatStatus(row.status),
    medals: {
      gold: row.gold,
      silver: row.silver,
      bronze: row.bronze,
    },
    results: (row.championship_results ?? []).map((r) => ({
      athleteName: r.athlete_name,
      placement: r.placement as 1 | 2 | 3,
      category: r.category,
    })),
  };
}

export async function getChampionshipsPageData(): Promise<{
  medalCards: MedalCounterCard[];
  hallOfFame: HallOfFameAthlete[];
  events: ChampionshipEvent[];
  athleteRankings: AthleteRanking[];
}> {
  const supabase = await createSupabaseServerClient();

  const [statsRes, hofRes, champsRes, studentsRes] = await Promise.all([
    supabase.from("dojo_stats").select("*").single(),
    supabase.from("hall_of_fame").select("*").order("display_order"),
    supabase
      .from("championships")
      .select("*, championship_results(*)")
      .order("display_order"),
    supabase
      .from("students")
      .select("id, name, belt, birth_date")
      .eq("active", true)
      .order("name"),
  ]);

  const statsData = statsRes.data as DojoStatsRow | null;
  const medalCards = statsData ? toMedalCards(statsData) : [];

  const champsData = (champsRes.data ?? []) as ChampWithResults[];
  const events = champsData.map(toChampionshipEvent);

  const allResults = champsData.flatMap((c) => c.championship_results ?? []);

  const hallOfFame = computeHallOfFame(allResults, hofRes.data ?? []);
  const athleteRankings = buildAthleteRankings(
    studentsRes.data ?? [],
    allResults
  );

  return { medalCards, hallOfFame, events, athleteRankings };
}
