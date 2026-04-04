import type { Metadata } from "next";
import { PlansHero } from "@/components/planos/plans-hero";
import { PlansPricingGrid } from "@/components/planos/plans-pricing-grid";
import { PlansBeltExam } from "@/components/planos/plans-belt-exam";
import { PlansDropIn } from "@/components/planos/plans-drop-in";
import { PlansFaq } from "@/components/planos/plans-faq";
import { PlansCta } from "@/components/planos/plans-cta";
import { SITE_URL } from "@/lib/constants";
import { getPlansPageData } from "@/services/plans";

export const revalidate = 3600;

const description =
  "Conheça os planos de karate do Dojo Luciano dos Santos: mensalidades, exames de faixa, aulas avulsas e formas de pagamento. Primeira aula grátis.";

const ogDescription =
  "Planos mensais, trimestrais e anuais de karate. Exames de faixa e aulas avulsas.";

const canonical = `${SITE_URL}/planos`;

export const metadata: Metadata = {
  title: "Planos e Valores",
  description,
  keywords: ["mensalidade karate", "preço karate Dourados"],
  openGraph: {
    title: "Planos e Valores",
    description: ogDescription,
    url: canonical,
  },
  alternates: { canonical },
};

export default async function PlanosPage() {
  const { plans, beltExams, dropIn, faq } = await getPlansPageData();
  return (
    <>
      <PlansHero />
      <div className="bg-background-light">
        <div className="mx-auto max-w-[1100px] px-4 pb-16">
          <PlansPricingGrid plans={plans} />
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <PlansBeltExam exams={beltExams} />
            <PlansDropIn items={dropIn} />
          </div>
        </div>
      </div>
      <PlansFaq items={faq} />
      <PlansCta />
    </>
  );
}
