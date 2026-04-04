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
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/cms/image-upload";
import {
  senseiSchema,
  type SenseiFormData,
} from "@/lib/validations/sensei-schema";
import {
  createSenseiAction,
  updateSenseiAction,
} from "@/app/admin/actions/senseis-actions";
import type { SenseiRow } from "@/types/database";

interface SenseiFormProps {
  sensei?: SenseiRow;
  onSuccess: () => void;
}

export function SenseiForm({ sensei, onSuccess }: SenseiFormProps) {
  const form = useForm<SenseiFormData>({
    resolver: zodResolver(senseiSchema),
    defaultValues: {
      name: sensei?.name ?? "",
      rank: sensei?.rank ?? "",
      specialty: sensei?.specialty ?? "",
      bio: sensei?.bio ?? "",
      quote: sensei?.quote ?? "",
      organization: sensei?.organization ?? "",
      photo_url: sensei?.photo_url ?? "",
      is_founder: sensei?.is_founder ?? false,
      display_order: sensei?.display_order ?? 0,
    },
  });

  const isFounder = form.watch("is_founder");

  async function onSubmit(values: SenseiFormData) {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (typeof v === "boolean") {
        formData.set(k, v ? "on" : "off");
      } else {
        formData.set(k, String(v ?? ""));
      }
    });

    const result = sensei
      ? await updateSenseiAction(sensei.id, formData)
      : await createSenseiAction(formData);

    if ("success" in result && result.success) {
      toast.success(sensei ? "Sensei atualizado" : "Sensei criado");
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
          name="photo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto</FormLabel>
              <FormControl>
                <ImageUpload
                  bucket="senseis"
                  value={field.value || undefined}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduação</FormLabel>
              <FormControl>
                <Input placeholder="Faixa Preta 5º Dan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidade (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Kata e Kihon" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia (opcional)</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_founder"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel>Fundador</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isFounder && (
          <>
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organização</FormLabel>
                  <FormControl>
                    <Input placeholder="Shotokan Karate International" {...field} />
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
                  <FormLabel>Citação</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
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
