"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChampionshipForm } from "./championship-form";
import type { ChampionshipRow } from "@/types/database";

interface ChampionshipSheetProps {
  action?: string;
  id?: string;
  championships: ChampionshipRow[];
}

export function ChampionshipSheet({
  action,
  id,
  championships,
}: ChampionshipSheetProps) {
  const router = useRouter();
  const open = action === "new" || action === "edit";
  const championship = id ? championships.find((c) => c.id === id) : undefined;

  function handleClose() {
    router.push("/admin/content/championships");
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {action === "new" ? "Novo Campeonato" : "Editar Campeonato"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ChampionshipForm championship={championship} onSuccess={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
