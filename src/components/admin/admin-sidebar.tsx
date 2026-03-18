"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Dashboard", href: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Conteúdo", href: ADMIN_ROUTES.CONTENT, icon: FileText },
  { label: "Alunos", href: ADMIN_ROUTES.STUDENTS, icon: Users },
  { label: "Financeiro", href: ADMIN_ROUTES.FINANCE, icon: DollarSign },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-60 border-r border-border bg-sidebar shrink-0"
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <Swords className="size-6 text-primary" aria-hidden />
        <span className="font-bold text-sm text-sidebar-foreground">
          Dojo Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
