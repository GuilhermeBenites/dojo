import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ScheduleFilter } from "./schedule-filter";
import { SCHEDULE_GROUPS } from "./horarios-data";

describe("ScheduleFilter", () => {
  afterEach(cleanup);

  it("default active tab is Infantil", () => {
    render(<ScheduleFilter groups={SCHEDULE_GROUPS} />);
    const infantilTab = screen.getByRole("button", { name: /ver horários infantil|^infantil$/i });
    expect(infantilTab.getAttribute("aria-pressed")).toBe("true");
  });

  it("clicking Adultos tab shows only Adultos groups", () => {
    render(<ScheduleFilter groups={SCHEDULE_GROUPS} />);
    fireEvent.click(screen.getByRole("button", { name: /ver horários adultos|^adultos$/i }));
    const adultosTab = screen.getByRole("button", { name: /ver horários adultos|^adultos$/i });
    expect(adultosTab.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("06:30 - 07:30")).toBeTruthy();
    expect(screen.getAllByText("19:30 - 21:00").length).toBeGreaterThan(0);
    expect(screen.queryByText("16:00 - 17:00")).toBeNull();
  });

  it("clicking Infantil tab back shows only Infantil groups", () => {
    render(<ScheduleFilter groups={SCHEDULE_GROUPS} />);
    fireEvent.click(screen.getByRole("button", { name: /ver horários adultos|^adultos$/i }));
    fireEvent.click(screen.getByRole("button", { name: /ver horários infantil|^infantil$/i }));
    const infantilTab = screen.getByRole("button", { name: /ver horários infantil|^infantil$/i });
    expect(infantilTab.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getAllByText("16:00 - 17:00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sensei Anna Santos").length).toBeGreaterThan(0);
  });

  it("active tab has visual distinction", () => {
    render(<ScheduleFilter groups={SCHEDULE_GROUPS} />);
    const infantTab = screen.getByRole("button", { name: /ver horários infantil|^infantil$/i });
    expect(infantTab.className).toMatch(/text-primary|bg-white|shadow/);
  });
});
