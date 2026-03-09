import { BELT_EXAMS } from "./planos-data";

export function PlansBeltExam() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="material-symbols-outlined text-3xl text-primary"
          aria-hidden="true"
        >
          military_tech
        </span>
        <h3 className="text-2xl font-bold text-neutral-dark">Exame de Faixa</h3>
      </div>
      <div className="space-y-4">
        {BELT_EXAMS.map((row) => (
          <div
            key={row.id}
            className={`flex flex-col justify-between p-3 sm:flex-row sm:items-center ${
              row.highlighted
                ? "rounded-lg bg-slate-50"
                : "rounded-lg border border-slate-100"
            }`}
          >
            <span className="font-semibold text-neutral-dark">{row.belt}</span>
            <div className="text-right">
              <span className="block font-bold text-primary">{row.price}</span>
              <span className="text-xs text-slate-500">{row.familyPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
