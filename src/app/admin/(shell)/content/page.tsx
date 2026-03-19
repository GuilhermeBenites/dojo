import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Images,
  Trophy,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Conteúdo | Admin Dojo",
  description: "Gerenciar conteúdo do site",
};

const SECTIONS = [
  {
    title: "Horários",
    href: "/admin/content/schedules",
    icon: CalendarDays,
    description: "Turmas e horários das aulas",
  },
  {
    title: "Senseis",
    href: "/admin/content/senseis",
    icon: Users,
    description: "Instrutores e perfis",
  },
  {
    title: "Galeria",
    href: "/admin/content/gallery",
    icon: Images,
    description: "Fotos do dojo",
  },
  {
    title: "Campeonatos",
    href: "/admin/content/championships",
    icon: Trophy,
    description: "Eventos e resultados",
  },
  {
    title: "Depoimentos",
    href: "/admin/content/testimonials",
    icon: MessageSquare,
    description: "Avaliações de alunos",
  },
  {
    title: "Planos",
    href: "/admin/content/plans",
    icon: CreditCard,
    description: "Preços e planos",
  },
] as const;

export default function ContentHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conteúdo</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie todo o conteúdo público do site
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(({ title, href, icon: Icon, description }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">
                  Gerenciar →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
