"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScheduleForm } from "./schedule-form";
import type { ScheduleRow } from "@/types/database";

interface ScheduleSheetProps {
  action?: string;
  id?: string;
  schedules: ScheduleRow[];
}

export function ScheduleSheet({
  action,
  id,
  schedules,
}: ScheduleSheetProps) {
  const router = useRouter();
  const open = action === "new" || action === "edit";
  const schedule = id
    ? schedules.find((s) => s.id === id)
    : undefined;

  function handleClose() {
    router.push("/admin/content/schedules");
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {action === "new" ? "Novo Horário" : "Editar Horário"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ScheduleForm
            schedule={schedule}
            onSuccess={handleClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
