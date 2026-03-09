import type {
  PricingPlan,
  BeltExamRow,
  DropInItem,
  FaqItem,
} from "@/types/plans";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "tres-vezes",
    title: "3x por Semana",
    subtitle: "Treino intenso para máxima evolução",
    recommended: false,
    tiers: [
      { label: "Mês", price: "R$ 300,00", isMonthlyHighlight: true },
      {
        label: "Trimestral",
        price: "R$ 280,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
      {
        label: "Semestral",
        price: "R$ 270,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
      {
        label: "Anual",
        price: "R$ 250,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
    ],
  },
  {
    id: "duas-vezes",
    title: "2x por Semana",
    subtitle: "Equilíbrio ideal de rotina",
    recommended: true,
    tiers: [
      { label: "Mês", price: "R$ 280,00", isMonthlyHighlight: true },
      {
        label: "Trimestral",
        price: "R$ 270,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
      {
        label: "Semestral",
        price: "R$ 250,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
      {
        label: "Anual",
        price: "R$ 240,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
    ],
  },
  {
    id: "familia",
    title: "Família",
    subtitle: "Treinem juntos com desconto",
    recommended: false,
    tiers: [
      { label: "Mês", price: "R$ 250,00", isMonthlyHighlight: true },
      {
        label: "Trimestral",
        price: "R$ 240,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
      {
        label: "Semestral",
        price: "R$ 225,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
      {
        label: "Anual",
        price: "R$ 215,00",
        isMonthlyHighlight: false,
        suffix: "/mês",
      },
    ],
  },
];

export const BELT_EXAMS: BeltExamRow[] = [
  {
    id: "branca-verde",
    belt: "Branca até Verde",
    price: "R$ 210,00",
    familyPrice: "Família: R$ 200,00",
    highlighted: true,
  },
  {
    id: "verde-roxa",
    belt: "Verde para Roxa",
    price: "R$ 250,00",
    familyPrice: "Família: R$ 230,00",
    highlighted: true,
  },
  {
    id: "roxa-marrom",
    belt: "Roxa para Marrom",
    price: "R$ 300,00",
    familyPrice: "Família: R$ 250,00",
    highlighted: true,
  },
  {
    id: "faixa-simples",
    belt: "Valor da Faixa Simples",
    price: "R$ 45,00",
    familyPrice: "Família: R$ 40,00",
    highlighted: false,
  },
];

export const DROP_IN_CLASSES: DropInItem[] = [
  {
    id: "avulsa-dojo",
    label: "Aula Avulsa (Dojo)",
    price: "R$ 60,00",
  },
  {
    id: "alto-rendimento",
    label: "Alto Rendimento / Competição",
    price: "R$ 30,00",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "kimono",
    question: "Preciso comprar o kimono logo no início?",
    answer:
      "Não é obrigatório para as primeiras aulas experimentais. Após o primeiro mês, o kimono é necessário.",
  },
  {
    id: "exames",
    question: "Como funcionam os exames de faixa?",
    answer:
      "Os exames de faixa ocorrem a cada 3 a 6 meses conforme o estágio e desenvolvimento técnico. O sensei avalia e aprova.",
  },
  {
    id: "lesao",
    question: "Posso trancar o plano em caso de lesão?",
    answer:
      "Sim. Com atestado médico, o plano pode ser congelado por até 60 dias sem custo adicional.",
  },
  {
    id: "pagamento",
    question: "Quais são as formas de pagamento aceitas?",
    answer:
      "Aceitamos cartão de crédito (recorrência), débito, PIX e dinheiro. Planos trimestrais e anuais podem ser parcelados no cartão.",
  },
];
