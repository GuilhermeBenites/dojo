import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GalleryAdminGrid } from "@/components/admin/cms/gallery/gallery-admin-grid";
import { GalleryImageSheet } from "@/components/admin/cms/gallery/gallery-image-sheet";

export const metadata: Metadata = {
  title: "Galeria | Admin Dojo",
};

interface PageProps {
  searchParams: Promise<{ action?: string; id?: string }>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order");

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content" label="Conteúdo" />
      <CmsPageHeader
        title="Galeria"
        description="Fotos do dojo"
        action={
          <Link href="/admin/content/gallery?action=new">
            <Button size="sm">
              <Plus className="size-4" />
              Nova Imagem
            </Button>
          </Link>
        }
      />
      <GalleryAdminGrid images={images ?? []} />
      <GalleryImageSheet
        action={params.action}
        id={params.id}
        images={images ?? []}
      />
    </div>
  );
}
