import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { PlansPricingCard } from "./plans-pricing-card";
import type { PricingPlan } from "@/types/plans";
import { WHATSAPP_URL } from "@/lib/constants";

const recommendedPlan: PricingPlan = {
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
};

const nonRecommendedPlan: PricingPlan = {
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
};

describe("PlansPricingCard", () => {
  afterEach(cleanup);

  it("renders the plan title", () => {
    render(<PlansPricingCard plan={nonRecommendedPlan} />);
    expect(screen.getByRole("heading", { name: /3x por semana/i })).toBeTruthy();
  });

  it("renders the plan subtitle", () => {
    render(<PlansPricingCard plan={nonRecommendedPlan} />);
    expect(screen.getByText("Treino intenso para máxima evolução")).toBeTruthy();
  });

  it("renders all 4 tier labels (Mês, Trimestral, Semestral, Anual)", () => {
    render(<PlansPricingCard plan={nonRecommendedPlan} />);
    expect(screen.getByText("Mês")).toBeTruthy();
    expect(screen.getByText("Trimestral")).toBeTruthy();
    expect(screen.getByText("Semestral")).toBeTruthy();
    expect(screen.getByText("Anual")).toBeTruthy();
  });

  it("renders monthly tier price (R$ 300,00) and non-monthly tiers render /mês suffix", () => {
    const { container } = render(<PlansPricingCard plan={nonRecommendedPlan} />);
    expect(screen.getByText("R$ 300,00")).toBeTruthy();
    const mesSuffixes = container.querySelectorAll(".text-slate-500");
    expect(mesSuffixes.length).toBe(3);
    expect(mesSuffixes[0].textContent).toBe("/mês");
  });

  it('recommended: true renders "Recomendado" badge text in the DOM', () => {
    render(<PlansPricingCard plan={recommendedPlan} />);
    expect(screen.getByText("Recomendado")).toBeTruthy();
  });

  it('recommended: false does NOT render "Recomendado" text', () => {
    render(<PlansPricingCard plan={nonRecommendedPlan} />);
    expect(screen.queryByText("Recomendado")).toBeNull();
  });

  it("recommended: true card has border-primary class on its root element", () => {
    const { container } = render(<PlansPricingCard plan={recommendedPlan} />);
    const card = container.firstElementChild;
    expect(card?.classList.contains("border-primary")).toBe(true);
  });

  it("recommended: false card does NOT have border-primary on its root element", () => {
    const { container } = render(<PlansPricingCard plan={nonRecommendedPlan} />);
    const card = container.firstElementChild;
    expect(card?.classList.contains("border-primary")).toBe(false);
  });

  it('"Escolher Plano" link has href matching WHATSAPP_URL pattern', () => {
    render(<PlansPricingCard plan={nonRecommendedPlan} />);
    const link = screen.getByRole("link", { name: /escolher plano/i });
    expect(link.getAttribute("href")).toBe(WHATSAPP_URL);
  });

  it('"Escolher Plano" link has target="_blank" and rel="noopener noreferrer"', () => {
    render(<PlansPricingCard plan={nonRecommendedPlan} />);
    const link = screen.getByRole("link", { name: /escolher plano/i });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
