import type { Metadata } from "next";
import {
  HeroSection,
  BenefitsSection,
  TestimonialsSection,
} from "@/components/home";
import { SITE_URL } from "@/lib/constants";
import { getTestimonials } from "@/services/testimonials";

export const revalidate = 3600;

const description =
  "Disciplina, foco e autodefesa para todas as idades. Transforme sua mente e corpo com a tradição do verdadeiro Karate.";

export const metadata: Metadata = {
  title: "Karate em Dourados MS",
  description,
  keywords: ["karate", "dojo", "artes marciais", "Dourados", "MS"],
  openGraph: {
    title: "Karate em Dourados MS — Dojo Luciano dos Santos",
    description,
    url: SITE_URL,
  },
  alternates: { canonical: SITE_URL },
};

export default async function Home() {
  const testimonials = await getTestimonials();
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
