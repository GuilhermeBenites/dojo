import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Sensei } from "@/types/sensei";

interface InstructorCardProps {
  sensei: Sensei;
}

export function InstructorCard({ sensei }: InstructorCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50 transition-all hover:border-primary/20 hover:shadow-lg dark:border-white/5 dark:bg-[#2a1a1a]">
      <div className="relative aspect-square overflow-hidden bg-slate-200">
        <Image
          src={sensei.photoUrl}
          alt={sensei.photoAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
          {sensei.specialty}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
          {sensei.name}
        </h3>
        <p className="mb-4 text-sm font-medium text-primary">
          {sensei.rank}
        </p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {sensei.bio}
        </p>
        <div className="mt-auto pt-6">
          <Link
            href={sensei.profileHref}
            className="inline-flex items-center text-sm font-bold text-slate-900 transition-colors hover:text-primary dark:text-white"
          >
            Ver Perfil
            <ArrowRight className="ml-1 size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
