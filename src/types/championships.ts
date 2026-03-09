export type EventStatus = "Finalizado" | string; // year string e.g. "2023"

export interface MedalCounts {
  gold: number;
  silver: number;
  bronze: number;
}

export interface IndividualResult {
  athleteName: string;
  placement: 1 | 2 | 3; // 1 = gold, 2 = silver, 3 = bronze
  category: string; // e.g. "Kumite -75kg", "Kata Individual"
}

export interface ChampionshipEvent {
  id: string;
  title: string;
  date: string; // display string e.g. "15/03/2024"
  location: string; // e.g. "Ginásio do Ibirapuera, São Paulo"
  status: EventStatus;
  medals: MedalCounts;
  results: IndividualResult[];
}

export interface HallOfFameAthlete {
  id: string;
  name: string;
  achievement: string; // e.g. "Campeão Mundial 2022"
  achievementColorClass: string; // Tailwind text color, e.g. "text-yellow-400"
  photoSrc: string;
  photoAlt: string;
}

export interface MedalCounterCard {
  label: string; // "Ouro" | "Prata" | "Bronze" | "Troféus Gerais"
  count: number;
  iconName: string; // Material Symbol name: "military_tech" | "emoji_events"
  iconColorClass: string; // e.g. "text-yellow-400"
  cardVariant: "default" | "primary"; // "primary" = bg-primary card for Troféus
}
