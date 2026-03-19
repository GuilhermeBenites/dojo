"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  scheduleSchema,
  type ScheduleFormData,
} from "@/lib/validations/schedule-schema";
import {
  createScheduleAction,
  updateScheduleAction,
} from "@/app/admin/actions/schedules-actions";
import type { ScheduleRow } from "@/types/database";

interface ScheduleFormProps {
  schedule?: ScheduleRow;
  onSuccess: () => void;
}

export function ScheduleForm({ schedule, onSuccess }: ScheduleFormProps) {
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      day_group_id: schedule?.day_group_id ?? "",
      day_label: schedule?.day_label ?? "",
      time_start: schedule?.time_start ?? "08:00",
      time_end: schedule?.time_end ?? "09:00",
      category: schedule?.category ?? "infantil",
      instructor: schedule?.instructor ?? "",
      display_order: schedule?.display_order ?? 0,
    },
  });

  async function onSubmit(values: ScheduleFormData) {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) =>
      formData.set(k, String(v ?? ""))
    );

    const result = schedule
      ? await updateScheduleAction(schedule.id, formData)
      : await createScheduleAction(formData);

    if ("success" in result && result.success) {
      toast.success(schedule ? "Horário atualizado" : "Horário criado");
      onSuccess();
    } else {
      toast.error("error" in result ? result.error : "Erro");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="day_group_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do grupo (ex: seg-qua-sex)</FormLabel>
              <FormControl>
                <Input placeholder="seg-qua-sex" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="day_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rótulo dos dias</FormLabel>
              <FormControl>
                <Input placeholder="Seg / Qua / Sex" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="time_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Início</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fim</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="infantil">Infantil</SelectItem>
                  <SelectItem value="adultos">Adultos</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instrutor (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Sensei Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de exibição</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 pt-4">
          <Button type="submit">Salvar</Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
