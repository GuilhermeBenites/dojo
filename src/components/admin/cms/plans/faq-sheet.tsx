"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaqForm } from "./faq-form";
import type { FaqItemRow } from "@/types/database";

interface FaqSheetProps {
  faqItem?: FaqItemRow;
  trigger: React.ReactNode;
}

export function FaqSheet({ faqItem, trigger }: FaqSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{faqItem ? "Editar FAQ" : "Nova FAQ"}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FaqForm faqItem={faqItem} onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
