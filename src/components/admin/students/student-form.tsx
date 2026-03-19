"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import {
  studentSchema,
  type StudentFormData,
} from "@/lib/validations/student-schema";
import {
  createStudentAction,
  updateStudentAction,
} from "@/app/admin/actions/student-actions";
import { BELT_OPTIONS } from "@/lib/constants";
import type { StudentRow } from "@/types/database";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface StudentFormProps {
  student?: StudentRow | null;
  plans: Array<{ id: string; title: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StudentForm({
  student,
  plans,
  onSuccess,
  onCancel,
}: StudentFormProps) {
  const [isPending, setIsPending] = useState(false);

  const defaultValues: Partial<StudentFormData> = {
    name: student?.name ?? "",
    email: student?.email ?? "",
    phone: student?.phone ?? "",
    belt: (student?.belt as any) ?? "branca",
    plan_id: student?.plan_id ?? "none",
    enrollment_date:
      student?.enrollment_date ?? new Date().toISOString().split("T")[0],
    birth_date: student?.birth_date ?? "",
    active: student?.active ?? true,
    notes: student?.notes ?? "",
  };

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  async function onSubmit(data: StudentFormData) {
    setIsPending(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "none") {
        formData.append(key, value.toString());
      }
    });

    const result = student
      ? await updateStudentAction(student.id, formData)
      : await createStudentAction(formData);

    setIsPending(false);

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(
        student ? "Aluno atualizado com sucesso!" : "Aluno criado com sucesso!"
      );
      onSuccess();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do aluno" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="E-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="belt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faixa</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a faixa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BELT_OPTIONS.map((belt) => (
                        <SelectItem key={belt.value} value={belt.value}>
                          {belt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plano (Opcional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum plano</SelectItem>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="enrollment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Matrícula</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Aluno Ativo</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações (Opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Observações sobre o aluno..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
