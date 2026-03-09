import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ChampionshipsHero } from "./championships-hero";

describe("ChampionshipsHero", () => {
  afterEach(cleanup);

  it("renders H1 containing 'Nossas Conquistas e Glórias'", () => {
    render(<ChampionshipsHero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /nossas conquistas e glórias/i,
      })
    ).toBeTruthy();
  });

  it("renders the 'Resultados Oficiais' badge text", () => {
    render(<ChampionshipsHero />);
    expect(screen.getByText(/resultados oficiais/i)).toBeTruthy();
  });

  it("renders exactly 4 medal counter cards (Ouro, Prata, Bronze, Troféus Gerais)", () => {
    render(<ChampionshipsHero />);
    expect(screen.getByText("Ouro")).toBeTruthy();
    expect(screen.getByText("Prata")).toBeTruthy();
    expect(screen.getByText("Bronze")).toBeTruthy();
    expect(screen.getByText("Troféus Gerais")).toBeTruthy();
  });

  it("renders count '127' for Ouro", () => {
    render(<ChampionshipsHero />);
    expect(screen.getByText("127")).toBeTruthy();
  });

  it("renders count '84' for Prata", () => {
    render(<ChampionshipsHero />);
    expect(screen.getByText("84")).toBeTruthy();
  });

  it("renders count '56' for Bronze", () => {
    render(<ChampionshipsHero />);
    expect(screen.getByText("56")).toBeTruthy();
  });

  it("renders count '15' for Troféus Gerais", () => {
    render(<ChampionshipsHero />);
    expect(screen.getByText("15")).toBeTruthy();
  });

  it("Troféus Gerais card has bg-primary class", () => {
    const { container } = render(<ChampionshipsHero />);
    const primaryCard = container.querySelector(".bg-primary");
    expect(primaryCard).toBeTruthy();
  });
});
