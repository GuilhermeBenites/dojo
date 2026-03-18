"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_ROUTES } from "@/lib/constants";

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(ADMIN_ROUTES.LOGIN);
}
