import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "admin@dojo.test";
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "testpassword";

const FOUNDER_QUOTE =
  "O Karate não é sobre ser melhor que o outro, é sobre ser melhor do que você era ontem. O verdadeiro oponente está dentro de você.";

const INSTRUCTOR_SPECIALTIES: Record<string, string> = {
  "Anna Santos": "Infantil",
  "Wynner Armoa": "Kata & Técnica",
  "Letícia Mendez": "Alto Rendimento",
};

const ALL_GALLERY_IMAGES = [
  { title: "Sensei Luciano",     category: "Sensei Luciano",      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD8J9hdRwoPIHpxYofJC7nEa2v-xp_89PocoGYhAF81npcHPQiXyqrpqv8FnRisT95yKoUdNHWn4ElqyTSuzYwtf6LlVTqNraqjg5wPX8aTj20VVgish-u4RxkdyzBgeA7Xza_3_i8t46rFIsSC_XIU4KtBWTCWFe8WwYIxNhYMCghe5Rt-HHQqppx-SRKFoS6FdWssm8dI8fLFK-1W8UrNR7NZFtz-qA5iR-tVy_uH81h-uZrnfaSoAtD3kWOwmE10pY9ZA_wDxes", aspect_ratio: "3/4",  display_order: 0 },
  { title: "Kata em Grupo",      category: "Sensei Luciano",      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB615JE02HREZHKAkRt8U9ViNm71pZ8eao15fJ1LiJ0BchsvBR48ZvC0b6HqzUEuTuA-B9HgMOyrxGYx4aDFbewiTp6WtZ-zjkxpUXpuEq6bgZPBS9Hkc4FH53TBSkkjHqtKTa-mw2TwEzSFnriIbca6ZDB8TMK2w80aA3PaFGQB-FydZOw90A08a-SPZzFs4wK5P1-Fwu9sqGIosN_Xci8bvbu118sVkZePhWOwygL8mnLxjGTxDxU5U1R6kmESCV4qLVXEf-_4JVR", aspect_ratio: "4/3",  display_order: 1 },
  { title: "Pequenos Guerreiros",category: "Aulas Infantis",      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5l7NA7MgorEuZp3ZQH7IajEQmXlj6ImvpyVJME93WY6uy5jty5Dwk8___sQv4xq_zOWw01ACNBXXWNt0NnJGBfuVrSlgqH8J3Oxt79UUGThTbjrEmV-k39JRykAMmVb1qdwlQHT8LriUoHArw9KQBO5Jou2bAqBztq4tO4IYKT08XOsTtmVeBmDtH-YLhS5cI-mkSi38pTn2E7XVRyFboayiXQl3bFvgvp1_Lsz1Ffv-33rxpbqiac5tEcmSYuIRqnPyhti87IFj7", aspect_ratio: "1/1",  display_order: 2 },
  { title: "Graduação",          category: "Cerimônias de Faixa", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAer03cwX0r841vAMhlAOuJlImeB76uMFp5nurShLSWS8ALPBlD32AtUaJ0-qLKZeFb9DmA1USp-yrZPytzvMhXyGGLVKuAUlQPWtAtgJQ7UbH5ExOGUu5SH-I-DrK2XHS2j-RbTcMVB2y4b-qhzKMEeKQdg_dB7nbJVbMCP6WtmbB-Hgy43ZjEv_NUWwK8o1dNmjNZD7w-PANevz-PPF6SM4OOZg_LtBL6Ohtvcjc0g7Vv6JS8hDuz9onngBEYOreap8ha85rJcmPQ", aspect_ratio: "9/16", display_order: 3 },
  { title: "Nosso Tatame",       category: "Dojo",                image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4wKpoo67VS5JDpfB123GMSxOj9HvYT0jf9afvLFlEWUsjBARnpa6-bLMKLLt15U_gE-efST0SMqBGX8zkxnmCs10b6H5jw_Esc8CfOro6C6_Ji6yhiuGLxPq1wg5IIgnEwSmpjvZAcrNl1ssu3OmBdZOxLNTz8YyGc2OyCRByZ4Je6lWpWJg3kb_NICnHkTcTxblY6XhJSs5M2YAvL690f7-rlCBwU5vpB_SAgJ9-XpqKJTbtlPjCDgqGhHw003KMXdzqr8Wf_exM", aspect_ratio: "16/9", display_order: 4 },
  { title: "Preparação Mental",  category: "Dojo",                image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiQ9lMnPKsw0F1UGJC0uV8_hdALS0yjouB4rsqzw5XvtG2RZb7RcJHnjpgVkPTfkTd4jRSLAywAzqCqwCJOXyBs5Z2HmSHtWmYRBUg-RKFNnjqdZU2egm3rE6aK8EMHDKdk3719u89SHb1Il2qqzqXwy4ZL-bmgPM-uSvQnkzBoOkRdCNtyfjYBt4yYXYTt8XryNIirzMmniI2Sw9d4JFfLBMWbc9JqsyEcVQwVZYpxPCkDWArMcYZCq1w0Jfxdgd5aItzOBqfHuU6", aspect_ratio: "1/1",  display_order: 5 },
  { title: "Treino de Chute",    category: "Sensei Luciano",      image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm54XZsZNPmyHrK3t7MMeQwSPjmeIc0ZO5X4jgzEZ4iFmWvRgpuVpjFX1FU_9Aftw2uaZgshVMire6lR5wGfDrEy7sTtCPlZXdmLjwdt5PSh3kCBFlriVKM2q9Jw6k4yXNRA-S1liSO1SH6IucSN7WBsXDUyvlxi7z7QQ7gN2Tkg04_WStQ0R2AgfDVoZj0d-FEGNCsJ6f6coFpBMMT9jKM5tQkV6yOR3oXvXcYSbFpZn7wfl1_5KTA8mtJocUZdY7KbMbaLCjDQlI", aspect_ratio: "3/4",  display_order: 6 },
  { title: "A Faixa Preta",      category: "Cerimônias de Faixa", image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZS1n73cWNRMTWYqwcP2GVufkHXghM3YNaTiNhtLqdCu3eqlVHTuYZV8qtOa5gHdmySVSqWQ9872m9Iu2aKEXfnT8st9kkCFkg5ys7MSlPkXmMdWJNMi2TeDaCqBgvM99Rn5M_vJhStStuNZ27_ckj32g-e_MIlEcIemGF-Roa3kVKNoNhGCXKwxQjURj1aUm8vm6Jzvt8a2iZm87OSq1VjzrQuBF4gSifPfL_H1uO19OYOYZqbslDenZklalhB6lPHgwHSa16vrY", aspect_ratio: "16/9", display_order: 7 },
];

const ALL_SCHEDULES = [
  { day_group_id: "seg-qua-sex-infantil", day_label: "Segunda / Quarta / Sexta", time_start: "16:00", time_end: "17:00", category: "infantil", instructor: "Sensei Anna Santos", display_order: 0 },
  { day_group_id: "seg-qua-sex-infantil", day_label: "Segunda / Quarta / Sexta", time_start: "18:15", time_end: "19:15", category: "infantil", instructor: "Sensei Luciano dos Santos", display_order: 1 },
  { day_group_id: "ter-qui-infantil", day_label: "Terça / Quinta", time_start: "09:00", time_end: "10:00", category: "infantil", instructor: "Sensei Wynner Armoa", display_order: 2 },
  { day_group_id: "ter-qui-infantil", day_label: "Terça / Quinta", time_start: "16:00", time_end: "17:00", category: "infantil", instructor: "Sensei Anna Santos", display_order: 3 },
  { day_group_id: "ter-qui-infantil", day_label: "Terça / Quinta", time_start: "17:00", time_end: "18:00", category: "infantil", instructor: "Sensei Letícia Mendez", display_order: 4 },
  { day_group_id: "ter-qui-infantil", day_label: "Terça / Quinta", time_start: "18:15", time_end: "19:15", category: "infantil", instructor: "Sensei Letícia Mendez", display_order: 5 },
  { day_group_id: "seg-qua-sex-adultos", day_label: "Segunda / Quarta / Sexta", time_start: "06:30", time_end: "07:30", category: "adultos", instructor: "Sensei Wynner Armoa", display_order: 6 },
  { day_group_id: "seg-qua-sex-adultos", day_label: "Segunda / Quarta / Sexta", time_start: "19:30", time_end: "21:00", category: "adultos", instructor: "Sensei Luciano dos Santos", display_order: 7 },
  { day_group_id: "ter-qui-adultos", day_label: "Terça / Quinta", time_start: "07:00", time_end: "08:00", category: "adultos", instructor: "Sensei Letícia Mendez", display_order: 8 },
  { day_group_id: "ter-qui-adultos", day_label: "Terça / Quinta", time_start: "19:30", time_end: "21:00", category: "adultos", instructor: "Sensei Luciano dos Santos", display_order: 9 },
];

export default async function globalSetup() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Check if the test user already exists to avoid duplicate creation errors
  const { data: existing } = await supabase.auth.admin.listUsers();
  const alreadyExists = existing?.users.some((u) => u.email === TEST_EMAIL);

  if (!alreadyExists) {
    const { error } = await supabase.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Failed to create test admin user: ${error.message}`);
    }

    console.log(`✔ Test admin user created: ${TEST_EMAIL}`);
  } else {
    console.log(`✔ Test admin user already exists: ${TEST_EMAIL}`);
  }

  // Ensure the founder row has a quote so blockquote tests are reliable
  const { error: quoteError } = await supabase
    .from("senseis")
    .update({ quote: FOUNDER_QUOTE })
    .eq("is_founder", true)
    .is("quote", null);

  if (quoteError) {
    console.warn(`⚠ Could not seed founder quote: ${quoteError.message}`);
  } else {
    console.log("✔ Founder quote seeded");
  }

  // Ensure instructor specialties match what the tests expect
  for (const [name, specialty] of Object.entries(INSTRUCTOR_SPECIALTIES)) {
    const { error } = await supabase
      .from("senseis")
      .update({ specialty })
      .eq("is_founder", false)
      .ilike("name", `%${name}%`);

    if (error) {
      console.warn(`⚠ Could not seed specialty for ${name}: ${error.message}`);
    }
  }
  console.log("✔ Instructor specialties seeded");

  // Replace all schedule rows with seed-expected values
  await supabase.from("schedules").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error: scheduleError } = await supabase
    .from("schedules")
    .insert(ALL_SCHEDULES);

  if (scheduleError) {
    console.warn(`⚠ Could not seed schedules: ${scheduleError.message}`);
  } else {
    console.log("✔ Schedules seeded");
  }

  // Replace all gallery images with seed-expected values
  await supabase.from("gallery_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error: galleryError } = await supabase
    .from("gallery_images")
    .insert(ALL_GALLERY_IMAGES);

  if (galleryError) {
    console.warn(`⚠ Could not seed gallery images: ${galleryError.message}`);
  } else {
    console.log("✔ Gallery images seeded");
  }
}
