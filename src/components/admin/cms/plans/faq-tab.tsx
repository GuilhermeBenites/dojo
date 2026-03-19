"use client";

import Link from "next/link";
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
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deleteFaqAction } from "@/app/admin/actions/plans-actions";
import { FaqSheet } from "./faq-sheet";
import type { FaqItemRow } from "@/types/database";

function truncate(str: string, len: number) {
  return str.length <= len ? str : str.slice(0, len) + "…";
}

interface FaqTabProps {
  faqItems: FaqItemRow[];
}

export function FaqTab({ faqItems }: FaqTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <FaqSheet trigger={<Button size="sm"><Plus className="size-4" /> Nova FAQ</Button>} />
      </div>
      {faqItems.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Nenhum item de FAQ cadastrado
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pergunta</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqItems.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="max-w-[400px]">
                    {truncate(f.question, 80)}
                  </TableCell>
                  <TableCell>{f.display_order}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <FaqSheet
                          faqItem={f}
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
                          title="Excluir FAQ"
                          description="Tem certeza?"
                          action={() => deleteFaqAction(f.id)}
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
