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
  testimonialSchema,
  type TestimonialFormData,
} from "@/lib/validations/testimonial-schema";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/app/admin/actions/testimonials-actions";
import type { TestimonialRow } from "@/types/database";

interface TestimonialFormProps {
  testimonial?: TestimonialRow;
  onSuccess: () => void;
}

export function TestimonialForm({ testimonial, onSuccess }: TestimonialFormProps) {
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author: testimonial?.author ?? "",
      role: testimonial?.role ?? "",
      quote: testimonial?.quote ?? "",
      display_order: testimonial?.display_order ?? 0,
    },
  });

  async function onSubmit(values: TestimonialFormData) {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) =>
      formData.set(k, String(v ?? ""))
    );

    const result = testimonial
      ? await updateTestimonialAction(testimonial.id, formData)
      : await createTestimonialAction(formData);

    if ("success" in result && result.success) {
      toast.success(testimonial ? "Depoimento atualizado" : "Depoimento criado");
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
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autor</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Input placeholder="Aluno há 3 anos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Depoimento</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
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
