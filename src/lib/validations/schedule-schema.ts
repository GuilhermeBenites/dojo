import { z } from "zod";

export const scheduleSchema = z.object({
  day_group_id: z.string().min(1, "ID do grupo de dias é obrigatório"),
  day_label: z.string().min(1, "Rótulo dos dias é obrigatório"),
  time_start: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (use HH:MM)"),
  time_end: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (use HH:MM)"),
  category: z.enum(["infantil", "adultos"]),
  instructor: z.string().optional(),
  display_order: z.coerce.number().int().min(0),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
