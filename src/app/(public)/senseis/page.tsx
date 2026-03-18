import type { Metadata } from "next";
import { FounderHero } from "@/components/senseis/founder-hero";
import { InstructorsGrid } from "@/components/senseis/instructors-grid";
import { getSenseis } from "@/services/senseis";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Nossos Senseis | Dojo Luciano dos Santos",
  description:
    "Conheça o Sensei Luciano dos Santos, Faixa Preta 5º Dan, e nossa equipe de instrutores altamente qualificados em Karate Shotokan.",
  openGraph: {
    title: "Nossos Senseis | Dojo Luciano dos Santos",
    description:
      "Conheça o Sensei Luciano dos Santos, Faixa Preta 5º Dan, e nossa equipe de instrutores altamente qualificados em Karate Shotokan.",
    type: "website",
  },
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
