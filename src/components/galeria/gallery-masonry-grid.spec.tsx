import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { GalleryMasonryGrid } from "./gallery-masonry-grid";

describe("GalleryMasonryGrid", () => {
  afterEach(cleanup);

  it("renders all 8 images by default (no filter)", () => {
    render(<GalleryMasonryGrid />);
    const items = screen.getAllByRole("img");
    expect(items).toHaveLength(8);
  });

  it("after clicking Aulas Infantis, only items with that category are visible", () => {
    const { container } = render(<GalleryMasonryGrid />);
    fireEvent.click(
      screen.getByRole("button", { name: /mostrar aulas infantis/i })
    );
    const items = container.querySelectorAll(".masonry-item");
    expect(items).toHaveLength(1);
    expect(screen.getByAltText("Crianças em aula de karate")).toBeTruthy();
  });

  it("after clicking Todos, all items return", () => {
    const { container } = render(<GalleryMasonryGrid />);
    fireEvent.click(
      screen.getByRole("button", { name: /mostrar aulas infantis/i })
    );
    fireEvent.click(screen.getByRole("button", { name: /mostrar todos/i }));
    const items = container.querySelectorAll(".masonry-item");
    expect(items).toHaveLength(8);
  });

  it("clicking an item zoom button opens the lightbox", async () => {
    const { container } = render(<GalleryMasonryGrid />);
    const zoomButtons = screen.getAllByRole("button", { name: /ampliar/i });
    fireEvent.click(zoomButtons[0]);
    await waitFor(() => {
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog?.textContent).toContain("Sensei Luciano");
    });
  });
});
