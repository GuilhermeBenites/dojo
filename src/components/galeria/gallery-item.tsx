"use client";

import Image from "next/image";
import type { GalleryImage } from "@/types/gallery";

interface GalleryItemProps {
  image: GalleryImage;
  onOpen: (image: GalleryImage) => void;
}

export function GalleryItem({ image, onOpen }: GalleryItemProps) {
  return (
    <div className="masonry-item group relative cursor-pointer overflow-hidden rounded-xl shadow-lg" onClick={() => onOpen(image)}>
      <div className={image.aspectClass}>
        <Image
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          src={image.src}
          alt={image.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      {/* Hover overlay: gradient + category pill + title */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="mb-2 inline-block w-fit rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {image.category}
        </span>
        <h3 className="text-lg font-bold text-white">{image.title}</h3>
      </div>
      {/* Zoom button: slides in from top-right on hover */}
      <button
        type="button"
        aria-label={`Ampliar: ${image.title}`}
        onClick={(e) => { e.stopPropagation(); onOpen(image); }}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-dark opacity-0 shadow-lg transition-all duration-300 hover:bg-white group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
        </svg>
      </button>
    </div>
  );
}
