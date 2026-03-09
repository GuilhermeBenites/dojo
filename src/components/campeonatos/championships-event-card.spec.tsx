import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ChampionshipsEventCard } from "./championships-event-card";
import type { ChampionshipEvent } from "@/types/championships";

const eventWithResults: ChampionshipEvent = {
  id: "paulista-2024",
  title: "Campeonato Paulista de Karate 2024",
  date: "15/03/2024",
  location: "Ginásio do Ibirapuera, São Paulo",
  status: "Finalizado",
  medals: { gold: 5, silver: 2, bronze: 3 },
  results: [
    { athleteName: "João Oliveira", placement: 1, category: "Kumite -75kg" },
    { athleteName: "Mariana Costa", placement: 1, category: "Kata Individual" },
  ],
};

const eventWithYearStatus: ChampionshipEvent = {
  id: "copa-2023",
  title: "Copa Brasil",
  date: "10/11/2023",
  location: "Rio de Janeiro",
  status: "2023",
  medals: { gold: 2, silver: 4, bronze: 1 },
  results: [],
};

describe("ChampionshipsEventCard", () => {
  afterEach(cleanup);

  it("renders the event title", () => {
    render(
      <ChampionshipsEventCard event={eventWithResults} isMostRecent={true} />
    );
    expect(
      screen.getByRole("heading", {
        name: /campeonato paulista de karate 2024/i,
      })
    ).toBeTruthy();
  });

  it("renders the date string and location string", () => {
    render(
      <ChampionshipsEventCard event={eventWithResults} isMostRecent={true} />
    );
    expect(screen.getByText("15/03/2024")).toBeTruthy();
    expect(screen.getByText("Ginásio do Ibirapuera, São Paulo")).toBeTruthy();
  });

  it("renders 'Finalizado' status badge with correct text", () => {
    render(
      <ChampionshipsEventCard event={eventWithResults} isMostRecent={true} />
    );
    expect(screen.getByText("Finalizado")).toBeTruthy();
    const badge = screen.getByText("Finalizado").closest(".bg-green-100");
    expect(badge).toBeTruthy();
  });

  it("renders year status badge with bg-slate-200 class", () => {
    render(
      <ChampionshipsEventCard event={eventWithYearStatus} isMostRecent={false} />
    );
    expect(screen.getByText("2023")).toBeTruthy();
    const badge = screen.getByText("2023").closest(".bg-slate-200");
    expect(badge).toBeTruthy();
  });

  it("renders gold, silver, bronze medal counts as numeric text", () => {
    render(
      <ChampionshipsEventCard event={eventWithResults} isMostRecent={true} />
    );
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("renders individual result rows with athlete name and placement text", () => {
    render(
      <ChampionshipsEventCard event={eventWithResults} isMostRecent={true} />
    );
    expect(screen.getByText("João Oliveira")).toBeTruthy();
    expect(screen.getByText("Mariana Costa")).toBeTruthy();
    const placementTexts = screen.getAllByText(/1º lugar/i);
    expect(placementTexts.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/kumite -75kg/i)).toBeTruthy();
    expect(screen.getByText(/kata individual/i)).toBeTruthy();
  });

  it("when results is empty, no result rows are rendered", () => {
    render(
      <ChampionshipsEventCard event={eventWithYearStatus} isMostRecent={false} />
    );
    expect(screen.queryByText(/resultados individuais/i)).toBeNull();
  });

  it("isMostRecent=true → timeline dot has bg-primary", () => {
    const { container } = render(
      <ChampionshipsEventCard event={eventWithResults} isMostRecent={true} />
    );
    const primaryDot = container.querySelector(".bg-primary.h-4.w-4");
    expect(primaryDot || container.querySelector(".bg-primary")).toBeTruthy();
  });

  it("isMostRecent=false → timeline dot has bg-slate-400", () => {
    const { container } = render(
      <ChampionshipsEventCard event={eventWithYearStatus} isMostRecent={false} />
    );
    const slateDot = container.querySelector(".bg-slate-400");
    expect(slateDot).toBeTruthy();
  });
});
