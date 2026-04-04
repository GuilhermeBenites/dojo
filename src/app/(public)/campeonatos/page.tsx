import type { Metadata } from "next";
import { ChampionshipsHero } from "@/components/campeonatos/championships-hero";
import { ChampionshipsHallOfFame } from "@/components/campeonatos/championships-hall-of-fame";
import { ChampionshipsTimeline } from "@/components/campeonatos/championships-timeline";
import { ChampionshipsCta } from "@/components/campeonatos/championships-cta";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/constants";
import { getChampionshipsPageData } from "@/services/championships";

export const revalidate = 3600;

const description =
  "Conquistas e resultados oficiais do Dojo Luciano dos Santos em campeonatos de karate. Hall da Fama, medalhas e histórico completo de competições.";

const ogDescription =
  "Conquistas e resultados oficiais do Dojo Luciano dos Santos em campeonatos de karate.";

const canonical = `${SITE_URL}/campeonatos`;

export const metadata: Metadata = {
  title: "Campeonatos & Conquistas",
  description,
  keywords: ["campeonato karate", "resultados", "medalhas"],
  openGraph: {
    title: "Campeonatos & Conquistas",
    description: ogDescription,
    url: canonical,
  },
  alternates: { canonical },
};

export default async function CampeonatosPage() {
  const { medalCards, hallOfFame, events, athleteRankings } =
    await getChampionshipsPageData();

  const eventsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Campeonatos — Dojo Luciano dos Santos",
    itemListElement: events.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsEvent",
        name: c.title,
        startDate: c.eventDateIso,
        location: {
          "@type": "Place",
          name: c.location,
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={eventsSchema} />
      <ChampionshipsHero cards={medalCards} />
      <ChampionshipsHallOfFame athletes={hallOfFame} athleteRankings={athleteRankings} />
      <ChampionshipsTimeline events={events} />
      <ChampionshipsCta />
    </>
  );
}
