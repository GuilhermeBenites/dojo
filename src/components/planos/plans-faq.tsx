"use client";

import type { FaqItem } from "@/types/plans";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PlansFaqProps {
  items: FaqItem[];
}

export function PlansFaq({ items }: PlansFaqProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-neutral-dark">
          Dúvidas Frequentes
        </h2>
        <Accordion type="multiple" className="mx-auto max-w-2xl space-y-4">
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="rounded-xl border border-slate-200 bg-white px-6 shadow-sm open:shadow-md"
            >
              <AccordionTrigger className="py-4 text-left text-base font-semibold text-neutral-dark">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-neutral-dark/70">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
