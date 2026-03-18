import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard | Admin Dojo" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Bem-vindo, {user?.email}
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Resumo administrativo"
      >
        {[
          { label: "Alunos Ativos", value: "—" },
          { label: "Novos Leads", value: "—" },
          { label: "Campeonatos", value: "—" },
          { label: "Receita (mês)", value: "—" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card p-5 flex flex-col gap-1"
          >
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {label}
            </span>
            <span className="text-2xl font-bold text-card-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
