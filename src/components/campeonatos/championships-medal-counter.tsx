import type { MedalCounterCard } from "@/types/championships";

interface ChampionshipsMedalCounterProps {
  card: MedalCounterCard;
}

export function ChampionshipsMedalCounter({ card }: ChampionshipsMedalCounterProps) {
  return (
    <div
      className={
        card.cardVariant === "primary"
          ? "flex flex-col items-center rounded-2xl bg-primary p-6 text-center shadow-lg shadow-primary/20"
          : "flex flex-col items-center rounded-2xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-sm"
      }
    >
      <span
        className={`material-symbols-outlined mb-2 text-4xl ${card.iconColorClass}`}
        aria-hidden="true"
      >
        {card.iconName}
      </span>
      <div className="text-4xl font-black text-white">{card.count}</div>
      <div className="mt-1 text-sm uppercase tracking-wide text-slate-300">
        {card.label}
      </div>
    </div>
  );
}
