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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  faqSchema,
  type FaqFormData,
} from "@/lib/validations/plan-schema";
import {
  createFaqAction,
  updateFaqAction,
} from "@/app/admin/actions/plans-actions";
import type { FaqItemRow } from "@/types/database";

interface FaqFormProps {
  faqItem?: FaqItemRow;
  onSuccess: () => void;
}

export function FaqForm({ faqItem, onSuccess }: FaqFormProps) {
  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: faqItem?.question ?? "",
      answer: faqItem?.answer ?? "",
      display_order: faqItem?.display_order ?? 0,
    },
  });

  async function onSubmit(values: FaqFormData) {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.set(k, String(v ?? "")));

    const result = faqItem
      ? await updateFaqAction(faqItem.id, formData)
      : await createFaqAction(formData);

    if ("success" in result && result.success) {
      toast.success(faqItem ? "FAQ atualizado" : "FAQ criado");
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
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pergunta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resposta</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
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
          <Button type="submit" disabled={form.formState.isSubmitting}>Salvar</Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
