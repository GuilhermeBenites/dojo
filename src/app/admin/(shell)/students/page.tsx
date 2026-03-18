import type { Metadata } from "next";
export const metadata: Metadata = { title: "Alunos | Admin Dojo" };
export default function StudentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Alunos</h1>
      <p className="text-muted-foreground mt-2">Em breve.</p>
    </div>
  );
}
