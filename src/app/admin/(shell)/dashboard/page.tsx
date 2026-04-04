import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getBirthdaysThisMonth } from "@/services/students";
import { getDashboardStats } from "@/services/dashboard";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";

export const metadata: Metadata = { title: "Dashboard | Admin Dojo" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const birthdays = await getBirthdaysThisMonth();

  const stats = await getDashboardStats(birthdays.length);

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
        <KpiCard
          label="Alunos Ativos"
          value={stats.activeStudents}
          href="/admin/students"
        />
        <KpiCard
          label="Aniversariantes"
          value={stats.birthdaysThisMonth}
          href="/admin/students"
          description="este mês"
        />
        <KpiCard
          label="Inadimplentes"
          value={stats.overduePayments}
          href="/admin/finance"
          variant={stats.overduePayments > 0 ? "danger" : "default"}
        />
      </div>

    </div>
  );
}
