import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { Button } from "@/components/ui/button";
import { Plus, Star } from "lucide-react";
import { ChampionshipsList } from "@/components/admin/cms/championships/championships-list";
import { ChampionshipSheet } from "@/components/admin/cms/championships/championship-sheet";

export const metadata: Metadata = {
  title: "Campeonatos | Admin Dojo",
};

interface PageProps {
  searchParams: Promise<{ action?: string; id?: string }>;
}

export default async function ChampionshipsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: championships } = await supabase
    .from("championships")
    .select("*")
    .order("event_date", { ascending: false });

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content" label="Conteúdo" />
      <CmsPageHeader
        title="Campeonatos"
        description="Eventos e resultados"
        action={
          <div className="flex gap-2">
            <Link href="/admin/content/championships/hall-of-fame">
              <Button size="sm" variant="outline">
                <Star className="size-4" />
                Hall da Fama
              </Button>
            </Link>
            <Link href="/admin/content/championships?action=new">
              <Button size="sm">
                <Plus className="size-4" />
                Novo Campeonato
              </Button>
            </Link>
          </div>
        }
      />
      <ChampionshipsList championships={championships ?? []} />
      <ChampionshipSheet
        action={params.action}
        id={params.id}
        championships={championships ?? []}
      />
    </div>
  );
}
