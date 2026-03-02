"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Swords } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Senseis", href: "/senseis" },
  { label: "Horários", href: "/horarios" },
  { label: "Galeria", href: "/galeria" },
  { label: "Campeonatos", href: "/campeonatos" },
  { label: "Planos", href: "/planos" },
] as const;

const CTA_LABEL = "Agende Aula Grátis";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#1a0b0b]/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 dark:text-white"
          >
            <div className="flex items-center justify-center text-primary">
              <Swords className="size-8" aria-hidden />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Dojo Luciano dos Santos
            </h2>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-8">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    "text-slate-700 hover:text-primary",
                    "dark:text-slate-300 dark:hover:text-primary"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link
              href="#"
              className={cn(
                "bg-primary hover:bg-red-700 text-white text-sm font-bold py-2.5 px-5 rounded-lg",
                "transition-all shadow-lg shadow-primary/20"
              )}
            >
              {CTA_LABEL}
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="flex items-center md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-900 dark:text-white"
                  aria-label="Abrir menu"
                >
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 pt-6">
                  {NAV_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-base font-medium transition-colors py-2",
                        "text-slate-700 hover:text-primary",
                        "dark:text-slate-300 dark:hover:text-primary"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                  <Link
                    href="#"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "mt-4 inline-flex items-center justify-center",
                      "bg-primary hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg",
                      "transition-all shadow-lg w-full"
                    )}
                  >
                    {CTA_LABEL}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
