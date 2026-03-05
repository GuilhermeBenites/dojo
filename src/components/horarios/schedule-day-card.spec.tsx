import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ScheduleDayCard } from "./schedule-day-card";
import type { DayGroup } from "@/types/schedule";

const primaryGroup: DayGroup = {
  id: "seg-qua-sex",
  label: "Segunda / Quarta / Sexta",
  category: "Infantil",
  slots: [
    { time: "16:00 - 17:00", sensei: "Sensei Anna Santos" },
    { time: "18:15 - 19:15", sensei: "Sensei Luciano dos Santos" },
  ],
  isPrimary: true,
};

const nonPrimaryGroup: DayGroup = {
  id: "ter-qui",
  label: "Terça / Quinta",
  category: "Infantil",
  slots: [{ time: "09:00 - 10:00", sensei: "Sensei Wynner Armoa" }],
  isPrimary: false,
};

describe("ScheduleDayCard", () => {
  afterEach(cleanup);

  it("renders day label as H3", () => {
    render(<ScheduleDayCard group={primaryGroup} />);
    expect(
      screen.getByRole("heading", { level: 3, name: /Segunda \/ Quarta \/ Sexta/i })
    ).toBeTruthy();
  });

  it("renders each time slot's time badge", () => {
    render(<ScheduleDayCard group={primaryGroup} />);
    expect(screen.getByText("16:00 - 17:00")).toBeTruthy();
    expect(screen.getByText("18:15 - 19:15")).toBeTruthy();
  });

  it("renders each sensei name", () => {
    render(<ScheduleDayCard group={primaryGroup} />);
    expect(screen.getByText("Sensei Anna Santos")).toBeTruthy();
    expect(screen.getByText("Sensei Luciano dos Santos")).toBeTruthy();
  });

  it("primary card has red accent class (bg-primary)", () => {
    const { container } = render(<ScheduleDayCard group={primaryGroup} />);
    const accentBar = container.querySelector('[class*="bg-primary"]');
    expect(accentBar).toBeTruthy();
  });

  it("non-primary card does NOT have bg-primary accent", () => {
    const { container } = render(<ScheduleDayCard group={nonPrimaryGroup} />);
    const article = container.querySelector("article");
    expect(article).toBeTruthy();
    const accentBar = article?.querySelector(".h-2");
    expect(accentBar?.className).toContain("bg-slate-800");
    expect(accentBar?.className).not.toContain("bg-primary");
  });
});
