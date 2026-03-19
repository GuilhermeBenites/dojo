import { z } from "zod";

export const senseiSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  rank: z.string().min(2, "Graduação é obrigatória").max(100),
  specialty: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  quote: z.string().max(500).optional(),
  organization: z.string().max(200).optional(),
  photo_url: z.string().url("URL inválida").optional().or(z.literal("")),
  is_founder: z
    .string()
    .optional()
    .transform((v) => v === "on" || v === "true"),
  display_order: z.coerce.number().int().min(0),
});

export type SenseiFormData = z.infer<typeof senseiSchema>;
