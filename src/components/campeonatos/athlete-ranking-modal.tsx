"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AgeCategory, AthleteRanking, BeltColor } from "@/types/championships";

const PAGE_SIZE = 8;

const AGE_CATEGORIES: { key: "all" | AgeCategory; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "infantil", label: "Infantil" },
  { key: "juvenil", label: "Juvenil" },
  { key: "adulto", label: "Adulto" },
  { key: "master", label: "Master" },
];

const BELT_STYLES: Record<
  BeltColor,
  { className: string; label: string }
> = {
  preta: {
    className: "bg-neutral-900 text-white border-b-2 border-primary",
    label: "Faixa Preta",
  },
  vermelha: { className: "bg-primary text-white", label: "Faixa Vermelha" },
  marrom: { className: "bg-amber-800 text-white", label: "Faixa Marrom" },
  roxa: { className: "bg-purple-700 text-white", label: "Faixa Roxa" },
  azul: { className: "bg-blue-700 text-white", label: "Faixa Azul" },
  verde: { className: "bg-green-700 text-white", label: "Faixa Verde" },
  laranja: { className: "bg-orange-500 text-white", label: "Faixa Laranja" },
  amarela: {
    className: "bg-yellow-400 text-neutral-900",
    label: "Faixa Amarela",
  },
  branca: {
    className: "bg-white text-neutral-900 border border-slate-300",
    label: "Faixa Branca",
  },
};

function sortAthletes(athletes: AthleteRanking[]): AthleteRanking[] {
  return [...athletes].sort((a, b) => {
    if (b.medals.gold !== a.medals.gold) return b.medals.gold - a.medals.gold;
    if (b.medals.silver !== a.medals.silver)
      return b.medals.silver - a.medals.silver;
    return b.medals.bronze - a.medals.bronze;
  });
}

interface AthleteRankingModalProps {
  open: boolean;
  onClose: () => void;
  athletes: AthleteRanking[];
}

export function AthleteRankingModal({
  open,
  onClose,
  athletes,
}: AthleteRankingModalProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | AgeCategory>(
    "all"
  );
  const [page, setPage] = useState(1);

  const filtered =
    activeCategory === "all"
      ? athletes
      : athletes.filter((a) => a.ageCategory === activeCategory);

  const sorted = sortAthletes(filtered);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleCategoryChange(cat: "all" | AgeCategory) {
    setActiveCategory(cat);
    setPage(1);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6 md:p-8">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                leaderboard
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Competição Elite
              </span>
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-on-surface md:text-3xl">
              Ranking Oficial do Dojo — Temporada 2024
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="group ml-4 mt-1 shrink-0 rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-primary"
            aria-label="Fechar ranking"
          >
            <span className="material-symbols-outlined text-3xl transition-transform group-active:scale-90">
              close
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-5 md:px-8">
          <div className="flex flex-wrap gap-1 rounded-full bg-slate-200/50 p-1">
            {AGE_CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleCategoryChange(key)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors md:px-5 ${
                  activeCategory === key
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-500 hover:text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table — scrollable */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50">
                <th className="px-6 py-4 font-label text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 md:px-8">
                  Rank
                </th>
                <th className="px-6 py-4 font-label text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 md:px-8">
                  Atleta
                </th>
                <th className="px-6 py-4 font-label text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 md:px-8">
                  Faixa
                </th>
                <th className="px-4 py-4 text-center font-label text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Ouros
                </th>
                <th className="px-4 py-4 text-center font-label text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Pratas
                </th>
                <th className="px-6 py-4 text-center font-label text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 md:px-8">
                  Bronzes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-12 text-center text-sm text-slate-400"
                  >
                    Nenhum atleta encontrado nesta categoria.
                  </td>
                </tr>
              ) : (
                paginated.map((athlete, index) => {
                  const globalRank = (page - 1) * PAGE_SIZE + index + 1;
                  const belt = BELT_STYLES[athlete.belt];
                  const isFirst = globalRank === 1;

                  return (
                    <tr
                      key={athlete.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 md:px-8">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-headline text-2xl font-black ${
                              isFirst ? "text-primary" : "text-slate-300"
                            }`}
                          >
                            {String(globalRank).padStart(2, "0")}
                          </span>
                          {isFirst && (
                            <span
                              className="material-symbols-outlined text-lg text-yellow-500"
                              style={{
                                fontVariationSettings: "'FILL' 1",
                              }}
                              aria-hidden="true"
                            >
                              workspace_premium
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 md:px-8">
                        <div className="flex items-center gap-4">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                            {athlete.photoSrc ? (
                              <Image
                                src={athlete.photoSrc}
                                alt={athlete.photoAlt}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                                {athlete.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="font-headline text-lg font-bold text-on-surface">
                            {athlete.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 md:px-8">
                        <span
                          className={`rounded-sm px-3 py-1 text-[10px] font-black uppercase tracking-widest ${belt.className}`}
                        >
                          {belt.label}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center font-headline text-xl font-bold text-primary">
                        {athlete.medals.gold}
                      </td>
                      <td className="px-4 py-5 text-center font-headline text-xl font-bold text-slate-400">
                        {athlete.medals.silver}
                      </td>
                      <td className="px-6 py-5 text-center font-headline text-xl font-bold text-amber-700 md:px-8">
                        {athlete.medals.bronze}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-5 md:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Página anterior"
            >
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  p === page
                    ? "bg-primary text-white"
                    : "border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              aria-label="Próxima página"
            >
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 md:px-8"
          >
            Fechar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
