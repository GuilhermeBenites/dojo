import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ChampionshipsTimeline } from "./championships-timeline";
import type { ChampionshipEvent } from "@/types/championships";

const MOCK_EVENTS: ChampionshipEvent[] = [
  {
    id: "test-1",
    title: "Campeonato Paulista de Karate 2024",
    date: "15/03/2024",
    eventDateIso: "2024-03-15",
    location: "São Paulo",
    status: "Finalizado",
    medals: { gold: 5, silver: 2, bronze: 3 },
    results: [],
  },
  {
    id: "test-2",
    title: "Copa Brasil de Clubes",
    date: "10/11/2023",
    eventDateIso: "2023-11-10",
    location: "Rio de Janeiro",
    status: "2023",
    medals: { gold: 2, silver: 4, bronze: 1 },
    results: [],
  },
  {
    id: "test-3",
    title: "Open Internacional",
    date: "14/08/2023",
    eventDateIso: "2023-08-14",
    location: "Curitiba",
    status: "2023",
    medals: { gold: 8, silver: 3, bronze: 5 },
    results: [],
  },
];

describe("ChampionshipsTimeline", () => {
  afterEach(cleanup);

  it("renders exactly 2 event cards on initial mount", () => {
    render(<ChampionshipsTimeline events={MOCK_EVENTS} />);
    expect(
      screen.getByRole("heading", { name: /campeonato paulista de karate 2024/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /copa brasil de clubes/i })
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: /open internacional/i })
    ).toBeNull();
  });

  it("'Carregar mais resultados' button is visible when hidden events remain", () => {
    render(<ChampionshipsTimeline events={MOCK_EVENTS} />);
    expect(
      screen.getByRole("button", { name: /carregar mais resultados/i })
    ).toBeTruthy();
  });

  it("clicking the button reveals the third event card", () => {
    render(<ChampionshipsTimeline events={MOCK_EVENTS} />);
    fireEvent.click(
      screen.getByRole("button", { name: /carregar mais resultados/i })
    );
    expect(
      screen.getByRole("heading", { name: /open internacional/i })
    ).toBeTruthy();
  });

  it("after all events are visible, 'Carregar mais' button is no longer in the DOM", () => {
    render(<ChampionshipsTimeline events={MOCK_EVENTS} />);
    fireEvent.click(
      screen.getByRole("button", { name: /carregar mais resultados/i })
    );
    expect(
      screen.queryByRole("button", { name: /carregar mais resultados/i })
    ).toBeNull();
  });

  it("'Campeonato Paulista de Karate 2024' and 'Copa Brasil de Clubes' are visible initially", () => {
    render(<ChampionshipsTimeline events={MOCK_EVENTS} />);
    expect(
      screen.getByRole("heading", { name: /campeonato paulista de karate 2024/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /copa brasil de clubes/i })
    ).toBeTruthy();
  });

  it("'Open Internacional' is NOT visible initially", () => {
    render(<ChampionshipsTimeline events={MOCK_EVENTS} />);
    expect(
      screen.queryByRole("heading", { name: /open internacional/i })
    ).toBeNull();
  });
});
