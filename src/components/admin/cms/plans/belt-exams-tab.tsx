"use client";

import { BeltExamRow } from "./belt-exam-row";
import type { BeltExamRow as BeltExamRowType } from "@/types/database";

interface BeltExamsTabProps {
  beltExams: BeltExamRowType[];
}

export function BeltExamsTab({ beltExams }: BeltExamsTabProps) {
  if (beltExams.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        Nenhum exame de faixa cadastrado
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {beltExams.map((exam) => (
        <BeltExamRow key={exam.id} exam={exam} />
      ))}
    </div>
  );
}
