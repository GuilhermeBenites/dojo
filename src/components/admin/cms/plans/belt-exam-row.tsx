"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  beltExamSchema,
  type BeltExamFormData,
} from "@/lib/validations/plan-schema";
import { updateBeltExamAction } from "@/app/admin/actions/plans-actions";
import type { BeltExamRow } from "@/types/database";

interface BeltExamRowProps {
  exam: BeltExamRow;
}

export function BeltExamRow({ exam }: BeltExamRowProps) {
  const [saving, setSaving] = useState(false);
  const form = useForm<BeltExamFormData>({
    resolver: zodResolver(beltExamSchema),
    defaultValues: {
      belt: exam.belt,
      price: exam.price,
      family_price: exam.family_price,
      highlighted: exam.highlighted,
      display_order: exam.display_order,
    },
  });

  async function onSubmit(values: BeltExamFormData) {
    setSaving(true);
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      formData.set(k, typeof v === "boolean" ? (v ? "on" : "off") : String(v));
    });

    const result = await updateBeltExamAction(exam.id, formData);

    if ("success" in result && result.success) {
      toast.success("Exame atualizado");
    } else {
      toast.error("error" in result ? result.error : "Erro");
    }
    setSaving(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap items-end gap-4 rounded-lg border p-4"
      >
        <FormField
          control={form.control}
          name="belt"
          render={({ field }) => (
            <FormItem className="min-w-[140px]">
              <FormLabel>Faixa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="min-w-[120px]">
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="family_price"
          render={({ field }) => (
            <FormItem className="min-w-[140px]">
              <FormLabel>Preço família</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="highlighted"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>Destaque</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={saving}>
          <Check className="size-4" />
        </Button>
      </form>
    </Form>
  );
}
