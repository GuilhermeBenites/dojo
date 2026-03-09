import type {
  ChampionshipEvent,
  HallOfFameAthlete,
  MedalCounterCard,
} from "@/types/championships";

export const MEDAL_COUNTER_CARDS: MedalCounterCard[] = [
  {
    label: "Ouro",
    count: 127,
    iconName: "military_tech",
    iconColorClass: "text-yellow-400",
    cardVariant: "default",
  },
  {
    label: "Prata",
    count: 84,
    iconName: "military_tech",
    iconColorClass: "text-slate-300",
    cardVariant: "default",
  },
  {
    label: "Bronze",
    count: 56,
    iconName: "military_tech",
    iconColorClass: "text-orange-400",
    cardVariant: "default",
  },
  {
    label: "Troféus Gerais",
    count: 15,
    iconName: "emoji_events",
    iconColorClass: "text-white",
    cardVariant: "primary",
  },
];

export const HALL_OF_FAME: HallOfFameAthlete[] = [
  {
    id: "hof-luciano",
    name: "Sensei Luciano",
    achievement: "Campeão Mundial 2022",
    achievementColorClass: "text-yellow-400",
    photoSrc: "/images/campeonatos/placeholder.jpg",
    photoAlt: "Sensei Luciano segurando troféu de campeão mundial",
  },
  {
    id: "hof-ana",
    name: "Ana Silva",
    achievement: "Campeã Brasileira 2023",
    achievementColorClass: "text-primary",
    photoSrc: "/images/campeonatos/placeholder.jpg",
    photoAlt: "Ana Silva com medalha de ouro do campeonato",
  },
  {
    id: "hof-pedro",
    name: "Pedro Santos",
    achievement: "Ouro Pan-Americano",
    achievementColorClass: "text-orange-400",
    photoSrc: "/images/campeonatos/placeholder.jpg",
    photoAlt: "Pedro Santos em posição de kata",
  },
  {
    id: "hof-julia",
    name: "Julia Costa",
    achievement: "Tricampeã Estadual",
    achievementColorClass: "text-slate-300",
    photoSrc: "/images/campeonatos/placeholder.jpg",
    photoAlt: "Julia Costa com troféu estadual",
  },
];

export const CHAMPIONSHIPS: ChampionshipEvent[] = [
  {
    id: "paulista-2024",
    title: "Campeonato Paulista de Karate 2024",
    date: "15/03/2024",
    location: "Ginásio do Ibirapuera, São Paulo",
    status: "Finalizado",
    medals: { gold: 5, silver: 2, bronze: 3 },
    results: [
      { athleteName: "João Oliveira", placement: 1, category: "Kumite -75kg" },
      { athleteName: "Mariana Costa", placement: 1, category: "Kata Individual" },
      { athleteName: "Carlos Mendes", placement: 2, category: "Kumite +84kg" },
      {
        athleteName: "Equipe Masculina",
        placement: 3,
        category: "Kata Equipe",
      },
    ],
  },
  {
    id: "copa-brasil-2023",
    title: "Copa Brasil de Clubes",
    date: "10/11/2023",
    location: "Rio de Janeiro, RJ",
    status: "2023",
    medals: { gold: 2, silver: 4, bronze: 1 },
    results: [
      { athleteName: "Sensei Luciano", placement: 1, category: "Master Kata" },
      { athleteName: "Julia Costa", placement: 1, category: "Kumite -55kg" },
      { athleteName: "Pedro Santos", placement: 2, category: "Kumite -67kg" },
    ],
  },
  {
    id: "open-internacional-2023",
    title: "Open Internacional",
    date: "14/08/2023",
    location: "Curitiba, PR",
    status: "2023",
    medals: { gold: 8, silver: 3, bronze: 5 },
    results: [],
  },
];
