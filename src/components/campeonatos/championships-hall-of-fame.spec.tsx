import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ChampionshipsHallOfFame } from "./championships-hall-of-fame";
import type { HallOfFameAthlete } from "@/types/championships";

const MOCK_ATHLETES: HallOfFameAthlete[] = [
  { id: "1", name: "Sensei Luciano", achievement: "Campeão Mundial 2022", achievementColorClass: "text-yellow-400", photoSrc: "/images/gallery/placeholder.jpg", photoAlt: "Foto Sensei Luciano" },
  { id: "2", name: "Ana Silva", achievement: "Campeã Brasileira 2023", achievementColorClass: "text-yellow-400", photoSrc: "/images/gallery/placeholder.jpg", photoAlt: "Foto Ana Silva" },
  { id: "3", name: "Pedro Santos", achievement: "Ouro Pan-Americano", achievementColorClass: "text-yellow-400", photoSrc: "/images/gallery/placeholder.jpg", photoAlt: "Foto Pedro Santos" },
  { id: "4", name: "Julia Costa", achievement: "Tricampeã Estadual", achievementColorClass: "text-yellow-400", photoSrc: "/images/gallery/placeholder.jpg", photoAlt: "Foto Julia Costa" },
];

describe("ChampionshipsHallOfFame", () => {
  afterEach(cleanup);

  it("renders H2 containing 'Hall da Fama'", () => {
    render(<ChampionshipsHallOfFame athletes={MOCK_ATHLETES} />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /hall da fama/i,
      })
    ).toBeTruthy();
  });

  it("renders exactly 4 athlete cards", () => {
    render(<ChampionshipsHallOfFame athletes={MOCK_ATHLETES} />);
    expect(screen.getByText("Sensei Luciano")).toBeTruthy();
    expect(screen.getByText("Ana Silva")).toBeTruthy();
    expect(screen.getByText("Pedro Santos")).toBeTruthy();
    expect(screen.getByText("Julia Costa")).toBeTruthy();
  });

  it("each card renders the athlete's name as visible text", () => {
    render(<ChampionshipsHallOfFame athletes={MOCK_ATHLETES} />);
    expect(screen.getByText("Sensei Luciano")).toBeTruthy();
    expect(screen.getByText("Ana Silva")).toBeTruthy();
    expect(screen.getByText("Pedro Santos")).toBeTruthy();
    expect(screen.getByText("Julia Costa")).toBeTruthy();
  });

  it("each card renders the achievement string as visible text", () => {
    render(<ChampionshipsHallOfFame athletes={MOCK_ATHLETES} />);
    expect(screen.getByText("Campeão Mundial 2022")).toBeTruthy();
    expect(screen.getByText("Campeã Brasileira 2023")).toBeTruthy();
    expect(screen.getByText("Ouro Pan-Americano")).toBeTruthy();
    expect(screen.getByText("Tricampeã Estadual")).toBeTruthy();
  });

  it('"Ver todos os atletas" link is present', () => {
    render(<ChampionshipsHallOfFame athletes={MOCK_ATHLETES} />);
    expect(
      screen.getByRole("link", { name: /ver todos os atletas/i })
    ).toBeTruthy();
  });

  it("all 4 athlete images have non-empty alt attributes", () => {
    render(<ChampionshipsHallOfFame athletes={MOCK_ATHLETES} />);
    const images = screen.getAllByRole("img");
    const athleteImages = images.filter((img) => img.getAttribute("alt")?.length);
    expect(athleteImages.length).toBe(4);
  });
});
