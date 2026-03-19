import { z } from "zod";

const BELT_VALUES = [
  "branca",
  "amarela",
  "laranja",
  "verde",
  "azul",
  "roxa",
  "marrom",
  "preta-1",
  "preta-2",
  "preta-3",
] as const;

export const studentSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  belt: z.enum(BELT_VALUES, { message: "Selecione uma faixa" }),
  plan_id: z.string().uuid("Plano inválido").optional().or(z.literal("")),
  enrollment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (YYYY-MM-DD)"),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .optional()
    .or(z.literal("")),
  active: z.coerce.boolean(),
  notes: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
