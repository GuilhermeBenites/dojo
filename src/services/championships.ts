import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ChampionshipEvent,
  HallOfFameAthlete,
  MedalCounterCard,
} from "@/types/championships";
import type {
  ChampionshipRow,
  ChampionshipResultRow,
  DojoStatsRow,
  HallOfFameRow,
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
    {
      label: "Troféus Gerais",
      count: stats.total_trophies,
      iconName: "emoji_events",
      iconColorClass: "text-white",
      cardVariant: "primary",
    },
  ];
}

const HOF_COLORS = [
  "text-yellow-400",
  "text-primary",
  "text-orange-400",
  "text-slate-300",
];

function toHallOfFameAthlete(
  row: HallOfFameRow,
  index: number
): HallOfFameAthlete {
  return {
    id: row.id,
    name: row.name,
    achievement: row.achievement,
    achievementColorClass: HOF_COLORS[index] ?? "text-white",
    photoSrc: row.photo_url ?? "/images/campeonatos/placeholder.jpg",
    photoAlt: `${row.name} com troféu`,
  };
}

interface ChampWithResults extends ChampionshipRow {
  championship_results: ChampionshipResultRow[];
}

function toChampionshipEvent(row: ChampWithResults): ChampionshipEvent {
  return {
    id: row.id,
    title: row.name,
    date: formatDate(row.event_date),
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
}> {
  const supabase = await createSupabaseServerClient();

  const [statsRes, hofRes, champsRes] = await Promise.all([
    supabase.from("dojo_stats").select("*").single(),
    supabase.from("hall_of_fame").select("*").order("display_order"),
    supabase
      .from("championships")
      .select("*, championship_results(*)")
      .order("display_order"),
  ]);

  if (statsRes.error || hofRes.error || champsRes.error) {
    const {
      MEDAL_COUNTER_CARDS,
      HALL_OF_FAME,
      CHAMPIONSHIPS,
    } = await import("@/components/campeonatos/campeonatos-data");
    return {
      medalCards: MEDAL_COUNTER_CARDS,
      hallOfFame: HALL_OF_FAME,
      events: CHAMPIONSHIPS,
    };
  }

  const statsData = statsRes.data as DojoStatsRow | null;
  const medalCards = statsData
    ? toMedalCards(statsData)
    : (await import("@/components/campeonatos/campeonatos-data"))
        .MEDAL_COUNTER_CARDS;

  const hofData = hofRes.data ?? [];
  const hallOfFame =
    hofData.length > 0
      ? hofData.map((r, i) => toHallOfFameAthlete(r, i))
      : (await import("@/components/campeonatos/campeonatos-data"))
          .HALL_OF_FAME;

  const champsData = champsRes.data ?? [];
  const events =
    champsData.length > 0
      ? champsData.map((r) => toChampionshipEvent(r as ChampWithResults))
      : (await import("@/components/campeonatos/campeonatos-data"))
          .CHAMPIONSHIPS;

  return {
    medalCards,
    hallOfFame,
    events,
  };
}
