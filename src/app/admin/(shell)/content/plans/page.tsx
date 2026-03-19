import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { PlansTabs } from "@/components/admin/cms/plans/plans-tabs";

export const metadata: Metadata = {
  title: "Planos | Admin Dojo",
};

export default async function PlansPage() {
  const supabase = await createSupabaseServerClient();
  const [plansRes, beltExamsRes, dropInRes, faqRes] = await Promise.all([
    supabase.from("plans").select("*").order("display_order"),
    supabase.from("belt_exams").select("*").order("display_order"),
    supabase.from("drop_in_classes").select("*").order("display_order"),
    supabase.from("faq_items").select("*").order("display_order"),
  ]);

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content" label="Conteúdo" />
      <CmsPageHeader
        title="Planos"
        description="Preços e planos"
      />
      <PlansTabs
        plans={plansRes.data ?? []}
        beltExams={beltExamsRes.data ?? []}
        dropIn={dropInRes.data ?? []}
        faqItems={faqRes.data ?? []}
      />
    </div>
  );
}
