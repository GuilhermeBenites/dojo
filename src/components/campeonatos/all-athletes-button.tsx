"use client";

import { useState } from "react";
import type { AthleteRanking } from "@/types/championships";
import { AthleteRankingModal } from "./athlete-ranking-modal";

interface AllAthletesButtonProps {
  athletes: AthleteRanking[];
}

export function AllAthletesButton({ athletes }: AllAthletesButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-1 font-semibold text-primary hover:underline md:flex"
      >
        Ver todos os atletas
        <span className="material-symbols-outlined text-base" aria-hidden="true">
          arrow_forward
        </span>
      </button>
      <AthleteRankingModal open={open} onClose={() => setOpen(false)} athletes={athletes} />
    </>
  );
}
