import type { PricingPlan } from "@/types/plans";
import { PlansPricingCard } from "./plans-pricing-card";

interface PlansPricingGridProps {
  plans: PricingPlan[];
}

export function PlansPricingGrid({ plans }: PlansPricingGridProps) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {plans.map((plan) => (
            <PlansPricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
