"use client";

import { useState, useTransition, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History, Loader2 } from "lucide-react";
import { getStudentPaymentsAction } from "@/app/admin/actions/finance-actions";
import type { PaymentRow, PaymentType } from "@/types/database";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const PAYMENT_TYPE_CONFIG: Record<
  PaymentType,
  { label: string; className: string }
> = {
  mensalidade: {
    label: "Mensalidade",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  exame_faixa: {
    label: "Exame de Faixa",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  aula_particular: {
    label: "Aula Particular",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  outros: {
    label: "Outros",
    className: "bg-zinc-100 text-zinc-600",
  },
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

interface PaymentHistorySheetProps {
  studentId: string;
  studentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentHistorySheet({
  studentId,
  studentName,
  open,
  onOpenChange,
}: PaymentHistorySheetProps) {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      const data = await getStudentPaymentsAction(studentId);
      setPayments(data);
    });
  }, [open, studentId]);

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <History className="size-4" />
            Histórico de Pagamentos
          </SheetTitle>
          <p className="text-sm text-muted-foreground">{studentName}</p>
        </SheetHeader>

        {isPending ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">
              Nenhum pagamento registrado.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {payments.length} registro{payments.length !== 1 ? "s" : ""} ·{" "}
              Total: <span className="font-medium text-foreground">{formatAmount(total)}</span>
            </p>

            <div className="divide-y rounded-md border">
              {payments.map((payment) => {
                const cfg = PAYMENT_TYPE_CONFIG[payment.payment_type];
                return (
                  <div key={payment.id} className="flex items-start justify-between gap-3 p-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={cfg.className}>
                          {cfg.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(payment.payment_date + "T12:00:00"),
                            "dd/MM/yyyy",
                            { locale: ptBR },
                          )}
                        </span>
                      </div>
                      {payment.notes && (
                        <p className="text-xs text-muted-foreground truncate">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-medium tabular-nums">
                      {formatAmount(payment.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
