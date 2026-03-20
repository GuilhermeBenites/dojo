import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  BeltExamRow as PlansBeltExam,
  DropInItem,
  FaqItem,
  PricingPlan,
} from "@/types/plans";
import type {
  BeltExamRow,
  DropInClassRow,
  FaqItemRow,
  PlanRow,
} from "@/types/database";

function toPricingPlan(row: PlanRow): PricingPlan {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    recommended: row.recommended,
    tiers: row.tiers as PricingPlan["tiers"],
  };
}

function toBeltExam(row: BeltExamRow): PlansBeltExam {
  return {
    id: row.id,
    belt: row.belt,
    price: row.price,
    familyPrice: row.family_price,
    highlighted: row.highlighted,
  };
}

function toDropIn(row: DropInClassRow): DropInItem {
  return { id: row.id, label: row.label, price: row.price };
}

function toFaqItem(row: FaqItemRow): FaqItem {
  return { id: row.id, question: row.question, answer: row.answer };
}

export async function getPlans(): Promise<Array<{ id: string; title: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("plans")
    .select("id, title")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return (data ?? []) as Array<{ id: string; title: string }>;
}

export async function getPlansPageData(): Promise<{
  plans: PricingPlan[];
  beltExams: PlansBeltExam[];
  dropIn: DropInItem[];
  faq: FaqItem[];
}> {
  const supabase = await createSupabaseServerClient();

  const [plansRes, beltRes, dropInRes, faqRes] = await Promise.all([
    supabase.from("plans").select("*").order("display_order"),
    supabase.from("belt_exams").select("*").order("display_order"),
    supabase.from("drop_in_classes").select("*").order("display_order"),
    supabase.from("faq_items").select("*").order("display_order"),
  ]);

  const hasError =
    plansRes.error ||
    beltRes.error ||
    dropInRes.error ||
    faqRes.error;

  const noData =
    !plansRes.data?.length &&
    !beltRes.data?.length &&
    !dropInRes.data?.length &&
    !faqRes.data?.length;

  if (hasError || noData) {
    const {
      PRICING_PLANS,
      BELT_EXAMS,
      DROP_IN_CLASSES,
      FAQ_ITEMS,
    } = await import("@/components/planos/planos-data");
    return {
      plans: PRICING_PLANS,
      beltExams: BELT_EXAMS,
      dropIn: DROP_IN_CLASSES,
      faq: FAQ_ITEMS,
    };
  }

  return {
    plans: (plansRes.data ?? []).map(toPricingPlan),
    beltExams: (beltRes.data ?? []).map(toBeltExam),
    dropIn: (dropInRes.data ?? []).map(toDropIn),
    faq: (faqRes.data ?? []).map(toFaqItem),
  };
}
