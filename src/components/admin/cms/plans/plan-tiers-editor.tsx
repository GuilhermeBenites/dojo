"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

interface TierRow {
  label: string;
  price: string;
  isMonthlyHighlight: boolean;
  suffix?: string;
}

interface PlanTiersEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlanTiersEditor({ value, onChange }: PlanTiersEditorProps) {
  const [tiers, setTiers] = useState<TierRow[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(value || "[]") as TierRow[];
      setTiers(Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ label: "Mensal", price: "", isMonthlyHighlight: true }]);
    } catch {
      setTiers([{ label: "Mensal", price: "", isMonthlyHighlight: true }]);
    }
  }, [value]);

  function updateTiers(newTiers: TierRow[]) {
    setTiers(newTiers);
    onChange(JSON.stringify(newTiers));
  }

  function updateRow(idx: number, updates: Partial<TierRow>) {
    const next = [...tiers];
    next[idx] = { ...next[idx], ...updates };
    updateTiers(next);
  }

  function addRow() {
    updateTiers([...tiers, { label: "", price: "", isMonthlyHighlight: false }]);
  }

  function removeRow(idx: number) {
    updateTiers(tiers.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3 rounded-md border p-4">
      {tiers.map((t, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 rounded border p-2">
          <Input
            placeholder="Rótulo"
            value={t.label}
            onChange={(e) => updateRow(i, { label: e.target.value })}
            className="w-24"
          />
          <Input
            placeholder="Preço"
            value={t.price}
            onChange={(e) => updateRow(i, { price: e.target.value })}
            className="w-28"
          />
          <Input
            placeholder="Sufixo (opcional)"
            value={t.suffix ?? ""}
            onChange={(e) => updateRow(i, { suffix: e.target.value || undefined })}
            className="w-24"
          />
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={t.isMonthlyHighlight}
              onCheckedChange={(v) => updateRow(i, { isMonthlyHighlight: v })}
            />
            Destaque
          </label>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeRow(i)}
            disabled={tiers.length <= 1}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="size-4" />
        Adicionar tier
      </Button>
    </div>
  );
}
