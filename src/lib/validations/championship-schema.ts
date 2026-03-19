import { z } from "zod";

export const championshipSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório").max(200),
  event_date: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Data inválida (use AAAA-MM-DD)"
  ),
  location: z.string().min(2, "Local é obrigatório").max(200),
  status: z.enum(["finalizado", "em-andamento", "futuro"]),
  gold: z.coerce.number().int().min(0),
  silver: z.coerce.number().int().min(0),
  bronze: z.coerce.number().int().min(0),
  display_order: z.coerce.number().int().min(0),
});

export const championshipResultSchema = z.object({
  championship_id: z.string().uuid(),
  athlete_name: z.string().min(2, "Nome é obrigatório").max(100),
  placement: z.coerce.number().int().min(1).max(3),
  category: z.string().min(1, "Categoria é obrigatória").max(100),
});

export type ChampionshipFormData = z.infer<typeof championshipSchema>;
export type ChampionshipResultFormData = z.infer<typeof championshipResultSchema>;
