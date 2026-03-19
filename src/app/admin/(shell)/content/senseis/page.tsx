import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SenseisList } from "@/components/admin/cms/senseis/senseis-list";
import { SenseiSheet } from "@/components/admin/cms/senseis/sensei-sheet";

export const metadata: Metadata = {
  title: "Senseis | Admin Dojo",
};

interface PageProps {
  searchParams: Promise<{ action?: string; id?: string }>;
}

export default async function SenseisPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: senseis } = await supabase
    .from("senseis")
    .select("*")
    .order("display_order");

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content" label="Conteúdo" />
      <CmsPageHeader
        title="Senseis"
        description="Instrutores e perfis"
        action={
          <Link href="/admin/content/senseis?action=new">
            <Button size="sm">
              <Plus className="size-4" />
              Novo Sensei
            </Button>
          </Link>
        }
      />
      <SenseisList senseis={senseis ?? []} />
      <SenseiSheet
        action={params.action}
        id={params.id}
        senseis={senseis ?? []}
      />
    </div>
  );
}
