import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { ResultsTable } from "@/components/admin/cms/championships/results-table";
import { ResultRowForm } from "@/components/admin/cms/championships/result-row-form";

export const metadata: Metadata = {
  title: "Resultados | Admin Dojo",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChampionshipResultsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: championship } = (await supabase
    .from("championships")
    .select("*")
    .eq("id", id)
    .single()) as { data: { name: string; event_date: string; location: string } | null };
  const { data: results } = await supabase
    .from("championship_results")
    .select("*")
    .eq("championship_id", id)
    .order("placement");

  if (!championship) {
    return (
      <div className="space-y-6">
        <CmsBackLink href="/admin/content/championships" label="Campeonatos" />
        <p className="text-muted-foreground">Campeonato não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content/championships" label="Campeonatos" />
      <div>
        <h1 className="text-2xl font-bold">{championship.name}</h1>
        <p className="text-muted-foreground">
          {championship.event_date} • {championship.location}
        </p>
      </div>
      <ResultsTable results={results ?? []} championshipId={id} />
      <ResultRowForm championshipId={id} />
    </div>
  );
}
