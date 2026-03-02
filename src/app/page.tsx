import type { Metadata } from "next";
import {
  HeroSection,
  BenefitsSection,
  TestimonialsSection,
} from "@/components/home";

export const metadata: Metadata = {
  title: "Dojo Luciano dos Santos Karate | Tradição & Disciplina",
  description:
    "Disciplina, foco e autodefesa para todas as idades. Transforme sua mente e corpo com a tradição do verdadeiro Karate.",
  openGraph: {
    title: "Dojo Luciano dos Santos Karate",
    description:
      "Disciplina, foco e autodefesa para todas as idades. Transforme sua mente e corpo com a tradição do verdadeiro Karate.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
    </>
  );
}
