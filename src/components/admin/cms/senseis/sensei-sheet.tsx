"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SenseiForm } from "./sensei-form";
import type { SenseiRow } from "@/types/database";

interface SenseiSheetProps {
  action?: string;
  id?: string;
  senseis: SenseiRow[];
}

export function SenseiSheet({
  action,
  id,
  senseis,
}: SenseiSheetProps) {
  const router = useRouter();
  const open = action === "new" || action === "edit";
  const sensei = id ? senseis.find((s) => s.id === id) : undefined;

  function handleClose() {
    router.push("/admin/content/senseis");
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {action === "new" ? "Novo Sensei" : "Editar Sensei"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <SenseiForm sensei={sensei} onSuccess={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
