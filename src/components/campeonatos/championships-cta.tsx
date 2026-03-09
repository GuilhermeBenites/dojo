import { WHATSAPP_URL } from "@/lib/constants";

export function ChampionshipsCta() {
  return (
    <section className="bg-primary/5 py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-black text-neutral-dark lg:text-4xl">
          Quer fazer parte dessas conquistas?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-dark/70">
          Venha treinar com campeões e descubra o seu potencial. A primeira aula
          é por nossa conta.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary/90"
          >
            Agendar Aula Experimental
          </a>
          <a
            href="/senseis"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-8 py-3 font-bold text-neutral-dark transition-colors hover:bg-slate-50"
          >
            Conheça nossa História
          </a>
        </div>
      </div>
    </section>
  );
}
