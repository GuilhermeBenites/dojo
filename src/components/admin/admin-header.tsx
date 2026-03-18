import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/admin/actions/logout";

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background shrink-0">
      <h1 className="text-sm font-semibold text-muted-foreground">
        Painel Administrativo
      </h1>
      <form action={logoutAction}>
        <Button variant="ghost" size="sm" type="submit">
          <LogOut className="size-4 mr-1" aria-hidden />
          Sair
        </Button>
      </form>
    </header>
  );
}
