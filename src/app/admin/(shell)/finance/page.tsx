import type { Metadata } from "next";
import { getStudentsForFinance } from "@/services/students";
import { getPlans } from "@/services/plans";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { PaymentStatusTable } from "@/components/admin/finance/payment-status-table";

export const metadata: Metadata = { title: "Financeiro | Admin Dojo" };

export default async function FinancePage() {
  const [students, plans] = await Promise.all([
    getStudentsForFinance(),
    getPlans(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <CmsPageHeader
        title="Financeiro"
        description="Acompanhe o status de pagamento dos alunos ativos"
      />
      <PaymentStatusTable students={students} plans={plans} />
    </div>
  );
}
