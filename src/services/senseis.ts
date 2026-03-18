import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FounderSensei, Sensei } from "@/types/sensei";
import type { SenseiRow } from "@/types/database";

function toFounderSensei(row: SenseiRow): FounderSensei {
  return {
    name: row.name,
    rank: row.rank,
    organization: row.organization ?? "Shotokan Karate International",
    bio: (row.bio ?? "").split("\n\n").filter(Boolean),
    quote: row.quote ?? "",
    photoUrl: row.photo_url ?? "",
    photoAlt: `${row.name} em pose de karate`,
  };
}

function toSensei(row: SenseiRow): Sensei {
  return {
    id: row.id,
    name: row.name,
    rank: row.rank,
    specialty: row.specialty ?? "",
    bio: row.bio ?? "",
    photoUrl: row.photo_url ?? "",
    photoAlt: `Retrato do ${row.name}`,
    profileHref: "#",
  };
}

export async function getSenseis(): Promise<{
  founder: FounderSensei;
  instructors: Sensei[];
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("senseis")
    .select("*")
    .order("display_order");

  if (error || !data?.length) {
    const { FOUNDER, INSTRUCTORS } =
      await import("@/components/senseis/senseis-data");
    return { founder: FOUNDER, instructors: INSTRUCTORS };
  }

  const rows = data as SenseiRow[];
  const founderRow = rows.find((r) => r.is_founder);
  const instructorRows = rows.filter((r) => !r.is_founder);

  if (!founderRow) {
    const { FOUNDER, INSTRUCTORS } =
      await import("@/components/senseis/senseis-data");
    return { founder: FOUNDER, instructors: INSTRUCTORS };
  }

  return {
    founder: toFounderSensei(founderRow),
    instructors: instructorRows.map(toSensei),
  };
}
