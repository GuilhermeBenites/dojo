"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TestimonialForm } from "./testimonial-form";
import type { TestimonialRow } from "@/types/database";

interface TestimonialSheetProps {
  action?: string;
  id?: string;
  testimonials: TestimonialRow[];
}

export function TestimonialSheet({
  action,
  id,
  testimonials,
}: TestimonialSheetProps) {
  const router = useRouter();
  const open = action === "new" || action === "edit";
  const testimonial = id ? testimonials.find((t) => t.id === id) : undefined;

  function handleClose() {
    router.push("/admin/content/testimonials");
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {action === "new" ? "Novo Depoimento" : "Editar Depoimento"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <TestimonialForm testimonial={testimonial} onSuccess={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
