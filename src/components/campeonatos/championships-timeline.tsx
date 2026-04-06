"use client";

import { useState } from "react";
import type { ChampionshipEvent } from "@/types/championships";
import { ChampionshipsEventCard } from "./championships-event-card";

interface ChampionshipsTimelineProps {
  events: ChampionshipEvent[];
}

export function ChampionshipsTimeline({ events }: ChampionshipsTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(2);
  const [futureExpanded, setFutureExpanded] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const futureEvents = events
    .filter((e) => e.eventDateIso >= today)
    .sort((a, b) => a.eventDateIso.localeCompare(b.eventDateIso));

  const pastEvents = events
    .filter((e) => e.eventDateIso < today)
    .sort((a, b) => b.eventDateIso.localeCompare(a.eventDateIso));

  const visiblePast = pastEvents.slice(0, visibleCount);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Future events collapsible */}
        {futureEvents.length > 0 && (
          <div className="mb-14">
            <button
              type="button"
              onClick={() => setFutureExpanded((v) => !v)}
              className="mb-6 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 px-6 py-4 text-left transition-colors hover:bg-primary/10"
              aria-expanded={futureExpanded}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    event
                  </span>
                </span>
                <div>
                  <h2 className="text-2xl font-black text-neutral-dark lg:text-3xl">
                    Próximos Campeonatos
                  </h2>
                  <p className="text-sm text-neutral-dark/60">
                    {futureEvents.length} campeonato{futureEvents.length !== 1 ? "s" : ""} agendado{futureEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <span
                className={`material-symbols-outlined text-primary transition-transform duration-300 ${futureExpanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                expand_more
              </span>
            </button>

            {futureExpanded && (
              <div className="relative pl-8 md:pl-0">
                <div
                  className="absolute left-8 top-0 bottom-0 hidden w-0.5 bg-primary/20 md:block"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-10">
                  {futureEvents.map((event, index) => (
                    <ChampionshipsEventCard
                      key={event.id}
                      event={event}
                      isMostRecent={index === 0}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Past events */}
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <span className="material-symbols-outlined" aria-hidden="true">
              history
            </span>
          </span>
          <h2 className="text-3xl font-black text-neutral-dark lg:text-4xl">
            Histórico de Campeonatos
          </h2>
        </div>

        <div className="relative pl-8 md:pl-0">
          {/* Decorative vertical line */}
          <div
            className="absolute left-8 top-0 bottom-0 hidden w-0.5 bg-slate-200 md:block"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10">
            {visiblePast.map((event, index) => (
              <ChampionshipsEventCard
                key={event.id}
                event={event}
                isMostRecent={index === 0}
              />
            ))}
          </div>

          {visibleCount < pastEvents.length && (
            <div className="mt-10 flex justify-center md:pl-24">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + 1, pastEvents.length))
                }
                className="flex items-center gap-2 rounded-lg border-2 border-slate-200 px-6 py-3 font-bold text-neutral-dark transition-colors hover:border-primary hover:text-primary"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  expand_more
                </span>
                Carregar mais resultados
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
