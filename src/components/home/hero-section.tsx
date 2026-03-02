import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDw0rBmeDJKEAE_9pU7imunT_IbBvek4_fY79Y6UMaYlwSW33ypvi5tNGYhYCUuzTt14uCA2iRsDsZRK95Mru0-wiNwPqcVpqdO6NipcyKZelh-8F0nqWMTdXCpeD7XhGbmxCBY429QNVSM9amNuQpscqbFiPiLpt0jJ4sp5xGX_jQkaud5i5LVfd9mEi-p-B75yAuLtqu71Mm_TH6paenxhfvCZ4iD34o6TjkmUbyoLE8NaqCYWG4JDOyjXnCbKwAXaOEwFraEq4SC";

export function HeroSection() {
  return (
    <section id="inicio" className="relative w-full">
      <div className="mx-auto max-w-[1280px] p-4 sm:p-6 lg:p-8">
        <div className="relative min-h-[500px] overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={HERO_IMAGE_URL}
              alt="Karate practitioner performing a high kick outdoors"
              fill
              priority
              className="object-cover object-center opacity-80"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
              aria-hidden
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex min-h-[500px] max-w-3xl flex-col items-start justify-center px-6 py-16 sm:px-12 lg:px-16">
            <span className="mb-4 inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Tradição & Disciplina
            </span>
            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Dojo Luciano dos Santos Karate
            </h1>
            <h2 className="mb-6 text-2xl font-bold text-primary sm:text-3xl">
              Descubra sua força interior
            </h2>
            <p className="mb-8 max-w-2xl text-lg font-medium leading-relaxed text-slate-200 sm:text-xl">
              Disciplina, foco e autodefesa para todas as idades. Transforme
              sua mente e corpo com a tradição do verdadeiro Karate.
            </p>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Link
                href="#"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-red-700"
              >
                Agende sua Aula Grátis
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/planos"
                className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Conheça nossos planos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
