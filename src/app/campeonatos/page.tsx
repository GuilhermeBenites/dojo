import type { Metadata } from "next";
import { ChampionshipsHero } from "@/components/campeonatos/championships-hero";
import { ChampionshipsHallOfFame } from "@/components/campeonatos/championships-hall-of-fame";
import { ChampionshipsTimeline } from "@/components/campeonatos/championships-timeline";
import { ChampionshipsCta } from "@/components/campeonatos/championships-cta";
import { CHAMPIONSHIPS } from "@/components/campeonatos/campeonatos-data";

export const metadata: Metadata = {
  title: "Campeonatos | Dojo Luciano dos Santos",
  description:
    "Conquistas e resultados oficiais do Dojo Luciano dos Santos em campeonatos de karate. Hall da Fama, medalhas e histórico completo de competições.",
  openGraph: {
    title: "Campeonatos | Dojo Luciano dos Santos",
    description:
      "Conquistas e resultados oficiais do Dojo Luciano dos Santos em campeonatos de karate.",
    type: "website",
  },
};

export default function CampeonatosPage() {
  return (
    <>
      <ChampionshipsHero />
      <ChampionshipsHallOfFame />
      <ChampionshipsTimeline events={CHAMPIONSHIPS} />
      <ChampionshipsCta />
    </>
  );
}
