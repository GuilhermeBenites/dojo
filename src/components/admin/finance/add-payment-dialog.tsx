"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { addPaymentAction } from "@/app/admin/actions/finance-actions";
import type { PaymentType } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: "mensalidade", label: "Mensalidade" },
  { value: "exame_faixa", label: "Exame de Faixa" },
  { value: "aula_particular", label: "Aula Particular" },
  { value: "outros", label: "Outros" },
];

interface AddPaymentDialogProps {
  studentId: string;
  studentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentDialog({
  studentId,
  studentName,
  open,
  onOpenChange,
}: AddPaymentDialogProps) {
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().split("T")[0]!;

  const [paymentType, setPaymentType] = useState<PaymentType>("mensalidade");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(today);
  const [months, setMonths] = useState("1");
  const [notes, setNotes] = useState("");

  function reset() {
    setPaymentType("mensalidade");
    setAmount("");
    setPaymentDate(today);
    setMonths("1");
    setNotes("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Informe um valor válido");
      return;
    }

    startTransition(async () => {
      const result = await addPaymentAction(studentId, {
        amount: parsedAmount,
        payment_type: paymentType,
        payment_date: paymentDate,
        months: paymentType === "mensalidade" ? parseInt(months) : undefined,
        notes: notes.trim() || undefined,
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Pagamento registrado com sucesso");
        reset();
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento</DialogTitle>
          <p className="text-sm text-muted-foreground">{studentName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="payment-type">Tipo</Label>
            <Select
              value={paymentType}
              onValueChange={(v) => setPaymentType(v as PaymentType)}
            >
              <SelectTrigger id="payment-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payment-date">Data</Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>
          </div>

          {paymentType === "mensalidade" && (
            <div className="space-y-1.5">
              <Label htmlFor="months">Meses cobertos</Label>
              <Select value={months} onValueChange={setMonths}>
                <SelectTrigger id="months">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 mês</SelectItem>
                  <SelectItem value="2">2 meses</SelectItem>
                  <SelectItem value="3">3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Pago via PIX"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
