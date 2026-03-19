import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getStudents,
  getStudentById,
  getBirthdaysThisMonth,
} from "@/services/students";

import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { Button } from "@/components/ui/button";
import { BirthdayPanel } from "@/components/admin/students/birthday-panel";
import { StudentsFilterBar } from "@/components/admin/students/students-filter-bar";
import { StudentsList } from "@/components/admin/students/students-list";
import { StudentSheet } from "@/components/admin/students/student-sheet";

export const metadata: Metadata = {
  title: "Alunos | Admin Dojo",
};

interface StudentsPageProps {
  searchParams: Promise<{
    search?: string;
    belt?: string;
    active?: string;
    action?: string;
    id?: string;
  }>;
}

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const params = await searchParams;
  const { search, belt, active, action, id } = params;

  const supabase = await createSupabaseServerClient();

  const [students, birthdays, { data: plansData }] = await Promise.all([
    getStudents({
      search,
      belt,
      active: active as "active" | "inactive" | "all" | undefined,
    }),
    getBirthdaysThisMonth(),
    supabase.from("plans").select("id, title").order("display_order"),
  ]);

  const plans = plansData || [];

  let student = null;
  if (action === "edit" && id) {
    student = await getStudentById(id);
  }

  const isSheetOpen = action === "new" || action === "edit";

  return (
    <>
      <CmsPageHeader
        title="Alunos"
        description="Gerencie os alunos do dojo"
        action={
          <Link href="?action=new">
            <Button>+ Novo Aluno</Button>
          </Link>
        }
      />

      <div className="space-y-6">
        <BirthdayPanel birthdays={birthdays} />

        <StudentsFilterBar
          initialSearch={search}
          initialBelt={belt}
          initialActive={active}
        />

        <StudentsList students={students} />
      </div>

      <StudentSheet isOpen={isSheetOpen} student={student} plans={plans} />
    </>
  );
}
