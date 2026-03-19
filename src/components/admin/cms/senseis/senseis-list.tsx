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
import { MoreHorizontal, Pencil, Trash2, User } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deleteSenseiAction } from "@/app/admin/actions/senseis-actions";
import type { SenseiRow } from "@/types/database";

interface SenseisListProps {
  senseis: SenseiRow[];
}

export function SenseisList({ senseis }: SenseisListProps) {
  if (senseis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <User className="size-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum sensei cadastrado</p>
        <Link href="/admin/content/senseis?action=new">
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
            <TableHead className="w-[60px]">Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Graduação</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>Fundador</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {senseis.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                {s.photo_url ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src={s.photo_url}
                      alt={s.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="size-5 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.rank}</TableCell>
              <TableCell>{s.specialty ?? "—"}</TableCell>
              <TableCell>
                {s.is_founder && (
                  <Badge variant="destructive">Fundador</Badge>
                )}
              </TableCell>
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
                      <Link href={`/admin/content/senseis?action=edit&id=${s.id}`}>
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
                      title="Excluir sensei"
                      description="Tem certeza? Esta ação não pode ser desfeita."
                      action={() => deleteSenseiAction(s.id)}
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
