import Link from "next/link";

import { WHATSAPP_URL } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-7xl font-black text-primary">404</p>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground max-w-md">
        A página que você procura não existe ou foi movida. Volte para a página
        inicial ou fale conosco pelo WhatsApp.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Ir para o início
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
