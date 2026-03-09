import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";

export function GaleriaCta() {
  return (
    <div className="relative isolate mt-16 flex w-full flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl bg-slate-900 p-8 text-white md:flex-row md:p-12 lg:p-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent" />
      <div className="flex max-w-xl flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Pronto para começar sua jornada?
        </h2>
        <p className="text-lg text-slate-300">
          Sua primeira aula experimental é totalmente gratuita. Venha visitar
          nosso dojo e conhecer o sensei.
        </p>
      </div>
      <div className="flex-shrink-0">
        <Link
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white shadow-lg shadow-red-900/20 transition-all hover:bg-red-600 hover:shadow-red-600/30"
        >
          <span className="relative z-10">Agendar Aula Grátis</span>
          <span className="relative z-10 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
