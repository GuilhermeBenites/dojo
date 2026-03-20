import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getBirthdaysThisMonth } from "@/services/students";
import { getDashboardStats, getRecentLeads } from "@/services/dashboard";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { RecentLeadsList } from "@/components/admin/dashboard/recent-leads-list";

export const metadata: Metadata = { title: "Dashboard | Admin Dojo" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [birthdays, recentLeads] = await Promise.all([
    getBirthdaysThisMonth(),
    getRecentLeads(5),
  ]);

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
          label="Novos Leads (mês)"
          value={stats.newLeadsThisMonth}
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

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Leads Recentes</h2>
          <Link
            href="/admin/finance"
            className="text-sm text-muted-foreground hover:underline"
          >
            Ver financeiro →
          </Link>
        </div>
        <RecentLeadsList leads={recentLeads} />
      </div>
    </div>
  );
}
