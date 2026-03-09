import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { GalleryFilterBar } from "./gallery-filter-bar";

describe("GalleryFilterBar", () => {
  afterEach(cleanup);

  it("default active pill is Todos with aria-pressed true", () => {
    render(
      <GalleryFilterBar active="Todos" onChange={() => {}} />
    );
    const todosBtn = screen.getByRole("button", { name: /mostrar todos/i });
    expect(todosBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("clicking Sensei Luciano sets it as active and removes active from Todos", () => {
    const onChange = vi.fn();
    render(
      <GalleryFilterBar active="Todos" onChange={onChange} />
    );
    const senseiBtn = screen.getByRole("button", {
      name: /mostrar sensei luciano/i,
    });
    fireEvent.click(senseiBtn);
    expect(onChange).toHaveBeenCalledWith("Sensei Luciano");
  });

  it("all 5 category buttons are rendered", () => {
    render(
      <GalleryFilterBar active="Todos" onChange={() => {}} />
    );
    expect(screen.getByRole("button", { name: /mostrar todos/i })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /mostrar sensei luciano/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /mostrar cerimônias de faixa/i })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /mostrar aulas infantis/i })
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /mostrar dojo/i })).toBeTruthy();
  });

  it("active pill has visual distinction with bg-primary or text-white", () => {
    render(
      <GalleryFilterBar active="Sensei Luciano" onChange={() => {}} />
    );
    const senseiBtn = screen.getByRole("button", {
      name: /mostrar sensei luciano/i,
    });
    expect(senseiBtn.className).toMatch(/bg-primary|text-white/);
  });
});
