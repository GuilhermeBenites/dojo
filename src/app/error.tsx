"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-5xl font-black text-primary">Oops!</p>
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md">
        Ocorreu um erro inesperado. Tente novamente ou volte para a página
        inicial.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Página inicial
        </Link>
      </div>
    </div>
  );
}
