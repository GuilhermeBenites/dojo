"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, Trash2 } from "lucide-react";
import type { LeadRow } from "@/types/database";
import { deleteLeadAction } from "@/app/admin/actions/finance-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/admin/cms/delete-confirm-dialog";

interface RecentLeadsListProps {
  leads: LeadRow[];
}

function waHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/55${digits}`;
}

export function RecentLeadsList({ leads }: RecentLeadsListProps) {
  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-sm py-4 text-center">
            Nenhum lead registrado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="pl-6 font-medium">{lead.name}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{lead.source}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={waHref(lead.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${lead.name}`}
                      >
                        <MessageCircle className="size-4" />
                      </a>
                    </Button>
                    <DeleteConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Excluir lead ${lead.name}`}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      }
                      title="Excluir lead"
                      description={`Remover o lead "${lead.name}"? Esta ação não pode ser desfeita.`}
                      action={() => deleteLeadAction(lead.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
