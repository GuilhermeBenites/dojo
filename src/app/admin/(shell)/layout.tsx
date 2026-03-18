import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AuthProvider } from "@/components/admin/auth-provider";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
