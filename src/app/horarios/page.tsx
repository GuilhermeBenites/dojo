import type { Metadata } from "next";
import { LocationCard } from "@/components/horarios/location-card";
import { MapPlaceholder } from "@/components/horarios/map-placeholder";
import { ScheduleFilter } from "@/components/horarios/schedule-filter";
import { ScheduleCta } from "@/components/horarios/schedule-cta";
import { LOCATION, SCHEDULE_GROUPS } from "@/components/horarios/horarios-data";

export const metadata: Metadata = {
  title: "Localização & Horários | Dojo Luciano dos Santos",
  description:
    "Encontre nosso dojo em São Paulo. Confira a grade de horários de treinos Infantil e Adultos. Estacionamento e vestiários disponíveis.",
  openGraph: {
    title: "Localização & Horários | Dojo Luciano dos Santos",
    description:
      "Encontre nosso dojo em São Paulo. Confira a grade de horários de treinos Infantil e Adultos. Estacionamento e vestiários disponíveis.",
    type: "website",
  },
};

export default function HorariosPage() {
  return (
    <div className="flex w-full flex-col items-center py-10 px-4 md:px-8">
      <div className="w-full max-w-[1200px] space-y-16">
        {/* 1. Page header badge + H1 */}
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Encontre seu Caminho
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Onde Treinamos &<br />
            <span className="text-primary">Horários de Treino</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Junte-se a nós em nosso dojo central. Seja você um iniciante ou um
            faixa preta avançado, temos um lugar para você no tatame.
          </p>
        </div>

        {/* 2. Location + Map grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <LocationCard location={LOCATION} />
          </div>
          <div className="lg:col-span-7">
            <MapPlaceholder />
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* 3. Schedule section */}
        <ScheduleFilter groups={SCHEDULE_GROUPS} />

        {/* 4. CTA */}
        <ScheduleCta />
      </div>
    </div>
  );
}
