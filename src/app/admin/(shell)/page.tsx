import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/constants";

export default function AdminShellIndexPage() {
  redirect(ADMIN_ROUTES.DASHBOARD);
}
