import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { Footer } from "./footer";

const QUICK_LINKS = [
  { label: "Início", href: "/" },
  { label: "Senseis", href: "/senseis" },
  { label: "Horários", href: "/horarios" },
  { label: "Planos", href: "/planos" },
];

describe("Footer", () => {
  afterEach(cleanup);

  it("renders a <footer> element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).not.toBeNull();
  });

  it("renders the dojo brand name", () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: /dojo luciano dos santos/i })
    ).toBeTruthy();
  });

  it("renders the brand description", () => {
    render(<Footer />);
    expect(
      screen.getByText(/transformando vidas através do karate/i)
    ).toBeTruthy();
  });

  it('renders the "Links Rápidos" section heading', () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: /links rápidos/i })
    ).toBeTruthy();
  });

  it('renders the "Fale Conosco" section heading', () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: /fale conosco/i })
    ).toBeTruthy();
  });

  it.each(QUICK_LINKS)(
    'renders quick link "$label" with correct href "$href"',
    ({ label, href }) => {
      render(<Footer />);
      const link = screen.getByRole("link", { name: label });
      expect(link.getAttribute("href")).toBe(href);
    }
  );

  it("renders Instagram social icon with aria-label", () => {
    render(<Footer />);
    const instagram = screen.getByRole("link", { name: /instagram/i });
    expect(instagram.getAttribute("aria-label")).toBe("Instagram");
  });

  it("renders WhatsApp social icon with aria-label", () => {
    render(<Footer />);
    const whatsapp = screen.getByRole("link", { name: /whatsapp/i });
    expect(whatsapp.getAttribute("aria-label")).toBe("WhatsApp");
  });

  it('renders the "Agende sua aula" CTA link', () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /agende sua aula/i })
    ).toBeTruthy();
  });

  it("renders the copyright notice with year and dojo name", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 dojo luciano dos santos/i)
    ).toBeTruthy();
  });

  it("renders Privacidade legal link", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /privacidade/i })
    ).toBeTruthy();
  });

  it("renders Termos legal link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /termos/i })).toBeTruthy();
  });

  it("renders social SVG icons as aria-hidden", () => {
    const { container } = render(<Footer />);
    const hiddenSvgs = container.querySelectorAll("svg[aria-hidden]");
    expect(hiddenSvgs.length).toBeGreaterThan(0);
  });

  it("renders a 3-column grid section", () => {
    const { container } = render(<Footer />);
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
  });
});
