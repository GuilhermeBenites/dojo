"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type UploadResult = { url: string } | { error: string };

export async function uploadImageAction(
  formData: FormData,
  bucket: "senseis" | "gallery"
): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Arquivo inválido" };

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}
