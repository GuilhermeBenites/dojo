import type { Metadata } from "next";
import { ChampionshipsHero } from "@/components/campeonatos/championships-hero";
import { ChampionshipsHallOfFame } from "@/components/campeonatos/championships-hall-of-fame";
import { ChampionshipsTimeline } from "@/components/campeonatos/championships-timeline";
import { ChampionshipsCta } from "@/components/campeonatos/championships-cta";
import { getChampionshipsPageData } from "@/services/championships";

export const revalidate = 3600;
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

export default async function CampeonatosPage() {
  const { medalCards, hallOfFame, events } =
    await getChampionshipsPageData();
  return (
    <>
      <ChampionshipsHero cards={medalCards} />
      <ChampionshipsHallOfFame athletes={hallOfFame} />
      <ChampionshipsTimeline events={events} />
      <ChampionshipsCta />
    </>
  );
}
