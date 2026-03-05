"use client";

import { useState } from "react";
import { ScheduleDayCard } from "./schedule-day-card";
import type { DayGroup, ScheduleCategory } from "@/types/schedule";

interface ScheduleFilterProps {
  groups: DayGroup[];
}

const CATEGORIES: ScheduleCategory[] = ["Infantil", "Adultos"];

export function ScheduleFilter({ groups }: ScheduleFilterProps) {
  const [activeCategory, setActiveCategory] =
    useState<ScheduleCategory>("Infantil");

  const filteredGroups = groups.filter((g) => g.category === activeCategory);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
            Grade de Horários
          </h2>
          <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Confira nossa grade completa de treinos e instrutores.
          </p>
        </div>
        <div className="flex self-start rounded-lg bg-slate-100 p-1 md:self-auto dark:bg-slate-800">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-6 py-2 text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-white text-primary shadow-sm ring-1 ring-black/5 dark:bg-[#2a1515] dark:ring-white/10"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
              aria-pressed={activeCategory === cat}
              aria-label={`Ver horários ${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredGroups.map((group) => (
          <ScheduleDayCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
