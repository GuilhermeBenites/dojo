"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_ROUTES } from "@/lib/constants";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginFormState | undefined,
  formData: FormData,
): Promise<LoginFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "E-mail ou senha inválidos." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Credenciais inválidas. Verifique e-mail e senha." };
  }

  redirect(ADMIN_ROUTES.DASHBOARD);
}
