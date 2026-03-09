"use client";

import { useState } from "react";
import type { ChampionshipEvent } from "@/types/championships";
import { ChampionshipsEventCard } from "./championships-event-card";

interface ChampionshipsTimelineProps {
  events: ChampionshipEvent[];
}

export function ChampionshipsTimeline({ events }: ChampionshipsTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(2);
  const visibleEvents = events.slice(0, visibleCount);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            {visibleEvents.map((event, index) => (
              <ChampionshipsEventCard
                key={event.id}
                event={event}
                isMostRecent={index === 0}
              />
            ))}
          </div>

          {visibleCount < events.length && (
            <div className="mt-10 flex justify-center md:pl-24">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + 1, events.length))
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
