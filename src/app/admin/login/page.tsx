import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Login | Admin Dojo",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4">
      <LoginForm />
    </div>
  );
}
