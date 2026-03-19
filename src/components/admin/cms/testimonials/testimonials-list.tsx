"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";
import { deleteTestimonialAction } from "@/app/admin/actions/testimonials-actions";
import type { TestimonialRow } from "@/types/database";

function truncate(str: string, len: number) {
  return str.length <= len ? str : str.slice(0, len) + "…";
}

interface TestimonialsListProps {
  testimonials: TestimonialRow[];
}

export function TestimonialsList({ testimonials }: TestimonialsListProps) {
  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <MessageSquare className="size-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum depoimento cadastrado</p>
        <Link href="/admin/content/testimonials?action=new">
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
            <TableHead>Autor</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Depoimento</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.author}</TableCell>
              <TableCell>{t.role}</TableCell>
              <TableCell className="max-w-[300px] text-muted-foreground">
                {truncate(t.quote, 80)}
              </TableCell>
              <TableCell>{t.display_order}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Ações">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/content/testimonials?action=edit&id=${t.id}`}>
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
                      title="Excluir depoimento"
                      description="Tem certeza? Esta ação não pode ser desfeita."
                      action={() => deleteTestimonialAction(t.id)}
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
