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
import { MoreHorizontal, Pencil, Trash2, Trophy } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deleteChampionshipAction } from "@/app/admin/actions/championships-actions";
import type { ChampionshipRow } from "@/types/database";

const STATUS_VARIANTS: Record<
  ChampionshipRow["status"],
  "success" | "warning" | "secondary"
> = {
  finalizado: "success",
  "em-andamento": "warning",
  futuro: "secondary",
};

interface ChampionshipsListProps {
  championships: ChampionshipRow[];
}

export function ChampionshipsList({ championships }: ChampionshipsListProps) {
  if (championships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Trophy className="size-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum campeonato cadastrado</p>
        <Link href="/admin/content/championships?action=new">
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
            <TableHead>Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>🥇</TableHead>
            <TableHead>🥈</TableHead>
            <TableHead>🥉</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {championships.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.event_date}</TableCell>
              <TableCell>{c.location}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANTS[c.status]}>
                  {c.status.replace("-", " ")}
                </Badge>
              </TableCell>
              <TableCell>{c.gold}</TableCell>
              <TableCell>{c.silver}</TableCell>
              <TableCell>{c.bronze}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Ações">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/content/championships/${c.id}`}>
                        <Trophy className="size-4" />
                        Resultados
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/content/championships?action=edit&id=${c.id}`}>
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
                      title="Excluir campeonato"
                      description="Tem certeza? Todos os resultados serão excluídos."
                      action={() => deleteChampionshipAction(c.id)}
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
