import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { PlansFaq } from "./plans-faq";
import type { FaqItem } from "@/types/plans";

const faqItems: FaqItem[] = [
  {
    id: "kimono",
    question: "Preciso comprar o kimono logo no início?",
    answer: "Não é obrigatório para as primeiras aulas experimentais.",
  },
  {
    id: "exames",
    question: "Como funcionam os exames de faixa?",
    answer: "Os exames de faixa ocorrem a cada 3 a 6 meses.",
  },
  {
    id: "lesao",
    question: "Posso trancar o plano em caso de lesão?",
    answer: "Sim, com atestado médico.",
  },
  {
    id: "pagamento",
    question: "Quais são as formas de pagamento aceitas?",
    answer: "Cartão de crédito, débito, PIX e dinheiro.",
  },
];

describe("PlansFaq", () => {
  afterEach(cleanup);

  it("renders H2 containing Dúvidas Frequentes", () => {
    render(<PlansFaq items={faqItems} />);
    expect(
      screen.getByRole("heading", {
        name: /dúvidas frequentes/i,
        level: 2,
      })
    ).toBeTruthy();
  });

  it("renders all 4 question strings as trigger buttons", () => {
    render(<PlansFaq items={faqItems} />);
    expect(
      screen.getByRole("button", { name: /preciso comprar o kimono/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /como funcionam os exames de faixa/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /posso trancar o plano/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: /quais são as formas de pagamento/i,
      })
    ).toBeTruthy();
  });

  it("all accordion content is initially hidden (not visible)", () => {
    const { container } = render(<PlansFaq items={faqItems} />);
    const closedContents = container.querySelectorAll(
      '[data-state="closed"]',
    );
    expect(closedContents.length).toBeGreaterThanOrEqual(4);
  });

  it("clicking first question trigger reveals its answer text", () => {
    const { container } = render(<PlansFaq items={faqItems} />);
    fireEvent.click(screen.getByRole("button", { name: /preciso comprar o kimono/i }));
    expect(
      screen.getByText(/não é obrigatório para as primeiras aulas/i),
    ).toBeTruthy();
    const openContent = container.querySelector('[data-state="open"]');
    expect(openContent).toBeTruthy();
  });

  it("after opening first item, clicking it again hides the answer", () => {
    const { container } = render(<PlansFaq items={faqItems} />);
    const trigger = screen.getByRole("button", { name: /preciso comprar o kimono/i });
    fireEvent.click(trigger);
    expect(
      screen.getByText(/não é obrigatório para as primeiras aulas/i),
    ).toBeTruthy();
    fireEvent.click(trigger);
    const openContents = container.querySelectorAll('[data-state="open"]');
    expect(openContents.length).toBe(0);
  });

  it("two items can be open simultaneously (type=multiple)", () => {
    render(<PlansFaq items={faqItems} />);
    fireEvent.click(screen.getByRole("button", { name: /preciso comprar o kimono/i }));
    fireEvent.click(screen.getByRole("button", { name: /como funcionam os exames de faixa/i }));
    expect(
      screen.getByText(/não é obrigatório para as primeiras aulas/i),
    ).toBeTruthy();
    expect(screen.getByText(/os exames de faixa ocorrem/i)).toBeTruthy();
  });

  it("clicking second question does not close the first (multiple mode)", () => {
    render(<PlansFaq items={faqItems} />);
    fireEvent.click(screen.getByRole("button", { name: /preciso comprar o kimono/i }));
    fireEvent.click(screen.getByRole("button", { name: /como funcionam os exames de faixa/i }));
    expect(
      screen.getByText(/não é obrigatório para as primeiras aulas/i),
    ).toBeTruthy();
    expect(screen.getByText(/os exames de faixa ocorrem/i)).toBeTruthy();
  });

  it("all trigger buttons are keyboard accessible (role=button)", () => {
    render(<PlansFaq items={faqItems} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(4);
  });
});
