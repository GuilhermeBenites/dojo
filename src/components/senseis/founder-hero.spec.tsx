import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { FounderHero } from "./founder-hero";
import { FOUNDER } from "./senseis-data";

describe("FounderHero", () => {
  afterEach(cleanup);

  it("renders a <section> element", () => {
    const { container } = render(<FounderHero founder={FOUNDER} />);
    expect(container.querySelector("section")).not.toBeNull();
  });

  it('renders the badge "Mestre & Fundador"', () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(screen.getByText(/mestre & fundador/i)).toBeTruthy();
  });

  it("renders founder name as H2", () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /sensei luciano dos santos/i,
      })
    ).toBeTruthy();
  });

  it("renders rank text in image overlay", () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(screen.getByText(/faixa preta 5º dan/i)).toBeTruthy();
  });

  it("renders organization text", () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(
      screen.getByText(/shotokan karate international/i)
    ).toBeTruthy();
  });

  it("renders both bio paragraphs", () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(screen.getByText(/25 anos de dedicação/i)).toBeTruthy();
    expect(screen.getByText(/filosofia de ensino/i)).toBeTruthy();
  });

  it("renders the blockquote with the quote text", () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(screen.getByRole("blockquote")).toBeTruthy();
    expect(screen.getByText(/verdadeiro oponente/i)).toBeTruthy();
  });

  it('renders "— Sensei Luciano" attribution', () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(screen.getByText(/— sensei luciano/i)).toBeTruthy();
  });

  it('renders "Conheça a História Completa" CTA link', () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(
      screen.getByRole("link", { name: /conheça a história completa/i })
    ).toBeTruthy();
  });

  it('renders "Fale com o Mestre" link', () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(
      screen.getByRole("link", { name: /fale com o mestre/i })
    ).toBeTruthy();
  });

  it("founder image has correct alt text", () => {
    render(<FounderHero founder={FOUNDER} />);
    expect(
      screen.getByRole("img", {
        name: /sensei luciano wearing a white karate gi/i,
      })
    ).toBeTruthy();
  });
});
