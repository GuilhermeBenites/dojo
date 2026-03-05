import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { LocationCard } from "./location-card";
import type { Location } from "@/types/schedule";

const LOCATION: Location = {
  address: "Rua das Artes Marciais, 123",
  phone: "(11) 91234-5678",
  mapsHref: "https://maps.google.com/test",
};

describe("LocationCard", () => {
  afterEach(cleanup);

  it("renders H2 heading", () => {
    render(<LocationCard location={LOCATION} />);
    expect(
      screen.getByRole("heading", { level: 2, name: /onde treinamos/i }),
    ).toBeTruthy();
  });

  it("renders address text", () => {
    render(<LocationCard location={LOCATION} />);
    expect(screen.getByText(/Rua das Artes Marciais/i)).toBeTruthy();
  });

  it("renders phone number", () => {
    render(<LocationCard location={LOCATION} />);
    expect(screen.getByText("(11) 91234-5678")).toBeTruthy();
  });

  it("Como Chegar link has correct href and external target", () => {
    render(<LocationCard location={LOCATION} />);
    const link = screen.getByRole("link", { name: /como chegar/i });
    expect(link.getAttribute("href")).toBe("https://maps.google.com/test");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
