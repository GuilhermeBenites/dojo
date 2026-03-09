import Image from "next/image";
import { MEDAL_COUNTER_CARDS } from "./campeonatos-data";
import { ChampionshipsMedalCounter } from "./championships-medal-counter";

export function ChampionshipsHero() {
  return (
    <section className="relative overflow-hidden bg-background-dark py-16 text-white lg:py-24">
      {/* Texture overlay — decorative */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <Image
          src="/images/texture-dark.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      {/* Gradient overlay — decorative */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background-dark/60 to-background-dark/95"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5">
          <span className="text-sm font-bold uppercase tracking-widest text-white">
            Resultados Oficiais
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
          Nossas Conquistas <span className="text-primary">e Glórias</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-12 max-w-2xl text-lg text-slate-300">
          Celebrando a dedicação, o suor e as vitórias dos nossos atletas nos
          tatames do Brasil e do mundo. Cada medalha conta uma história de
          superação.
        </p>

        {/* Medal counters: 2 cols on mobile, 4 on lg */}
        <div className="grid w-full max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
          {MEDAL_COUNTER_CARDS.map((card) => (
            <ChampionshipsMedalCounter key={card.label} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
