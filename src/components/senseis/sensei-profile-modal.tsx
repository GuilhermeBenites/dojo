"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Sensei } from "@/types/sensei";

interface SenseiProfileModalProps {
  sensei: Sensei | null;
  open: boolean;
  onClose: () => void;
}

export function SenseiProfileModal({
  sensei,
  open,
  onClose,
}: SenseiProfileModalProps) {
  if (!sensei) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
          <Image
            src={sensei.photoUrl}
            alt={sensei.photoAlt}
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover object-center"
          />
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
            {sensei.specialty}
          </div>
        </div>

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              {sensei.name}
            </DialogTitle>
            <p className="text-sm font-semibold text-primary">{sensei.rank}</p>
          </DialogHeader>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {sensei.bio}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
