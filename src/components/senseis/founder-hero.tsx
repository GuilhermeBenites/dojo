import Image from "next/image";
import Link from "next/link";
import { Quote, Mail } from "lucide-react";
import type { FounderSensei } from "@/types/sensei";

interface FounderHeroProps {
  founder: FounderSensei;
}

export function FounderHero({ founder }: FounderHeroProps) {
  return (
    <section className="relative px-6 py-16 md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Mestre & Fundador
          </span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
            {founder.name}
          </h2>
          <div className="mt-4 h-1 w-24 rounded-full bg-primary" />
        </div>

        <div className="grid gap-12 items-center lg:grid-cols-12 lg:gap-16">
          {/* Image Column */}
          <div className="relative lg:col-span-5 lg:order-last">
            <div
              className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-primary/20 to-transparent opacity-70 blur-2xl"
              aria-hidden
            />
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
              <Image
                src={founder.photoUrl}
                alt={founder.photoAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <p className="text-lg font-bold">{founder.rank}</p>
                <p className="text-sm opacity-90">{founder.organization}</p>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div className="prose prose-lg dark:prose-invert">
              {founder.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <blockquote className="rounded-r-lg border-l-4 border-primary bg-white p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:bg-white/5">
              <div className="mb-4 text-primary">
                <Quote className="size-10" aria-hidden />
              </div>
              <p className="text-xl font-medium italic text-slate-900 dark:text-white">
                {founder.quote}
              </p>
              <footer className="mt-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                — Sensei Luciano
              </footer>
            </blockquote>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
              >
                Conheça a História Completa
              </Link>
              <Link
                href="mailto:contato@dojo.com.br"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary/20 bg-transparent px-8 py-4 text-base font-bold text-slate-900 transition-all hover:border-primary hover:bg-primary/5 dark:text-white"
              >
                <Mail className="size-5" aria-hidden />
                Fale com o Mestre
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
