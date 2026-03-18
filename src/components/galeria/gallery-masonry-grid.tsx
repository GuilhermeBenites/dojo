"use client";

import { useState } from "react";
import type { GalleryCategory, GalleryImage } from "@/types/gallery";
import { GalleryFilterBar } from "./gallery-filter-bar";
import { GalleryItem } from "./gallery-item";
import { GalleryLightbox } from "./gallery-lightbox";

interface GalleryMasonryGridProps {
  images: GalleryImage[];
}

export function GalleryMasonryGrid({ images }: GalleryMasonryGridProps) {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("Todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Todos"
      ? images
      : images.filter((img) => img.category === activeCategory);

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
