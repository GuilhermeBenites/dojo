"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History, Plus } from "lucide-react";
import type { StudentFinanceRow } from "@/types/database";
import { BELT_OPTIONS } from "@/lib/constants";
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
import { AddPaymentDialog } from "./add-payment-dialog";
import { PaymentHistorySheet } from "./payment-history-sheet";

interface PaymentStatusTableProps {
  students: StudentFinanceRow[];
  plans: Array<{ id: string; title: string }>;
}

type PaymentStatus = "vencido" | "vencendo" | "em-dia" | "sem-plano";

function getPaymentStatus(nextPaymentDate: string | null): PaymentStatus {
  if (!nextPaymentDate) return "sem-plano";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(nextPaymentDate);
  const daysUntilDue = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysUntilDue < 0) return "vencido";
  if (daysUntilDue <= 7) return "vencendo";
  return "em-dia";
}

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  vencido: {
    label: "Vencido",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  vencendo: {
    label: "Vencendo",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  "em-dia": {
    label: "Em dia",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  "sem-plano": {
    label: "Sem plano",
    className: "bg-zinc-100 text-zinc-600",
  },
};

function getBeltLabel(beltValue: string) {
  return BELT_OPTIONS.find((b) => b.value === beltValue)?.label || beltValue;
}

function getBeltBadgeClass(beltValue: string) {
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
}

export function PaymentStatusTable({
  students,
  plans,
}: PaymentStatusTableProps) {
  const [addDialog, setAddDialog] = useState<{
    studentId: string;
    studentName: string;
  } | null>(null);
  const [historySheet, setHistorySheet] = useState<{
    studentId: string;
    studentName: string;
  } | null>(null);

  const planById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of plans) m.set(p.id, p.title);
    return m;
  }, [plans]);

  const summary = useMemo(() => {
    let vencido = 0;
    let vencendo = 0;
    let emDia = 0;
    let semPlano = 0;
    for (const s of students) {
      const st = getPaymentStatus(s.next_payment_date);
      if (st === "vencido") vencido++;
      else if (st === "vencendo") vencendo++;
      else if (st === "em-dia") emDia++;
      else semPlano++;
    }
    return { vencido, vencendo, emDia, semPlano };
  }, [students]);

  if (students.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">
          Nenhum aluno ativo encontrado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
          <span className="rounded-md bg-red-100 px-2 py-0.5 text-red-800 text-xs font-medium">
            {summary.vencido} vencidos
          </span>
          <span>·</span>
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-amber-800 text-xs font-medium">
            {summary.vencendo} vencendo
          </span>
          <span>·</span>
          <span className="rounded-md bg-green-100 px-2 py-0.5 text-green-800 text-xs font-medium">
            {summary.emDia} em dia
          </span>
          <span>·</span>
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-600 text-xs font-medium">
            {summary.semPlano} sem plano
          </span>
        </p>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Faixa</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Próx. Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const status = getPaymentStatus(student.next_payment_date);
                const cfg = STATUS_CONFIG[status];
                const planTitle = student.plan_id
                  ? planById.get(student.plan_id) ?? "—"
                  : "—";
                const dateStr = student.next_payment_date
                  ? format(
                      new Date(student.next_payment_date + "T12:00:00"),
                      "dd/MM/yyyy",
                      { locale: ptBR },
                    )
                  : "—";

                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getBeltBadgeClass(student.belt)}
                      >
                        {getBeltLabel(student.belt)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {planTitle}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {dateStr}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cfg.className}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() =>
                            setAddDialog({
                              studentId: student.id,
                              studentName: student.name,
                            })
                          }
                        >
                          <Plus className="size-3.5" />
                          Registrar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                          onClick={() =>
                            setHistorySheet({
                              studentId: student.id,
                              studentName: student.name,
                            })
                          }
                        >
                          <History className="size-3.5" />
                          Histórico
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {addDialog && (
        <AddPaymentDialog
          studentId={addDialog.studentId}
          studentName={addDialog.studentName}
          open={true}
          onOpenChange={(open) => {
            if (!open) setAddDialog(null);
          }}
        />
      )}

      {historySheet && (
        <PaymentHistorySheet
          studentId={historySheet.studentId}
          studentName={historySheet.studentName}
          open={true}
          onOpenChange={(open) => {
            if (!open) setHistorySheet(null);
          }}
        />
      )}
    </>
  );
}
