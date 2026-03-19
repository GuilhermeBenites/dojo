"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlanForm } from "./plan-form";
import type { PlanRow } from "@/types/database";

interface PlanSheetProps {
  plan?: PlanRow;
  trigger: React.ReactNode;
}

export function PlanSheet({ plan, trigger }: PlanSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{plan ? "Editar Plano" : "Novo Plano"}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <PlanForm plan={plan} onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
