import { Quote, User } from "lucide-react";

const TESTIMONIALS: {
  quote: string;
  author: string;
  role: string;
}[] = [
  {
    quote:
      "Meu filho melhorou muito a concentração na escola depois que começou a treinar. O Sensei Luciano é incrível com as crianças, ensinando respeito e disciplina de forma divertida.",
    author: "Ana Paula Silva",
    role: "Mãe de aluno",
  },
  {
    quote:
      "Comecei o karate aos 40 anos buscando uma atividade física e encontrei uma filosofia de vida. Perdi peso, ganhei confiança e fiz grandes amigos no dojo.",
    author: "Ricardo Oliveira",
    role: "Aluno Faixa Verde",
  },
  {
    quote:
      "A defesa pessoal ensinada aqui é prática e eficiente. Me sinto muito mais segura no meu dia a dia. Recomendo para todas as mulheres!",
    author: "Mariana Costa",
    role: "Aluna Iniciante",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="w-full border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-[#1a0b0b]"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            O que nossos alunos dizem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Histórias reais de transformação, disciplina e superação de quem vive
            o Karate no dia a dia.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(({ quote, author, role }) => (
            <div
              key={author}
              className="relative rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800"
            >
              <div className="absolute -top-4 left-8 rounded-full bg-primary p-2 text-white shadow-lg">
                <Quote className="size-5" aria-hidden />
              </div>
              <blockquote className="mt-4">
                <p className="text-base italic leading-relaxed text-slate-700 dark:text-slate-300">
                  {quote}
                </p>
              </blockquote>
              <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6 dark:border-slate-700">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700">
                  <User className="size-5" aria-hidden />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {author}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
