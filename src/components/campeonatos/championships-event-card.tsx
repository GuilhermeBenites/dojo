import type { ChampionshipEvent, IndividualResult } from "@/types/championships";

const placementIconColor = (placement: 1 | 2 | 3) =>
  placement === 1
    ? "text-yellow-400"
    : placement === 2
      ? "text-slate-400"
      : "text-orange-400";

const placementLabel = (placement: 1 | 2 | 3) =>
  placement === 1 ? "1º Lugar" : placement === 2 ? "2º Lugar" : "3º Lugar";

interface ChampionshipsEventCardProps {
  event: ChampionshipEvent;
  isMostRecent: boolean;
}

export function ChampionshipsEventCard({
  event,
  isMostRecent,
}: ChampionshipsEventCardProps) {
  return (
    <div className="relative pl-8 md:pl-24">
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-6 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white shadow md:flex ${
          isMostRecent ? "bg-primary" : "bg-slate-400"
        }`}
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Card header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 p-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-xs font-bold ${
                  event.status === "Finalizado"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {event.status}
              </span>
              <span className="text-sm font-medium text-neutral-dark/60">
                {event.date}
              </span>
            </div>
            <h3 className="text-xl font-bold text-neutral-dark">{event.title}</h3>
            <p className="mt-1 text-sm text-neutral-dark/60">{event.location}</p>
          </div>
          {/* Medal summary */}
          <div className="flex gap-4">
            <div className="text-center">
              <span className="block text-2xl font-bold text-yellow-500">
                {event.medals.gold}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Ouros
              </span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-slate-400">
                {event.medals.silver}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Pratas
              </span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-orange-400">
                {event.medals.bronze}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Bronzes
              </span>
            </div>
          </div>
        </div>

        {/* Individual results */}
        {event.results.length > 0 && (
          <div className="p-6">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-dark">
              Resultados Individuais
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {event.results.map((result: IndividualResult, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <span
                    className={`material-symbols-outlined ${placementIconColor(result.placement)}`}
                    aria-hidden="true"
                  >
                    military_tech
                  </span>
                  <div>
                    <p className="text-sm font-bold text-neutral-dark">
                      {result.athleteName}
                    </p>
                    <p className="text-xs text-neutral-dark/60">
                      {placementLabel(result.placement)} · {result.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
