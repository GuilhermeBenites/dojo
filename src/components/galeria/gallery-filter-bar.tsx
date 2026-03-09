"use client";

import type { GalleryCategory } from "@/types/gallery";
import { GALLERY_CATEGORIES } from "./galeria-data";

interface GalleryFilterBarProps {
  active: GalleryCategory;
  onChange: (cat: GalleryCategory) => void;
}

export function GalleryFilterBar({ active, onChange }: GalleryFilterBarProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar galeria por categoria"
      className="sticky top-[73px] z-40 flex flex-wrap justify-center gap-2 bg-background-light/95 py-4 backdrop-blur-sm dark:bg-background-dark/95"
    >
      {GALLERY_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
          aria-label={`Mostrar ${cat}`}
          className={
            active === cat
              ? "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-colors"
              : "rounded-full bg-white px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-neutral-dark ring-1 ring-neutral-200 transition-colors hover:bg-neutral-100 dark:bg-card dark:text-foreground dark:ring-border dark:hover:bg-muted"
          }
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
