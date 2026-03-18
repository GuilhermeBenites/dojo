import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { GalleryMasonryGrid } from "./gallery-masonry-grid";
import type { GalleryImage } from "@/types/gallery";

const MOCK_IMAGES: GalleryImage[] = [
  { id: "1", src: "/images/gallery/placeholder.jpg", alt: "Sensei Luciano em ação", title: "Sensei Luciano", category: "Sensei Luciano", aspectClass: "aspect-square" },
  { id: "2", src: "/images/gallery/placeholder.jpg", alt: "Vista do dojo", title: "Dojo principal", category: "Dojo", aspectClass: "aspect-square" },
  { id: "3", src: "/images/gallery/placeholder.jpg", alt: "Treino no dojo", title: "Treino noturno", category: "Dojo", aspectClass: "aspect-square" },
  { id: "4", src: "/images/gallery/placeholder.jpg", alt: "Estrutura do dojo", title: "Estrutura", category: "Dojo", aspectClass: "aspect-square" },
  { id: "5", src: "/images/gallery/placeholder.jpg", alt: "Cerimônia de faixa 1", title: "Graduação 2023", category: "Cerimônias de Faixa", aspectClass: "aspect-square" },
  { id: "6", src: "/images/gallery/placeholder.jpg", alt: "Cerimônia de faixa 2", title: "Graduação 2022", category: "Cerimônias de Faixa", aspectClass: "aspect-square" },
  { id: "7", src: "/images/gallery/placeholder.jpg", alt: "Sensei Luciano kata", title: "Kata especial", category: "Sensei Luciano", aspectClass: "aspect-square" },
  { id: "8", src: "/images/gallery/placeholder.jpg", alt: "Crianças em aula de karate", title: "Aulas Infantis", category: "Aulas Infantis", aspectClass: "aspect-square" },
];

describe("GalleryMasonryGrid", () => {
  afterEach(cleanup);

  it("renders all 8 images by default (no filter)", () => {
    render(<GalleryMasonryGrid images={MOCK_IMAGES} />);
    const items = screen.getAllByRole("img");
    expect(items).toHaveLength(8);
  });

  it("after clicking Aulas Infantis, only items with that category are visible", () => {
    const { container } = render(<GalleryMasonryGrid images={MOCK_IMAGES} />);
    fireEvent.click(
      screen.getByRole("button", { name: /mostrar aulas infantis/i })
    );
    const items = container.querySelectorAll(".masonry-item");
    expect(items).toHaveLength(1);
    expect(screen.getByAltText("Crianças em aula de karate")).toBeTruthy();
  });

  it("after clicking Todos, all items return", () => {
    const { container } = render(<GalleryMasonryGrid images={MOCK_IMAGES} />);
    fireEvent.click(
      screen.getByRole("button", { name: /mostrar aulas infantis/i })
    );
    fireEvent.click(screen.getByRole("button", { name: /mostrar todos/i }));
    const items = container.querySelectorAll(".masonry-item");
    expect(items).toHaveLength(8);
  });

  it("clicking an item zoom button opens the lightbox", async () => {
    const { container } = render(<GalleryMasonryGrid images={MOCK_IMAGES} />);
    const zoomButtons = screen.getAllByRole("button", { name: /ampliar/i });
    fireEvent.click(zoomButtons[0]);
    await waitFor(() => {
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog?.textContent).toContain("Sensei Luciano");
    });
  });
});
