"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlansTab } from "./plans-tab";
import { BeltExamsTab } from "./belt-exams-tab";
import { DropInTab } from "./drop-in-tab";
import { FaqTab } from "./faq-tab";
import type { PlanRow } from "@/types/database";
import type { BeltExamRow } from "@/types/database";
import type { DropInClassRow } from "@/types/database";
import type { FaqItemRow } from "@/types/database";

interface PlansTabsProps {
  plans: PlanRow[];
  beltExams: BeltExamRow[];
  dropIn: DropInClassRow[];
  faqItems: FaqItemRow[];
}

export function PlansTabs({
  plans,
  beltExams,
  dropIn,
  faqItems,
}: PlansTabsProps) {
  return (
    <Tabs defaultValue="plans">
      <TabsList>
        <TabsTrigger value="plans">Planos</TabsTrigger>
        <TabsTrigger value="belt-exams">Exames de Faixa</TabsTrigger>
        <TabsTrigger value="drop-in">Aulas Avulsas</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>
      <TabsContent value="plans">
        <PlansTab plans={plans} />
      </TabsContent>
      <TabsContent value="belt-exams">
        <BeltExamsTab beltExams={beltExams} />
      </TabsContent>
      <TabsContent value="drop-in">
        <DropInTab dropIn={dropIn} />
      </TabsContent>
      <TabsContent value="faq">
        <FaqTab faqItems={faqItems} />
      </TabsContent>
    </Tabs>
  );
}
