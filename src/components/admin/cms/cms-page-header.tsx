import type { ReactNode } from "react";

interface CmsPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function CmsPageHeader({ title, description, action }: CmsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  );
}
