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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  dropInSchema,
  type DropInFormData,
} from "@/lib/validations/plan-schema";
import { updateDropInAction } from "@/app/admin/actions/plans-actions";
import type { DropInClassRow } from "@/types/database";

interface DropInTabProps {
  dropIn: DropInClassRow[];
}

export function DropInTab({ dropIn }: DropInTabProps) {
  if (dropIn.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        Nenhuma aula avulsa cadastrada
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {dropIn.map((item) => (
        <DropInRow key={item.id} item={item} />
      ))}
    </div>
  );
}

function DropInRow({ item }: { item: DropInClassRow }) {
  const form = useForm<DropInFormData>({
    resolver: zodResolver(dropInSchema),
    defaultValues: {
      label: item.label,
      price: item.price,
      display_order: item.display_order,
    },
  });

  async function onSubmit(values: DropInFormData) {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.set(k, String(v)));

    const result = await updateDropInAction(item.id, formData);

    if ("success" in result && result.success) {
      toast.success("Aula avulsa atualizada");
    } else {
      toast.error("error" in result ? result.error : "Erro");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap items-end gap-4 rounded-lg border p-4"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="min-w-[200px]">
              <FormLabel>Rótulo</FormLabel>
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
        <Button type="submit" size="icon">
          <Check className="size-4" />
        </Button>
      </form>
    </Form>
  );
}
