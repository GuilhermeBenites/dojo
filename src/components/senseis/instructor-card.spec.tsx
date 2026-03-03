import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { InstructorCard } from "./instructor-card";
import type { Sensei } from "@/types/sensei";

const mockSensei: Sensei = {
  id: "anna-santos",
  name: "Sensei Anna Santos",
  rank: "3º Dan - Especialista Pedagógica",
  specialty: "Infantil",
  bio: "Com formação em Educação Física...",
  photoUrl: "https://example.com/anna.jpg",
  photoAlt: "Portrait of Sensei Anna",
  profileHref: "/senseis/anna-santos",
};

describe("InstructorCard", () => {
  afterEach(cleanup);

  it("renders an <article> element", () => {
    const { container } = render(<InstructorCard sensei={mockSensei} />);
    expect(container.querySelector("article")).not.toBeNull();
  });

  it("renders sensei name as H3", () => {
    render(<InstructorCard sensei={mockSensei} />);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Sensei Anna Santos",
      })
    ).toBeTruthy();
  });

  it("renders rank text with primary color class", () => {
    render(<InstructorCard sensei={mockSensei} />);
    const rankEl = screen.getByText("3º Dan - Especialista Pedagógica");
    expect(rankEl).toBeTruthy();
    expect(rankEl.className).toMatch(/text-primary/);
  });

  it("renders specialty badge", () => {
    render(<InstructorCard sensei={mockSensei} />);
    expect(screen.getByText("Infantil")).toBeTruthy();
  });

  it("renders bio text", () => {
    render(<InstructorCard sensei={mockSensei} />);
    expect(
      screen.getByText(/com formação em educação física/i)
    ).toBeTruthy();
  });

  it('renders "Ver Perfil" link with correct href', () => {
    render(<InstructorCard sensei={mockSensei} />);
    const link = screen.getByRole("link", { name: /ver perfil/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/senseis/anna-santos");
  });

  it("image has correct alt text", () => {
    render(<InstructorCard sensei={mockSensei} />);
    expect(
      screen.getByRole("img", { name: "Portrait of Sensei Anna" })
    ).toBeTruthy();
  });

  it("image src is set correctly", () => {
    const { container } = render(<InstructorCard sensei={mockSensei} />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toContain("example.com/anna.jpg");
  });
});
