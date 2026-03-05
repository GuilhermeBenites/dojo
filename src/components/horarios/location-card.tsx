import { MapPin } from "lucide-react";
import type { Location } from "@/types/schedule";

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#2a1515]">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
        <span className="rounded-lg bg-primary/10 p-2 text-primary">
          <MapPin className="size-5" aria-hidden />
        </span>
        Onde Treinamos
      </h2>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex gap-4">
          <div className="h-auto w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Endereço
            </p>
            <p className="whitespace-pre-line text-lg font-semibold text-slate-900 dark:text-slate-100">
              {location.address}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-auto w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Contato
            </p>
            <p className="text-base text-slate-900 dark:text-slate-100">
              {location.phone}
            </p>
          </div>
        </div>
        <div className="mt-auto pt-4">
          <a
            href={location.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition-all hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <MapPin className="size-5" aria-hidden />
            Como Chegar
          </a>
        </div>
      </div>
    </div>
  );
}
