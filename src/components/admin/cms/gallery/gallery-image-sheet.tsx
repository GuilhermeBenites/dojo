"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GalleryImageForm } from "./gallery-image-form";
import type { GalleryImageRow } from "@/types/database";

interface GalleryImageSheetProps {
  action?: string;
  id?: string;
  images: GalleryImageRow[];
}

function slugFromCategory(cat: string): string {
  const map: Record<string, string> = {
    "Sensei Luciano": "sensei-luciano",
    "Cerimônias de Faixa": "belt-ceremonies",
    "Aulas Infantis": "kids",
    Dojo: "dojo",
  };
  return map[cat] ?? cat;
}

function aspectFromDb(val: string): string {
  const map: Record<string, string> = {
    "1/1": "square",
    "3/4": "portrait",
    "16/9": "landscape",
    "4/3": "landscape",
    "9/16": "portrait",
  };
  return map[val] ?? "square";
}

export function GalleryImageSheet({
  action,
  id,
  images,
}: GalleryImageSheetProps) {
  const router = useRouter();
  const open = action === "new" || action === "edit";
  const image = id ? images.find((i) => i.id === id) : undefined;

  function handleClose() {
    router.push("/admin/content/gallery");
  }

  const initialData = image
    ? {
        ...image,
        category: slugFromCategory(image.category) as
          | "sensei-luciano"
          | "belt-ceremonies"
          | "kids"
          | "dojo",
        aspect_ratio: aspectFromDb(image.aspect_ratio) as
          | "square"
          | "portrait"
          | "landscape",
      }
    : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {action === "new" ? "Nova Imagem" : "Editar Imagem"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <GalleryImageForm image={initialData} onSuccess={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
