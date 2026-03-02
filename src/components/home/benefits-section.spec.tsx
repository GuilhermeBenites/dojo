import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { BenefitsSection } from "./benefits-section";

describe("BenefitsSection", () => {
  afterEach(cleanup);

  it("renders the section with id 'sobre'", () => {
    const { container } = render(<BenefitsSection />);
    expect(container.querySelector("#sobre")).not.toBeNull();
  });

  it("renders the main heading", () => {
    render(<BenefitsSection />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /por que treinar conosco/i,
      })
    ).toBeTruthy();
  });

  it("renders the intro description", () => {
    render(<BenefitsSection />);
    expect(screen.getByText(/Oferecemos um ambiente seguro/i)).toBeTruthy();
  });

  it("renders the link to /senseis", () => {
    render(<BenefitsSection />);
    const link = screen.getByRole("link", {
      name: /saiba mais sobre a metodologia/i,
    });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/senseis");
  });

  it("renders 3 benefit cards", () => {
    render(<BenefitsSection />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });

  it.each([
    [
      "Mestres Certificados",
      /Instrutores com anos de experiência e reconhecimento internacional/i,
    ],
    [
      "Ambiente Familiar",
      /Aulas para crianças, adultos e famílias inteiras treinarem juntas/i,
    ],
    [
      "Defesa Pessoal",
      /Técnicas eficientes para aumentar sua confiança e segurança/i,
    ],
  ])('renders benefit card "%s" with its description', (title, description) => {
    render(<BenefitsSection />);
    expect(
      screen.getByRole("heading", { level: 3, name: title })
    ).toBeTruthy();
    expect(screen.getByText(description)).toBeTruthy();
  });

  it("renders icons as aria-hidden", () => {
    const { container } = render(<BenefitsSection />);
    const icons = container.querySelectorAll("svg[aria-hidden]");
    expect(icons.length).toBeGreaterThan(0);
  });
});
