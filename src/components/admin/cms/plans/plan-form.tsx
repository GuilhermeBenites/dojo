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
import { Switch } from "@/components/ui/switch";
import { PlanTiersEditor } from "./plan-tiers-editor";
import {
  planSchema,
  type PlanFormData,
} from "@/lib/validations/plan-schema";
import {
  createPlanAction,
  updatePlanAction,
} from "@/app/admin/actions/plans-actions";
import type { PlanRow } from "@/types/database";

interface PlanFormProps {
  plan?: PlanRow;
  onSuccess: () => void;
}

export function PlanForm({ plan, onSuccess }: PlanFormProps) {
  const defaultTiers = plan?.tiers ?? [
    { label: "Mensal", price: "", isMonthlyHighlight: true },
  ];
  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      plan_key: plan?.plan_key ?? "",
      title: plan?.title ?? "",
      subtitle: plan?.subtitle ?? "",
      recommended: plan?.recommended ?? false,
      tiers: JSON.stringify(defaultTiers),
      display_order: plan?.display_order ?? 0,
    } as unknown as PlanFormData,
  });

  async function onSubmit(values: PlanFormData) {
    const formData = new FormData();
    formData.set("plan_key", values.plan_key);
    formData.set("title", values.title);
    formData.set("subtitle", values.subtitle ?? "");
    formData.set("recommended", values.recommended ? "on" : "off");
    formData.set(
      "tiers",
      typeof values.tiers === "string" ? values.tiers : JSON.stringify(values.tiers ?? [])
    );
    formData.set("display_order", String(values.display_order));

    const result = plan
      ? await updatePlanAction(plan.id, formData)
      : await createPlanAction(formData);

    if ("success" in result && result.success) {
      toast.success(plan ? "Plano atualizado" : "Plano criado");
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
          name="plan_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave (ex: tres-vezes)</FormLabel>
              <FormControl>
                <Input placeholder="tres-vezes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtítulo (opcional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recommended"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel>Recomendado</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tiers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiers de preço</FormLabel>
              <FormControl>
                <PlanTiersEditor
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : JSON.stringify(field.value ?? [])
                  }
                  onChange={(v) => field.onChange(v)}
                />
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
              <FormLabel>Ordem</FormLabel>
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
