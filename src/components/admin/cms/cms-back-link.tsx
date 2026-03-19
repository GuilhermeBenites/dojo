import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface CmsBackLinkProps {
  href: string;
  label: string;
}

export function CmsBackLink({ href, label }: CmsBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ChevronLeft className="size-4" />
      {label}
    </Link>
  );
}
