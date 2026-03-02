import Link from "next/link";
import { BadgeCheck, Users, Shield, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BENEFITS: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: BadgeCheck,
    title: "Mestres Certificados",
    description:
      "Instrutores com anos de experiência e reconhecimento internacional, dedicados ao seu crescimento técnico e pessoal.",
  },
  {
    icon: Users,
    title: "Ambiente Familiar",
    description:
      "Aulas para crianças, adultos e famílias inteiras treinarem juntas em um clima de respeito e camaradagem.",
  },
  {
    icon: Shield,
    title: "Defesa Pessoal",
    description:
      "Técnicas eficientes para aumentar sua confiança e segurança no dia a dia, preparadas para situações reais.",
  },
];

export function BenefitsSection() {
  return (
    <section id="sobre" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Por que treinar conosco?
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Oferecemos um ambiente seguro e inspirador para desenvolver suas
            habilidades, respeitando seu ritmo e objetivos.
          </p>
        </div>
        <div className="hidden md:block">
          <Link
            href="/senseis"
            className="group flex items-center gap-1 font-bold text-primary hover:text-red-700"
          >
            Saiba mais sobre a metodologia
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-800 dark:bg-[#1a0b0b] dark:hover:border-primary/30"
          >
            <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon className="size-6" aria-hidden />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
