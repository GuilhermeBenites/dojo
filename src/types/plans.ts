export interface PricingTier {
  label: string; // "Mês" | "Trimestral" | "Semestral" | "Anual"
  price: string; // e.g. "R$ 300,00"
  isMonthlyHighlight: boolean; // true = rendered large with text-primary; false = normal
  suffix?: string; // "/mês" appended in small text for non-monthly tiers
}

export interface PricingPlan {
  id: string;
  title: string; // "3x por Semana" | "2x por Semana" | "Família"
  subtitle: string;
  tiers: PricingTier[];
  recommended: boolean; // true → border-primary, elevated badge, shadow-lg
}

export interface BeltExamRow {
  id: string;
  belt: string; // e.g. "Branca até Verde"
  price: string; // e.g. "R$ 210,00"
  familyPrice: string; // e.g. "Família: R$ 200,00"
  highlighted: boolean; // true = bg-slate-50 row; false = plain border row (faixa simples)
}

export interface DropInItem {
  id: string;
  label: string; // "Aula Avulsa (Dojo)"
  price: string; // "R$ 60,00"
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
