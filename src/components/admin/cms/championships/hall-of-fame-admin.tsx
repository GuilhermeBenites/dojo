"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/admin/cms/image-upload";
import { upsertHallOfFameAction } from "@/app/admin/actions/championships-actions";

export interface HofEntry {
  athleteName: string;
  studentId: string | null;
  medals: { gold: number; silver: number; bronze: number };
  photoUrl: string | null;
  achievement: string | null;
}

interface HallOfFameAdminProps {
  entries: HofEntry[];
}

interface EditFormValues {
  achievement: string;
  photo_url: string;
}

function EditSheet({
  entry,
  rank,
  open,
  onClose,
}: {
  entry: HofEntry;
  rank: number;
  open: boolean;
  onClose: () => void;
}) {
  const defaultAchievement =
    entry.achievement ??
    `${entry.medals.gold} Medalha${entry.medals.gold > 1 ? "s" : ""} de Ouro`;

  const form = useForm<EditFormValues>({
    defaultValues: {
      achievement: defaultAchievement,
      photo_url: entry.photoUrl ?? "",
    },
  });

  async function onSubmit(values: EditFormValues) {
    const result = await upsertHallOfFameAction(
      entry.athleteName,
      values.photo_url,
      values.achievement,
      entry.studentId ?? undefined
    );
    if ("success" in result && result.success) {
      toast.success("Hall da Fama atualizado");
      onClose();
    } else {
      toast.error("error" in result ? result.error : "Erro");
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            #{rank} — {entry.athleteName}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="photo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                      <ImageUpload
                        bucket="championships"
                        inputId={`hof-photo-${entry.athleteName}`}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="achievement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conquista</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: 3x Campeão Estadual"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Salvar
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function HallOfFameAdmin({ entries }: HallOfFameAdminProps) {
  const [editing, setEditing] = useState<number | null>(null);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Medal className="size-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Nenhum atleta com medalha de ouro ainda.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Cadastre resultados nos campeonatos para calcular o ranking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const rank = i + 1;
        const achievement =
          entry.achievement ??
          `${entry.medals.gold} Medalha${entry.medals.gold > 1 ? "s" : ""} de Ouro`;

        return (
          <div
            key={entry.athleteName}
            className="flex items-center gap-4 rounded-lg border bg-card p-4"
          >
            <span className="text-2xl font-black text-muted-foreground w-8 text-center">
              {rank}
            </span>
            {entry.photoUrl ? (
              <img
                src={entry.photoUrl}
                alt={entry.athleteName}
                className="size-12 rounded-full object-cover border"
              />
            ) : (
              <div className="size-12 rounded-full bg-muted flex items-center justify-center border">
                <Medal className="size-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{entry.athleteName}</p>
              <p className="text-sm text-muted-foreground truncate">
                {achievement}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
              <span title="Ouro">🥇 {entry.medals.gold}</span>
              <span title="Prata">🥈 {entry.medals.silver}</span>
              <span title="Bronze">🥉 {entry.medals.bronze}</span>
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setEditing(i)}
              aria-label="Editar"
            >
              <Pencil className="size-4" />
            </Button>
            {editing === i && (
              <EditSheet
                entry={entry}
                rank={rank}
                open
                onClose={() => setEditing(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
