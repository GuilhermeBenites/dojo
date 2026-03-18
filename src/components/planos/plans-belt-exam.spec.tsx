import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { PlansBeltExam } from "./plans-belt-exam";
import type { BeltExamRow } from "@/types/plans";

const MOCK_EXAMS: BeltExamRow[] = [
  { id: "1", belt: "Branca até Verde", price: "R$ 210,00", familyPrice: "Família: R$ 200,00", highlighted: true },
  { id: "2", belt: "Verde para Roxa", price: "R$ 250,00", familyPrice: "Família: R$ 230,00", highlighted: true },
  { id: "3", belt: "Roxa para Marrom", price: "R$ 300,00", familyPrice: "Família: R$ 250,00", highlighted: true },
  { id: "4", belt: "Valor da Faixa Simples", price: "R$ 45,00", familyPrice: "Família: R$ 40,00", highlighted: false },
];

describe("PlansBeltExam", () => {
  afterEach(cleanup);

  it("renders H3 containing Exame de Faixa", () => {
    render(<PlansBeltExam exams={MOCK_EXAMS} />);
    expect(
      screen.getByRole("heading", { name: /exame de faixa/i, level: 3 }),
    ).toBeTruthy();
  });

  it("renders exactly 4 belt exam rows", () => {
    render(<PlansBeltExam exams={MOCK_EXAMS} />);
    const beltNames = [
      "Branca até Verde",
      "Verde para Roxa",
      "Roxa para Marrom",
      "Valor da Faixa Simples",
    ];
    beltNames.forEach((name) => {
      expect(screen.getByText(name)).toBeTruthy();
    });
  });

  it("renders all belt names", () => {
    render(<PlansBeltExam exams={MOCK_EXAMS} />);
    expect(screen.getByText("Branca até Verde")).toBeTruthy();
    expect(screen.getByText("Verde para Roxa")).toBeTruthy();
    expect(screen.getByText("Roxa para Marrom")).toBeTruthy();
    expect(screen.getByText("Valor da Faixa Simples")).toBeTruthy();
  });

  it("renders all primary prices", () => {
    render(<PlansBeltExam exams={MOCK_EXAMS} />);
    expect(screen.getByText("R$ 210,00")).toBeTruthy();
    expect(screen.getByText("R$ 250,00")).toBeTruthy();
    expect(screen.getByText("R$ 300,00")).toBeTruthy();
    expect(screen.getByText("R$ 45,00")).toBeTruthy();
  });

  it("renders all family prices", () => {
    render(<PlansBeltExam exams={MOCK_EXAMS} />);
    expect(screen.getByText("Família: R$ 200,00")).toBeTruthy();
    expect(screen.getByText("Família: R$ 230,00")).toBeTruthy();
    expect(screen.getByText("Família: R$ 250,00")).toBeTruthy();
    expect(screen.getByText("Família: R$ 40,00")).toBeTruthy();
  });

  it("highlighted: true rows have bg-slate-50 class", () => {
    const { container } = render(<PlansBeltExam exams={MOCK_EXAMS} />);
    const highlightedRows = container.querySelectorAll(".bg-slate-50");
    expect(highlightedRows.length).toBe(3);
  });

  it("highlighted: false row (Valor da Faixa Simples) has border-slate-100 and no bg-slate-50", () => {
    const { container } = render(<PlansBeltExam exams={MOCK_EXAMS} />);
    const allRows = container.querySelectorAll('[class*="rounded-lg"]');
    const faixaSimplesRow = Array.from(allRows).find((el) =>
      el.textContent?.includes("Valor da Faixa Simples"),
    );
    expect(faixaSimplesRow).toBeTruthy();
    expect(faixaSimplesRow?.classList.contains("bg-slate-50")).toBe(false);
    expect(faixaSimplesRow?.classList.contains("border-slate-100")).toBe(true);
  });
});
