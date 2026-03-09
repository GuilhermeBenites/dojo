import { WHATSAPP_URL } from "@/lib/constants";
import type { PricingPlan } from "@/types/plans";

interface PlansPricingCardProps {
  plan: PricingPlan;
}

export function PlansPricingCard({ plan }: PlansPricingCardProps) {
  return (
    <div
      className={
        plan.recommended
          ? "relative z-10 flex flex-col gap-4 rounded-xl border-2 border-primary bg-white p-6 shadow-lg md:-translate-y-2"
          : "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      }
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          Recomendado
        </div>
      )}

      <div className="border-b border-slate-100 pb-4 pt-2">
        <h2 className="text-2xl font-bold text-neutral-dark">{plan.title}</h2>
        <p className="text-sm text-neutral-dark/60">{plan.subtitle}</p>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {plan.tiers.map((tier, index) => (
          <div
            key={tier.label}
            className={`flex items-center justify-between py-2 ${
              index < plan.tiers.length - 1
                ? "border-b border-dashed border-slate-200"
                : ""
            }`}
          >
            <span className="font-medium text-neutral-dark/80">{tier.label}</span>
            {tier.isMonthlyHighlight ? (
              <span className="text-lg font-bold text-primary">{tier.price}</span>
            ) : (
              <span className="font-bold text-neutral-dark">
                {tier.price}
                {tier.suffix && (
                  <span className="text-xs font-normal text-slate-500">
                    {tier.suffix}
                  </span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
      >
        Escolher Plano
      </a>
    </div>
  );
}
