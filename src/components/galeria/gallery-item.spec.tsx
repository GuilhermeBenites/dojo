import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach, vi } from "vitest";
import { GalleryItem } from "./gallery-item";
import type { GalleryImage } from "@/types/gallery";

const mockImage: GalleryImage = {
  id: "gi-01",
  title: "Sensei Luciano",
  category: "Sensei Luciano",
  src: "/images/gallery/placeholder.jpg",
  alt: "Sensei Luciano em pose de karate",
  aspectClass: "aspect-[3/4]",
};

describe("GalleryItem", () => {
  afterEach(cleanup);

  it("renders the image with correct alt text", () => {
    const onOpen = vi.fn();
    render(<GalleryItem image={mockImage} onOpen={onOpen} />);
    const img = screen.getByAltText("Sensei Luciano em pose de karate");
    expect(img).toBeTruthy();
  });

  it("renders the title and category pill text", () => {
    const onOpen = vi.fn();
    render(<GalleryItem image={mockImage} onOpen={onOpen} />);
    const titleMatches = screen.getAllByText("Sensei Luciano");
    expect(titleMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("calls onOpen when the zoom button is clicked", () => {
    const onOpen = vi.fn();
    render(<GalleryItem image={mockImage} onOpen={onOpen} />);
    const zoomButton = screen.getByRole("button", {
      name: /ampliar: sensei luciano/i,
    });
    fireEvent.click(zoomButton);
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(mockImage);
  });
});
