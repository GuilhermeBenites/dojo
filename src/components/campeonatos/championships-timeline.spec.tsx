import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ChampionshipsTimeline } from "./championships-timeline";
import { CHAMPIONSHIPS } from "./campeonatos-data";

describe("ChampionshipsTimeline", () => {
  afterEach(cleanup);

  it("renders exactly 2 event cards on initial mount", () => {
    render(<ChampionshipsTimeline events={CHAMPIONSHIPS} />);
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
    render(<ChampionshipsTimeline events={CHAMPIONSHIPS} />);
    expect(
      screen.getByRole("button", { name: /carregar mais resultados/i })
    ).toBeTruthy();
  });

  it("clicking the button reveals the third event card", () => {
    render(<ChampionshipsTimeline events={CHAMPIONSHIPS} />);
    fireEvent.click(
      screen.getByRole("button", { name: /carregar mais resultados/i })
    );
    expect(
      screen.getByRole("heading", { name: /open internacional/i })
    ).toBeTruthy();
  });

  it("after all events are visible, 'Carregar mais' button is no longer in the DOM", () => {
    render(<ChampionshipsTimeline events={CHAMPIONSHIPS} />);
    fireEvent.click(
      screen.getByRole("button", { name: /carregar mais resultados/i })
    );
    expect(
      screen.queryByRole("button", { name: /carregar mais resultados/i })
    ).toBeNull();
  });

  it("'Campeonato Paulista de Karate 2024' and 'Copa Brasil de Clubes' are visible initially", () => {
    render(<ChampionshipsTimeline events={CHAMPIONSHIPS} />);
    expect(
      screen.getByRole("heading", { name: /campeonato paulista de karate 2024/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /copa brasil de clubes/i })
    ).toBeTruthy();
  });

  it("'Open Internacional' is NOT visible initially", () => {
    render(<ChampionshipsTimeline events={CHAMPIONSHIPS} />);
    expect(
      screen.queryByRole("heading", { name: /open internacional/i })
    ).toBeNull();
  });
});
