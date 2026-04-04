"use client";

import { MessageCircle } from "lucide-react";

import { WHATSAPP_URL } from "@/lib/constants";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className={[
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2",
        "bg-[#25D366] hover:bg-[#1ebe5d] text-white",
        "rounded-full shadow-lg",
        "px-4 py-3 sm:px-5 sm:py-4",
        "transition-transform hover:scale-105 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-semibold">
        Fale conosco
      </span>
    </a>
  );
}
