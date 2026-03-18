import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/types/gallery";
import type { GalleryImageRow } from "@/types/database";

const ASPECT_CLASS: Record<string, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[16/9]",
  square: "aspect-square",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "16/9": "aspect-[16/9]",
  "9/16": "aspect-[9/16]",
};

const CATEGORY_DISPLAY: Record<string, GalleryImage["category"]> = {
  "sensei-luciano": "Sensei Luciano",
  "belt-ceremonies": "Cerimônias de Faixa",
  kids: "Aulas Infantis",
  dojo: "Dojo",
};

function toGalleryImage(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.title,
    title: row.title,
    category:
      CATEGORY_DISPLAY[row.category] ??
      (row.category as GalleryImage["category"]),
    aspectClass: ASPECT_CLASS[row.aspect_ratio] ?? "aspect-[4/3]",
  };
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order");

  if (error || !data?.length) {
    const { GALLERY_IMAGES } =
      await import("@/components/galeria/galeria-data");
    return GALLERY_IMAGES;
  }
  return data.map(toGalleryImage);
}
