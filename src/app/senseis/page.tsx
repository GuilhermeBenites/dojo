import type { Metadata } from "next";
import { FounderHero } from "@/components/senseis/founder-hero";
import { InstructorsGrid } from "@/components/senseis/instructors-grid";
import { FOUNDER, INSTRUCTORS } from "@/components/senseis/senseis-data";

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

export default function SenseisPage() {
  return (
    <>
      <FounderHero founder={FOUNDER} />
      <InstructorsGrid instructors={INSTRUCTORS} />
    </>
  );
}
