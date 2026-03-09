import { DROP_IN_CLASSES } from "./planos-data";

export function PlansDropIn() {
  return (
    <div className="flex flex-col gap-6">
      {/* Drop-in classes */}
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="material-symbols-outlined text-3xl text-primary"
            aria-hidden="true"
          >
            sports_kabaddi
          </span>
          <h3 className="text-2xl font-bold text-neutral-dark">Aulas Avulsas</h3>
        </div>
        <div className="space-y-4">
          {DROP_IN_CLASSES.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 ${
                index < DROP_IN_CLASSES.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >
              <span className="max-w-[200px] font-medium text-neutral-dark/80">
                {item.label}
              </span>
              <span className="text-xl font-bold text-primary">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="rounded-xl bg-slate-900 p-8 text-white shadow-sm">
        <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <span
            className="material-symbols-outlined text-primary"
            aria-hidden="true"
          >
            credit_card
          </span>
          Formas de Pagamento
        </h4>
        <p className="mb-4 text-sm text-slate-300">
          Aceitamos cartões de crédito, débito, PIX e dinheiro.
        </p>
        <div className="flex gap-4 font-mono text-xs uppercase tracking-wide text-primary">
          <span>Trimestral: 2x</span>
          <span>Semestral: 3x</span>
          <span>Anual: 6x</span>
        </div>
      </div>
    </div>
  );
}
