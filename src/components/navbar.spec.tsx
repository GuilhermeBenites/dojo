import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { Navbar } from "./navbar";

// Hoisted so the mock factories below can close over these mutable refs.
const sheetRef = vi.hoisted(() => ({
  onOpenChange: undefined as ((v: boolean) => void) | undefined,
}));
const mockPathname = vi.hoisted(() => ({ value: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname.value,
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (v: boolean) => void;
  }) => {
    sheetRef.onOpenChange = onOpenChange;
    return (
      <div data-testid="sheet" data-state={open ? "open" : "closed"}>
        {children}
      </div>
    );
  },
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
  }) => <div onClick={() => sheetRef.onOpenChange?.(true)}>{children}</div>,
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

describe("Navbar — mobile menu interaction", () => {
  beforeEach(() => {
    mockPathname.value = "/";
  });
  afterEach(cleanup);

  it("clicking the hamburger button opens the mobile sheet", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));
    expect(screen.getByTestId("sheet").getAttribute("data-state")).toBe("open");
  });

  it("clicking a mobile nav link closes the sheet (line 106)", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));
    expect(screen.getByTestId("sheet").getAttribute("data-state")).toBe("open");

    const sheetContent = screen.getByTestId("sheet-content");
    const senseiLink = Array.from(sheetContent.querySelectorAll("a")).find(
      (a) => a.textContent?.trim() === "Senseis",
    )!;
    fireEvent.click(senseiLink);

    expect(screen.getByTestId("sheet").getAttribute("data-state")).toBe(
      "closed",
    );
  });

  it("clicking the mobile CTA link closes the sheet (line 120)", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /abrir menu/i }));
    expect(screen.getByTestId("sheet").getAttribute("data-state")).toBe("open");

    const sheetContent = screen.getByTestId("sheet-content");
    const ctaLink = Array.from(sheetContent.querySelectorAll("a")).find(
      (a) => a.textContent?.trim() === "Agende Aula Grátis",
    )!;
    fireEvent.click(ctaLink);

    expect(screen.getByTestId("sheet").getAttribute("data-state")).toBe(
      "closed",
    );
  });

  it("active mobile nav link has text-primary and font-bold classes", () => {
    mockPathname.value = "/senseis";
    render(<Navbar />);

    const sheetContent = screen.getByTestId("sheet-content");
    const senseiLink = Array.from(sheetContent.querySelectorAll("a")).find(
      (a) => a.textContent?.trim() === "Senseis",
    )!;

    expect(senseiLink.className).toContain("text-primary");
    expect(senseiLink.className).toContain("font-bold");
  });

  it("inactive mobile nav link has text-slate-700 class (line 111)", () => {
    mockPathname.value = "/senseis";
    render(<Navbar />);

    const sheetContent = screen.getByTestId("sheet-content");
    const horariosLink = Array.from(sheetContent.querySelectorAll("a")).find(
      (a) => a.textContent?.trim() === "Horários",
    )!;

    expect(horariosLink.className).toContain("text-slate-700");
  });
});
