import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ChampionshipsHero } from "./championships-hero";
import type { MedalCounterCard } from "@/types/championships";

const MOCK_CARDS: MedalCounterCard[] = [
  { label: "Ouro", count: 127, iconName: "military_tech", iconColorClass: "text-yellow-400", cardVariant: "default" },
  { label: "Prata", count: 84, iconName: "military_tech", iconColorClass: "text-slate-400", cardVariant: "default" },
  { label: "Bronze", count: 56, iconName: "military_tech", iconColorClass: "text-orange-400", cardVariant: "default" },
  { label: "Troféus Gerais", count: 15, iconName: "emoji_events", iconColorClass: "text-white", cardVariant: "primary" },
];

describe("ChampionshipsHero", () => {
  afterEach(cleanup);

  it("renders H1 containing 'Nossas Conquistas e Glórias'", () => {
    render(<ChampionshipsHero cards={MOCK_CARDS} />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /nossas conquistas e glórias/i,
      })
    ).toBeTruthy();
  });

  it("renders the 'Resultados Oficiais' badge text", () => {
    render(<ChampionshipsHero cards={MOCK_CARDS} />);
    expect(screen.getByText(/resultados oficiais/i)).toBeTruthy();
  });

  it("renders exactly 4 medal counter cards (Ouro, Prata, Bronze, Troféus Gerais)", () => {
    render(<ChampionshipsHero cards={MOCK_CARDS} />);
    expect(screen.getByText("Ouro")).toBeTruthy();
    expect(screen.getByText("Prata")).toBeTruthy();
    expect(screen.getByText("Bronze")).toBeTruthy();
    expect(screen.getByText("Troféus Gerais")).toBeTruthy();
  });

  it("renders count '127' for Ouro", () => {
    render(<ChampionshipsHero cards={MOCK_CARDS} />);
    expect(screen.getByText("127")).toBeTruthy();
  });

  it("renders count '84' for Prata", () => {
    render(<ChampionshipsHero cards={MOCK_CARDS} />);
    expect(screen.getByText("84")).toBeTruthy();
  });

  it("renders count '56' for Bronze", () => {
    render(<ChampionshipsHero cards={MOCK_CARDS} />);
    expect(screen.getByText("56")).toBeTruthy();
  });

  it("renders count '15' for Troféus Gerais", () => {
    render(<ChampionshipsHero cards={MOCK_CARDS} />);
    expect(screen.getByText("15")).toBeTruthy();
  });

  it("Troféus Gerais card has bg-primary class", () => {
    const { container } = render(<ChampionshipsHero cards={MOCK_CARDS} />);
    const primaryCard = container.querySelector(".bg-primary");
    expect(primaryCard).toBeTruthy();
  });
});
