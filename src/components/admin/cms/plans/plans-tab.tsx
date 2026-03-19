"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deletePlanAction } from "@/app/admin/actions/plans-actions";
import { PlanSheet } from "./plan-sheet";
import type { PlanRow } from "@/types/database";

interface PlansTabProps {
  plans: PlanRow[];
}

export function PlansTab({ plans }: PlansTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <PlanSheet trigger={<Button size="sm"><Plus className="size-4" /> Novo Plano</Button>} />
      </div>
      {plans.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Nenhum plano cadastrado
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.plan_key}</TableCell>
                  <TableCell>
                    {p.recommended && <Badge>Recomendado</Badge>}
                  </TableCell>
                  <TableCell>{p.display_order}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm"> <MoreHorizontal className="size-4" /> </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <PlanSheet
                          plan={p}
                          trigger={
                            <DropdownMenuItem>
                              <Pencil className="size-4" />
                              Editar
                            </DropdownMenuItem>
                          }
                        />
                        <DeleteConfirmDialog
                          trigger={
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="size-4" />
                              Excluir
                            </DropdownMenuItem>
                          }
                          title="Excluir plano"
                          description="Tem certeza?"
                          action={() => deletePlanAction(p.id)}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
