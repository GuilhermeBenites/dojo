import { CalendarDays } from "lucide-react";
import type { DayGroup } from "@/types/schedule";

interface ScheduleDayCardProps {
  group: DayGroup;
}

export function ScheduleDayCard({ group }: ScheduleDayCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md dark:border-slate-800 dark:bg-[#2a1515]">
      <div
        className={`h-2 w-full ${group.isPrimary ? "bg-primary" : "bg-slate-800 dark:bg-slate-700"}`}
      />
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2 ${group.isPrimary ? "bg-primary/10 text-primary" : "bg-slate-800/10 text-slate-800 dark:bg-slate-100/10 dark:text-slate-200"}`}
            >
              <CalendarDays className="size-5" aria-hidden />
            </div>
            <h3 className="text-xl font-bold md:text-2xl">{group.label}</h3>
          </div>
        </div>
        <div className="space-y-4">
          {group.slots.map((slot, i) => (
            <div
              key={`${slot.time}-${i}`}
              className="flex flex-col justify-between gap-2 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 sm:flex-row sm:items-center"
            >
              <span className="min-w-[130px] rounded bg-slate-100 px-3 py-1 text-center text-lg font-bold text-slate-900 dark:bg-slate-800 dark:text-white">
                {slot.time}
              </span>
              <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
                {slot.sensei}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-xs italic text-slate-400">
            * Chegar com 10 minutos de antecedência.
          </p>
        </div>
      </div>
    </article>
  );
}
