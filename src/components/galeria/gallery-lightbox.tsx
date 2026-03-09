"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/gallery";

interface GalleryLightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({
  image,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
      document.body.style.overflow = "";
    };

    if (image) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
      dialog.addEventListener("close", handleClose);
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  if (!image) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 m-0 h-screen w-screen max-h-none max-w-none border-0 bg-black/95 p-0 backdrop:bg-black/80"
      onClick={handleBackdropClick}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center p-4">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          autoFocus
          className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Prev button */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Imagem anterior"
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Próxima imagem"
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

        {/* Image container */}
        <div className="relative flex h-full w-full max-w-7xl mx-auto items-center justify-center">
          <Image
            fill
            src={image.src}
            alt={image.alt}
            className="object-contain"
            sizes="100vw"
          />
        </div>

        {/* Caption */}
        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {image.category}
          </span>
          <h2 id="lightbox-title" className="text-xl font-bold text-white">
            {image.title}
          </h2>
        </div>
      </div>
    </dialog>
  );
}
