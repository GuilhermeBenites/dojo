import { z } from "zod";

export const gallerySchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  category: z.enum([
    "sensei-luciano",
    "belt-ceremonies",
    "kids",
    "dojo",
  ]),
  image_url: z.string().url("URL da imagem é obrigatória"),
  aspect_ratio: z
    .enum(["square", "portrait", "landscape"])
    .default("square"),
  display_order: z.coerce.number().int().min(0),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;
