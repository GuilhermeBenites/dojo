"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function OrderControls({
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: OrderControlsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onMoveUp}
        disabled={isFirst}
        aria-label="Mover para cima"
      >
        <ChevronUp className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onMoveDown}
        disabled={isLast}
        aria-label="Mover para baixo"
      >
        <ChevronDown className="size-4" />
      </Button>
    </div>
  );
}
