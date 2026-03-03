import { InstructorCard } from "./instructor-card";
import type { Sensei } from "@/types/sensei";

interface InstructorsGridProps {
  instructors: Sensei[];
}

export function InstructorsGrid({ instructors }: InstructorsGridProps) {
  return (
    <section className="bg-white px-6 py-20 dark:bg-white/5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Equipe de Instrutores
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Nossa equipe é formada por profissionais altamente qualificados, cada
            um trazendo uma especialidade única para enriquecer seu aprendizado.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((sensei) => (
            <InstructorCard key={sensei.id} sensei={sensei} />
          ))}
        </div>
      </div>
    </section>
  );
}
