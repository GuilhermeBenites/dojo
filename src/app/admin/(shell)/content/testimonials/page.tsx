import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CmsPageHeader } from "@/components/admin/cms/cms-page-header";
import { CmsBackLink } from "@/components/admin/cms/cms-back-link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TestimonialsList } from "@/components/admin/cms/testimonials/testimonials-list";
import { TestimonialSheet } from "@/components/admin/cms/testimonials/testimonial-sheet";

export const metadata: Metadata = {
  title: "Depoimentos | Admin Dojo",
};

interface PageProps {
  searchParams: Promise<{ action?: string; id?: string }>;
}

export default async function TestimonialsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order");

  return (
    <div className="space-y-6">
      <CmsBackLink href="/admin/content" label="Conteúdo" />
      <CmsPageHeader
        title="Depoimentos"
        description="Avaliações de alunos"
        action={
          <Link href="/admin/content/testimonials?action=new">
            <Button size="sm">
              <Plus className="size-4" />
              Novo Depoimento
            </Button>
          </Link>
        }
      />
      <TestimonialsList testimonials={testimonials ?? []} />
      <TestimonialSheet
        action={params.action}
        id={params.id}
        testimonials={testimonials ?? []}
      />
    </div>
  );
}
