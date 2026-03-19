import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SchedulesList } from "@/components/admin/cms/schedules/schedules-list";
import { ScheduleSheet } from "@/components/admin/cms/schedules/schedule-sheet";

export const metadata: Metadata = {
  title: "Horários | Admin Dojo",
};

interface PageProps {
  searchParams: Promise<{ action?: string; id?: string }>;
}

export default async function SchedulesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
    .order("display_order");

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content" label="Conteúdo" />
      <CmsPageHeader
        title="Horários"
        description="Turmas e horários das aulas"
        action={
          <Link href="/admin/content/schedules?action=new">
            <Button size="sm">
              <Plus className="size-4" />
              Novo Horário
            </Button>
          </Link>
        }
      />
      <SchedulesList schedules={schedules ?? []} />
      <ScheduleSheet
        action={params.action}
        id={params.id}
        schedules={schedules ?? []}
      />
    </div>
  );
}
