import { z } from "zod";

export const senseiSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
    rank: z.string().min(2, "Graduação é obrigatória").max(100),
    specialty: z.string().max(200).optional(),
    bio: z.string().max(2000).optional(),
    quote: z.string().max(500).optional().or(z.literal("")),
    organization: z.string().max(200).optional().or(z.literal("")),
    photo_url: z.string().url("URL inválida").optional().or(z.literal("")),
    is_founder: z
      .union([z.string(), z.boolean()])
      .optional()
      .transform((v) => v === true || v === "on" || v === "true"),
    display_order: z.coerce.number().int().min(0),
  })
  .superRefine((data, ctx) => {
    if (data.is_founder) {
      if (!data.quote?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Citação é obrigatória para o fundador",
          path: ["quote"],
        });
      }
      if (!data.organization?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Organização é obrigatória para o fundador",
          path: ["organization"],
        });
      }
    }
  });

export type SenseiFormData = z.infer<typeof senseiSchema>;
