"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StudentForm } from "./student-form";
import type { StudentRow } from "@/types/database";

interface StudentSheetProps {
  isOpen: boolean;
  student?: StudentRow | null;
  plans: Array<{ id: string; title: string }>;
}

export function StudentSheet({ isOpen, student, plans }: StudentSheetProps) {
  const router = useRouter();

  function handleClose() {
    // Remove action and id from URL to close the sheet
    const url = new URL(window.location.href);
    url.searchParams.delete("action");
    url.searchParams.delete("id");
    router.push(url.pathname + url.search);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {student ? "Editar Aluno" : "Novo Aluno"}
          </SheetTitle>
        </SheetHeader>

        <StudentForm
          student={student}
          plans={plans}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </SheetContent>
    </Sheet>
  );
}
