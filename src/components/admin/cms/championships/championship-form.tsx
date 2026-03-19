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
  championshipSchema,
  type ChampionshipFormData,
} from "@/lib/validations/championship-schema";
import {
  createChampionshipAction,
  updateChampionshipAction,
} from "@/app/admin/actions/championships-actions";
import type { ChampionshipRow } from "@/types/database";

interface ChampionshipFormProps {
  championship?: ChampionshipRow;
  onSuccess: () => void;
}

export function ChampionshipForm({ championship, onSuccess }: ChampionshipFormProps) {
  const form = useForm<ChampionshipFormData>({
    resolver: zodResolver(championshipSchema),
    defaultValues: {
      name: championship?.name ?? "",
      event_date: championship?.event_date ?? "",
      location: championship?.location ?? "",
      status: championship?.status ?? "finalizado",
      gold: championship?.gold ?? 0,
      silver: championship?.silver ?? 0,
      bronze: championship?.bronze ?? 0,
      display_order: championship?.display_order ?? 0,
    },
  });

  async function onSubmit(values: ChampionshipFormData) {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) =>
      formData.set(k, String(v ?? ""))
    );

    const result = championship
      ? await updateChampionshipAction(championship.id, formData)
      : await createChampionshipAction(formData);

    if ("success" in result && result.success) {
      toast.success(
        championship ? "Campeonato atualizado" : "Campeonato criado"
      );
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="em-andamento">Em andamento</SelectItem>
                  <SelectItem value="futuro">Futuro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="gold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>🥇 Ouro</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="silver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>🥈 Prata</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bronze"
            render={({ field }) => (
              <FormItem>
                <FormLabel>🥉 Bronze</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
