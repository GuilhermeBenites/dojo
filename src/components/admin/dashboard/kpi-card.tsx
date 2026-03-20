import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: number | string;
  description?: string;
  href?: string;
  variant?: "default" | "danger" | "warning";
}

export function KpiCard({
  label,
  value,
  description,
  href,
  variant = "default",
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        variant === "danger" && "border-destructive",
        variant === "warning" && "border-amber-400",
      )}
    >
      <CardContent className="flex flex-col gap-1 pt-6">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </span>
        <span
          className={cn(
            "text-2xl font-bold text-card-foreground",
            variant === "danger" && "text-destructive",
            variant === "warning" && "text-amber-700",
          )}
        >
          {value}
        </span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
        {href && (
          <Link
            href={href}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline pt-1"
          >
            Ver todos →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
