import { z } from "zod";

export const testimonialSchema = z.object({
  author: z.string().min(2, "Autor é obrigatório").max(100),
  role: z.string().min(2, "Função é obrigatória").max(100),
  quote: z.string().min(10, "Depoimento deve ter pelo menos 10 caracteres").max(500),
  display_order: z.coerce.number().int().min(0),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;
