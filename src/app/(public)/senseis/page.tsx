import type { Metadata } from "next";
import { FounderHero } from "@/components/senseis/founder-hero";
import { InstructorsGrid } from "@/components/senseis/instructors-grid";
import { SITE_URL } from "@/lib/constants";
import { getSenseis } from "@/services/senseis";

export const revalidate = 3600;

const description =
  "Conheça o Sensei Luciano dos Santos, Faixa Preta 5º Dan, e nossa equipe de instrutores altamente qualificados em Karate Shotokan.";

const canonical = `${SITE_URL}/senseis`;

export const metadata: Metadata = {
  title: "Nossos Senseis",
  description,
  keywords: ["sensei", "faixa preta", "instrutor de karate"],
  openGraph: {
    title: "Nossos Senseis",
    description,
    url: canonical,
  },
  alternates: { canonical },
};

export default async function SenseisPage() {
  const { founder, instructors } = await getSenseis();
  return (
    <>
      <FounderHero founder={founder} />
      <InstructorsGrid instructors={instructors} />
    </>
  );
}
