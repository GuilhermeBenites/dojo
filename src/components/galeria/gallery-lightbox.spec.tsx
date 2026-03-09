import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { GalleryLightbox } from "./gallery-lightbox";
import type { GalleryImage } from "@/types/gallery";

const mockImage: GalleryImage = {
  id: "gi-01",
  title: "Sensei Luciano",
  category: "Sensei Luciano",
  src: "/images/gallery/placeholder.jpg",
  alt: "Sensei Luciano em pose de karate",
  aspectClass: "aspect-[3/4]",
};

describe("GalleryLightbox", () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(cleanup);

  it("returns null / is not in the DOM when image is null", () => {
    const { container } = render(
      <GalleryLightbox
        image={null}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("renders the image title when image is provided", () => {
    render(
      <GalleryLightbox
        image={mockImage}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    expect(
      screen.getByRole("heading", { name: "Sensei Luciano", hidden: true })
    ).toBeTruthy();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <GalleryLightbox
        image={mockImage}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    const closeButton = screen.getByRole("button", {
      name: /fechar/i,
      hidden: true,
    });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <GalleryLightbox
        image={mockImage}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onPrev when prev button is clicked", () => {
    const onPrev = vi.fn();
    render(
      <GalleryLightbox
        image={mockImage}
        onClose={vi.fn()}
        onPrev={onPrev}
        onNext={vi.fn()}
      />
    );
    const dialog = screen.getByRole("dialog", { hidden: true });
    const prevButton = within(dialog).getByRole("button", {
      name: /imagem anterior/i,
      hidden: true,
    });
    fireEvent.click(prevButton);
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    const onNext = vi.fn();
    render(
      <GalleryLightbox
        image={mockImage}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={onNext}
      />
    );
    const nextButton = screen.getByRole("button", {
      name: /pr[oó]xima imagem/i,
      hidden: true,
    });
    fireEvent.click(nextButton);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
