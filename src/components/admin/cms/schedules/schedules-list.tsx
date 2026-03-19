"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deleteScheduleAction } from "@/app/admin/actions/schedules-actions";
import type { ScheduleRow } from "@/types/database";

interface SchedulesListProps {
  schedules: ScheduleRow[];
}

export function SchedulesList({ schedules }: SchedulesListProps) {
  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Nenhum horário cadastrado</p>
        <Link href="/admin/content/schedules?action=new">
          <Button variant="outline" size="sm" className="mt-4">
            Criar primeiro
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dias</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Instrutor</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.day_label}</TableCell>
              <TableCell>
                {s.time_start} – {s.time_end}
              </TableCell>
              <TableCell>
                <Badge
                  variant={s.category === "infantil" ? "secondary" : "destructive"}
                >
                  {s.category}
                </Badge>
              </TableCell>
              <TableCell>{s.instructor ?? "—"}</TableCell>
              <TableCell>{s.display_order}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Ações">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/content/schedules?action=edit&id=${s.id}`}>
                        <Pencil className="size-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DeleteConfirmDialog
                      trigger={
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          Excluir
                        </DropdownMenuItem>
                      }
                      title="Excluir horário"
                      description="Tem certeza? Esta ação não pode ser desfeita."
                      action={() => deleteScheduleAction(s.id)}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
