"use client";

import Link from "next/link";
import { Images, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deleteGalleryImageAction } from "@/app/admin/actions/gallery-actions";
import type { GalleryImageRow } from "@/types/database";

const CATEGORY_LABELS: Record<string, string> = {
  "Sensei Luciano": "Sensei Luciano",
  "Cerimônias de Faixa": "Cerimônias de Faixa",
  "Aulas Infantis": "Aulas Infantis",
  Dojo: "Dojo",
  "sensei-luciano": "Sensei Luciano",
  "belt-ceremonies": "Cerimônias de Faixa",
  kids: "Aulas Infantis",
  dojo: "Dojo",
};

interface GalleryAdminGridProps {
  images: GalleryImageRow[];
}

export function GalleryAdminGrid({ images }: GalleryAdminGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Images className="size-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhuma imagem cadastrada</p>
        <Link href="/admin/content/gallery?action=new">
          <Button variant="outline" size="sm" className="mt-4">
            Criar primeiro
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="group relative overflow-hidden rounded-lg border"
        >
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={img.image_url}
              alt={img.title}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-transparent p-2 opacity-0 transition group-hover:opacity-100">
            <div className="flex justify-end gap-1">
              <Link href={`/admin/content/gallery?action=edit&id=${img.id}`}>
                <Button variant="secondary" size="icon-sm">
                  <Pencil className="size-4" />
                </Button>
              </Link>
              <DeleteConfirmDialog
                trigger={
                  <Button variant="destructive" size="icon-sm">
                    <Trash2 className="size-4" />
                  </Button>
                }
                title="Excluir imagem"
                description="Tem certeza? Esta ação não pode ser desfeita."
                action={() => deleteGalleryImageAction(img.id)}
              />
            </div>
            <div>
              <p className="font-medium text-white truncate">{img.title}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {CATEGORY_LABELS[img.category] ?? img.category}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
