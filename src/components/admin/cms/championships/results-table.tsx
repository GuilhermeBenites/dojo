"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deleteResultAction } from "@/app/admin/actions/championships-actions";
import type { ChampionshipResultRow } from "@/types/database";

const PLACEMENT_LABELS: Record<number, string> = {
  1: "🥇 Ouro",
  2: "🥈 Prata",
  3: "🥉 Bronze",
};

interface ResultsTableProps {
  results: ChampionshipResultRow[];
  championshipId: string;
}

export function ResultsTable({ results, championshipId }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <p className="text-muted-foreground py-4">
        Nenhum resultado cadastrado. Adicione abaixo.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Atleta</TableHead>
            <TableHead>Colocação</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.athlete_name}</TableCell>
              <TableCell>{PLACEMENT_LABELS[r.placement] ?? r.placement}</TableCell>
              <TableCell>{r.category}</TableCell>
              <TableCell>
                <DeleteConfirmDialog
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Excluir">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  }
                  title="Excluir resultado"
                  description="Tem certeza?"
                  action={() => deleteResultAction(r.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
