import { z } from "zod";

const tierSchema = z.object({
  label: z.string(),
  price: z.string(),
  isMonthlyHighlight: z.boolean(),
  suffix: z.string().optional(),
});

export const planSchema = z.object({
  plan_key: z
    .string()
    .min(1, "Chave do plano é obrigatória")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens"),
  title: z.string().min(1, "Título é obrigatório").max(100),
  subtitle: z.string().max(200).optional(),
  recommended: z
    .string()
    .optional()
    .transform((v) => v === "on" || v === "true"),
  tiers: z.string().transform((val) => {
    try {
      const parsed = JSON.parse(val) as unknown;
      return z.array(tierSchema).parse(parsed);
    } catch {
      throw new Error("Formato de tiers inválido");
    }
  }),
  display_order: z.coerce.number().int().min(0),
});

export const beltExamSchema = z.object({
  belt: z.string().min(1, "Faixa é obrigatória"),
  price: z.string().min(1, "Preço é obrigatório"),
  family_price: z.string().min(1, "Preço família é obrigatório"),
  highlighted: z
    .string()
    .optional()
    .transform((v) => v === "on" || v === "true"),
  display_order: z.coerce.number().int().min(0),
});

export const dropInSchema = z.object({
  label: z.string().min(1, "Rótulo é obrigatório").max(100),
  price: z.string().min(1, "Preço é obrigatório"),
  display_order: z.coerce.number().int().min(0),
});

export const faqSchema = z.object({
  question: z.string().min(5, "Pergunta deve ter pelo menos 5 caracteres").max(300),
  answer: z.string().min(10, "Resposta deve ter pelo menos 10 caracteres").max(2000),
  display_order: z.coerce.number().int().min(0),
});

export type PlanFormData = z.infer<typeof planSchema>;
export type BeltExamFormData = z.infer<typeof beltExamSchema>;
export type DropInFormData = z.infer<typeof dropInSchema>;
export type FaqFormData = z.infer<typeof faqSchema>;
