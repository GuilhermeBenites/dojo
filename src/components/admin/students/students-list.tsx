"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { StudentRow } from "@/types/database";
import { BELT_OPTIONS } from "@/lib/constants";
import {
  deleteStudentAction,
  toggleStudentActiveAction,
} from "@/app/admin/actions/student-actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";

interface StudentsListProps {
  students: StudentRow[];
}

export function StudentsList({ students }: StudentsListProps) {
  const [isPending, startTransition] = useTransition();

  const getBeltLabel = (beltValue: string) => {
    return (
      BELT_OPTIONS.find((b) => b.value === beltValue)?.label || beltValue
    );
  };

  const getBeltBadgeClass = (beltValue: string) => {
    switch (beltValue) {
      case "branca":
        return "bg-zinc-100 text-zinc-800 hover:bg-zinc-200";
      case "amarela":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "laranja":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "verde":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "azul":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "roxa":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "marrom":
        return "bg-amber-800 text-white hover:bg-amber-900";
      default:
        if (beltValue.startsWith("preta")) {
          return "bg-zinc-900 text-white hover:bg-zinc-800";
        }
        return "bg-zinc-100 text-zinc-800";
    }
  };

  function handleToggleActive(student: StudentRow, checked: boolean) {
    startTransition(async () => {
      const result = await toggleStudentActiveAction(student.id, checked);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(
          `Aluno ${checked ? "ativado" : "inativado"} com sucesso.`,
        );
      }
    });
  }

  if (students.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">
          Nenhum aluno encontrado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Faixa</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <Badge
                    data-testid="belt-badge"
                    className={getBeltBadgeClass(student.belt)}
                    variant="outline"
                  >
                    {getBeltLabel(student.belt)}
                  </Badge>
                </TableCell>
                <TableCell>{student.phone || "—"}</TableCell>
                <TableCell>
                  {format(new Date(student.enrollment_date), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={student.active}
                      onCheckedChange={(checked) =>
                        handleToggleActive(student, checked)
                      }
                      disabled={isPending}
                    />
                    <Badge
                      variant={student.active ? "default" : "secondary"}
                    >
                      {student.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ações</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`?action=edit&id=${student.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DeleteConfirmDialog
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        }
                        title="Excluir Aluno"
                        description={`Tem certeza que deseja excluir o aluno ${student.name}? Esta ação não pode ser desfeita.`}
                        action={() => deleteStudentAction(student.id)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
