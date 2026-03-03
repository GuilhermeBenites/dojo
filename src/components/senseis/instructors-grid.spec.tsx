import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { InstructorsGrid } from "./instructors-grid";
import { INSTRUCTORS } from "./senseis-data";

describe("InstructorsGrid", () => {
  afterEach(cleanup);

  it("renders a <section> element", () => {
    const { container } = render(
      <InstructorsGrid instructors={INSTRUCTORS} />
    );
    expect(container.querySelector("section")).not.toBeNull();
  });

  it('renders heading "Equipe de Instrutores"', () => {
    render(<InstructorsGrid instructors={INSTRUCTORS} />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /equipe de instrutores/i,
      })
    ).toBeTruthy();
  });

  it("renders subtitle paragraph", () => {
    render(<InstructorsGrid instructors={INSTRUCTORS} />);
    expect(
      screen.getByText(/nossa equipe é formada por profissionais/i)
    ).toBeTruthy();
  });

  it("renders exactly 3 instructor cards", () => {
    const { container } = render(
      <InstructorsGrid instructors={INSTRUCTORS} />
    );
    expect(container.querySelectorAll("article")).toHaveLength(3);
  });

  it("renders all 3 instructor names", () => {
    render(<InstructorsGrid instructors={INSTRUCTORS} />);
    expect(
      screen.getByRole("heading", { name: /anna santos/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /wynner armoa/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /letícia mendez/i })
    ).toBeTruthy();
  });

  it("renders all 3 specialty badges", () => {
    render(<InstructorsGrid instructors={INSTRUCTORS} />);
    expect(screen.getByText("Infantil")).toBeTruthy();
    expect(screen.getByText("Kata & Técnica")).toBeTruthy();
    expect(screen.getByText("Alto Rendimento")).toBeTruthy();
  });

  it("grid has correct column classes", () => {
    const { container } = render(
      <InstructorsGrid instructors={INSTRUCTORS} />
    );
    const grid = container.querySelector('[class*="lg:grid-cols-3"]');
    expect(grid).not.toBeNull();
  });
});
