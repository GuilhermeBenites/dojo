"use client";

import { useState } from "react";
import type { GalleryCategory } from "@/types/gallery";
import { GALLERY_IMAGES } from "./galeria-data";
import { GalleryFilterBar } from "./gallery-filter-bar";
import { GalleryItem } from "./gallery-item";
import { GalleryLightbox } from "./gallery-lightbox";

export function GalleryMasonryGrid() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("Todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Todos"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const currentImage =
    lightboxIndex !== null ? filtered[lightboxIndex] ?? null : null;

  return (
    <>
      <GalleryFilterBar active={activeCategory} onChange={setActiveCategory} />
      <div className="masonry-grid mt-6">
        {filtered.map((img, i) => (
          <GalleryItem
            key={img.id}
            image={img}
            onOpen={() => setLightboxIndex(i)}
          />
        ))}
      </div>
      <GalleryLightbox
        image={currentImage}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((i) =>
            i !== null && i > 0 ? i - 1 : i
          )
        }
        onNext={() =>
          setLightboxIndex((i) =>
            i !== null && i < filtered.length - 1 ? i + 1 : i
          )
        }
      />
    </>
  );
}
