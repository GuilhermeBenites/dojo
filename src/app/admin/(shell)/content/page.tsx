import type { Metadata } from "next";
export const metadata: Metadata = { title: "Conteúdo | Admin Dojo" };
export default function ContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Conteúdo</h1>
      <p className="text-muted-foreground mt-2">Em breve — Step 11.</p>
    </div>
  );
}
