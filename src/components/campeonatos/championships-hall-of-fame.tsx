import Image from "next/image";
import { HALL_OF_FAME } from "./campeonatos-data";

export function ChampionshipsHallOfFame() {
  return (
    <section className="bg-background-light py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-neutral-dark lg:text-4xl">
              Hall da Fama
            </h2>
            <p className="mt-2 text-neutral-dark/70">
              Nossos atletas de destaque e suas maiores conquistas.
            </p>
          </div>
          <a
            href="#"
            className="hidden items-center gap-1 font-semibold text-primary hover:underline md:flex"
          >
            Ver todos os atletas
            <span
              className="material-symbols-outlined text-base"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HALL_OF_FAME.map((athlete) => (
            <div
              key={athlete.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Image
                src={athlete.photoSrc}
                alt={athlete.photoAlt}
                fill
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-lg font-bold leading-tight text-white">
                  {athlete.name}
                </p>
                <p
                  className={`mt-1 text-sm font-semibold ${athlete.achievementColorClass}`}
                >
                  {athlete.achievement}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
