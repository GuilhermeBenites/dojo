import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ChampionshipsHallOfFame } from "./championships-hall-of-fame";

describe("ChampionshipsHallOfFame", () => {
  afterEach(cleanup);

  it("renders H2 containing 'Hall da Fama'", () => {
    render(<ChampionshipsHallOfFame />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /hall da fama/i,
      })
    ).toBeTruthy();
  });

  it("renders exactly 4 athlete cards", () => {
    render(<ChampionshipsHallOfFame />);
    expect(screen.getByText("Sensei Luciano")).toBeTruthy();
    expect(screen.getByText("Ana Silva")).toBeTruthy();
    expect(screen.getByText("Pedro Santos")).toBeTruthy();
    expect(screen.getByText("Julia Costa")).toBeTruthy();
  });

  it("each card renders the athlete's name as visible text", () => {
    render(<ChampionshipsHallOfFame />);
    expect(screen.getByText("Sensei Luciano")).toBeTruthy();
    expect(screen.getByText("Ana Silva")).toBeTruthy();
    expect(screen.getByText("Pedro Santos")).toBeTruthy();
    expect(screen.getByText("Julia Costa")).toBeTruthy();
  });

  it("each card renders the achievement string as visible text", () => {
    render(<ChampionshipsHallOfFame />);
    expect(screen.getByText("Campeão Mundial 2022")).toBeTruthy();
    expect(screen.getByText("Campeã Brasileira 2023")).toBeTruthy();
    expect(screen.getByText("Ouro Pan-Americano")).toBeTruthy();
    expect(screen.getByText("Tricampeã Estadual")).toBeTruthy();
  });

  it('"Ver todos os atletas" link is present', () => {
    render(<ChampionshipsHallOfFame />);
    expect(
      screen.getByRole("link", { name: /ver todos os atletas/i })
    ).toBeTruthy();
  });

  it("all 4 athlete images have non-empty alt attributes", () => {
    render(<ChampionshipsHallOfFame />);
    const images = screen.getAllByRole("img");
    const athleteImages = images.filter((img) => img.getAttribute("alt")?.length);
    expect(athleteImages.length).toBe(4);
  });
});
