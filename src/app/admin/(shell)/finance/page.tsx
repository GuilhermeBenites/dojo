import type { Metadata } from "next";
export const metadata: Metadata = { title: "Financeiro | Admin Dojo" };
export default function FinancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Financeiro</h1>
      <p className="text-muted-foreground mt-2">Em breve.</p>
    </div>
  );
}
