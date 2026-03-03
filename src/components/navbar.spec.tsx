import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Navbar } from "./navbar";

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (v: boolean) => void;
  }) => (
    <div data-testid="sheet" data-state={open ? "open" : "closed"}>
      {children}
    </div>
  ),
  SheetContent: ({
    children,
    side,
    className,
  }: {
    children: React.ReactNode;
    side?: string;
    className?: string;
  }) => (
    <div data-testid="sheet-content" data-side={side} className={className}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  SheetTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <>{children}</>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className,
    "aria-label": ariaLabel,
    variant: _variant,
    size: _size,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: string;
    size?: string;
    asChild?: boolean;
  }) => (
    <button className={className} aria-label={ariaLabel} {...rest}>
      {children}
    </button>
  ),
}));

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Senseis", href: "/senseis" },
  { label: "Horários", href: "/horarios" },
  { label: "Galeria", href: "/galeria" },
  { label: "Campeonatos", href: "/campeonatos" },
  { label: "Planos", href: "/planos" },
];

describe("Navbar", () => {
  afterEach(cleanup);

  it("renders a <nav> element", () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector("nav")).not.toBeNull();
  });

  it("renders the dojo name in the logo", () => {
    render(<Navbar />);
    expect(screen.getByText("Dojo Luciano dos Santos")).toBeTruthy();
  });

  it("logo is a link pointing to /", () => {
    render(<Navbar />);
    // The logo <Link href="/"> wraps an h2 with the dojo name
    const heading = screen.getByRole("heading", {
      name: /dojo luciano dos santos/i,
    });
    const link = heading.closest("a");
    expect(link?.getAttribute("href")).toBe("/");
  });

  it.each(NAV_LINKS)(
    'renders nav link "$label" pointing to "$href"',
    ({ label, href }) => {
      render(<Navbar />);
      // Links appear in both desktop nav and mobile sheet — check any
      const links = screen.getAllByRole("link", { name: label });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0].getAttribute("href")).toBe(href);
    },
  );

  it("renders the CTA label in at least one link", () => {
    render(<Navbar />);
    const ctaLinks = screen.getAllByRole("link", {
      name: /agende aula grátis/i,
    });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the mobile menu trigger button with aria-label", () => {
    render(<Navbar />);
    const trigger = screen.getByRole("button", { name: /abrir menu/i });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-label")).toBe("Abrir menu");
  });

  it("nav has sticky positioning class", () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("sticky");
  });

  it("nav has z-50 class for stacking context", () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("z-50");
  });

  it("mobile sheet content contains all nav links", () => {
    render(<Navbar />);
    const sheetContent = screen.getByTestId("sheet-content");
    NAV_LINKS.forEach(({ label }) => {
      const link = Array.from(sheetContent.querySelectorAll("a")).find(
        (a) => a.textContent?.trim() === label,
      );
      expect(link, `Expected "${label}" link in sheet content`).toBeTruthy();
    });
  });

  it("sheet is closed by default", () => {
    render(<Navbar />);
    expect(screen.getByTestId("sheet").getAttribute("data-state")).toBe(
      "closed",
    );
  });
});
