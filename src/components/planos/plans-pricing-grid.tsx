import { PRICING_PLANS } from "./planos-data";
import { PlansPricingCard } from "./plans-pricing-card";

export function PlansPricingGrid() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
          {PRICING_PLANS.map((plan) => (
            <PlansPricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
