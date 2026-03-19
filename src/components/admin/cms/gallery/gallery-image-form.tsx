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
import { ImageUpload } from "@/components/admin/cms/image-upload";
import {
  gallerySchema,
  type GalleryFormData,
} from "@/lib/validations/gallery-schema";
import {
  createGalleryImageAction,
  updateGalleryImageAction,
} from "@/app/admin/actions/gallery-actions";
import type { GalleryImageRow } from "@/types/database";

interface GalleryImageFormProps {
  image?: Partial<GalleryImageRow> & {
    category?: "sensei-luciano" | "belt-ceremonies" | "kids" | "dojo";
    aspect_ratio?: "square" | "portrait" | "landscape";
  };
  onSuccess: () => void;
}

export function GalleryImageForm({ image, onSuccess }: GalleryImageFormProps) {
  const form = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: image?.title ?? "",
      category: image?.category ?? "dojo",
      image_url: image?.image_url ?? "",
      aspect_ratio: (image?.aspect_ratio as "square" | "portrait" | "landscape") ?? "square",
      display_order: image?.display_order ?? 0,
    },
  });

  async function onSubmit(values: GalleryFormData) {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) =>
      formData.set(k, String(v ?? ""))
    );

    const result = image?.id
      ? await updateGalleryImageAction(image.id, formData)
      : await createGalleryImageAction(formData);

    if ("success" in result && result.success) {
      toast.success(image?.id ? "Imagem atualizada" : "Imagem criada");
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
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem *</FormLabel>
              <FormControl>
                <ImageUpload
                  bucket="gallery"
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
                  <SelectItem value="sensei-luciano">Sensei Luciano</SelectItem>
                  <SelectItem value="belt-ceremonies">
                    Cerimônias de Faixa
                  </SelectItem>
                  <SelectItem value="kids">Aulas Infantis</SelectItem>
                  <SelectItem value="dojo">Dojo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aspect_ratio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proporção</FormLabel>
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
                  <SelectItem value="square">Quadrado</SelectItem>
                  <SelectItem value="portrait">Retrato</SelectItem>
                  <SelectItem value="landscape">Paisagem</SelectItem>
                </SelectContent>
              </Select>
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
