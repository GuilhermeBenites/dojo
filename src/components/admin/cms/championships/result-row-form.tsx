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
  championshipResultSchema,
  type ChampionshipResultFormData,
} from "@/lib/validations/championship-schema";
import { createResultAction } from "@/app/admin/actions/championships-actions";
import { StudentCombobox } from "@/components/admin/student-combobox";

interface ResultRowFormProps {
  championshipId: string;
  students: { id: string; name: string }[];
}

export function ResultRowForm({ championshipId, students }: ResultRowFormProps) {
  const form = useForm<ChampionshipResultFormData>({
    resolver: zodResolver(championshipResultSchema),
    defaultValues: {
      championship_id: championshipId,
      student_id: "",
      placement: 1,
      category: "",
    },
  });

  async function onSubmit(values: ChampionshipResultFormData) {
    const formData = new FormData();
    formData.set("championship_id", championshipId);
    formData.set("student_id", values.student_id);
    formData.set("placement", String(values.placement));
    formData.set("category", values.category);

    const result = await createResultAction(formData);

    if ("success" in result && result.success) {
      toast.success("Resultado adicionado");
      form.reset({
        championship_id: championshipId,
        student_id: "",
        placement: 1,
        category: "",
      });
    } else {
      toast.error("error" in result ? result.error : "Erro");
    }
  }

  return (
    <div className="rounded-md border p-4">
      <h3 className="font-medium mb-4">Adicionar Resultado</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-wrap items-end gap-4"
        >
          <FormField
            control={form.control}
            name="student_id"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[200px]">
                <FormLabel>Aluno</FormLabel>
                <FormControl>
                  <StudentCombobox
                    students={students}
                    value={field.value}
                    onChange={(id) => field.onChange(id)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="placement"
            render={({ field }) => (
              <FormItem className="w-[120px]">
                <FormLabel>Colocação</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">🥇 Ouro</SelectItem>
                    <SelectItem value="2">🥈 Prata</SelectItem>
                    <SelectItem value="3">🥉 Bronze</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[150px]">
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Kumite -75kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Adicionar
          </Button>
        </form>
      </Form>
    </div>
  );
}
