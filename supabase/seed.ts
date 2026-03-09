import { createClient } from "@supabase/supabase-js";

// Uses the service role key to bypass RLS during seeding
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  console.log("🌱 Seeding database...");

  // ---- SENSEIS ----
  await supabase
    .from("senseis")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("senseis").insert([
    {
      name: "Luciano dos Santos",
      rank: "Faixa Preta 5º Dan",
      specialty: "Kata e Kihon",
      bio: "Com mais de 30 anos de experiência no karate, o Sensei Luciano dos Santos é referência no esporte em Mato Grosso do Sul. Fundador do Dojo em 1995, ele formou campeões estaduais, nacionais e internacionais.",
      photo_url: "/images/senseis/luciano.jpg",
      is_founder: true,
      display_order: 0,
    },
    {
      name: "Anna Santos",
      rank: "Faixa Preta 2º Dan",
      specialty: "Kata Feminino",
      bio: null,
      photo_url: "/images/senseis/anna.jpg",
      is_founder: false,
      display_order: 1,
    },
    {
      name: "Wynner Armoa",
      rank: "Faixa Preta 1º Dan",
      specialty: "Kumite e Condicionamento",
      bio: null,
      photo_url: "/images/senseis/wynner.jpg",
      is_founder: false,
      display_order: 2,
    },
    {
      name: "Letícia Mendez",
      rank: "Faixa Preta 1º Dan",
      specialty: "Karate Infantil",
      bio: null,
      photo_url: "/images/senseis/leticia.jpg",
      is_founder: false,
      display_order: 3,
    },
  ]);
  console.log("  ✅ senseis");

  // ---- TESTIMONIALS ----
  await supabase
    .from("testimonials")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("testimonials").insert([
    {
      author: "Carlos Mendes",
      role: "Aluno há 5 anos",
      quote:
        "O Dojo do Sensei Luciano transformou minha vida. Além do karate, aprendi disciplina e respeito que carrego para todos os aspectos da minha vida.",
      display_order: 0,
    },
    {
      author: "Ana Rodrigues",
      role: "Mãe do aluno Pedro",
      quote:
        "Meu filho treina aqui há 3 anos e a evolução é impressionante. Os sensei são excelentes e o ambiente é muito acolhedor para as crianças.",
      display_order: 1,
    },
    {
      author: "Roberto Alves",
      role: "Faixa Preta recente",
      quote:
        "Depois de 8 anos de treino intenso, conquistei minha faixa preta. O suporte do Sensei Luciano foi fundamental em cada etapa da minha jornada.",
      display_order: 2,
    },
  ]);
  console.log("  ✅ testimonials");

  // ---- SCHEDULES ----
  await supabase
    .from("schedules")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("schedules").insert([
    // Adultos — Seg/Qua/Sex
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "07:00",
      time_end: "08:00",
      category: "adultos",
      instructor: "Sensei Luciano",
      display_order: 0,
    },
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "19:00",
      time_end: "20:30",
      category: "adultos",
      instructor: "Sensei Luciano",
      display_order: 1,
    },
    // Adultos — Ter/Qui
    {
      day_group_id: "ter-qui",
      day_label: "Terça e Quinta",
      time_start: "19:00",
      time_end: "20:30",
      category: "adultos",
      instructor: "Sensei Wynner",
      display_order: 2,
    },
    // Infantil — Seg/Qua/Sex
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "17:00",
      time_end: "18:00",
      category: "infantil",
      instructor: "Sensei Letícia",
      display_order: 3,
    },
    {
      day_group_id: "seg-qua-sex",
      day_label: "Segunda, Quarta e Sexta",
      time_start: "18:00",
      time_end: "19:00",
      category: "infantil",
      instructor: "Sensei Anna",
      display_order: 4,
    },
    // Infantil — Ter/Qui
    {
      day_group_id: "ter-qui",
      day_label: "Terça e Quinta",
      time_start: "17:00",
      time_end: "18:00",
      category: "infantil",
      instructor: "Sensei Letícia",
      display_order: 5,
    },
  ]);
  console.log("  ✅ schedules");

  // ---- GALLERY IMAGES ----
  await supabase
    .from("gallery_images")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("gallery_images").insert([
    {
      title: "Treino de Kata",
      category: "sensei-luciano",
      image_url: "/images/gallery/kata-01.jpg",
      aspect_ratio: "portrait",
      display_order: 0,
    },
    {
      title: "Cerimônia de Faixa",
      category: "belt-ceremonies",
      image_url: "/images/gallery/ceremony-01.jpg",
      aspect_ratio: "landscape",
      display_order: 1,
    },
    {
      title: "Aula Infantil",
      category: "kids",
      image_url: "/images/gallery/kids-01.jpg",
      aspect_ratio: "square",
      display_order: 2,
    },
    {
      title: "Interior do Dojo",
      category: "dojo",
      image_url: "/images/gallery/dojo-01.jpg",
      aspect_ratio: "landscape",
      display_order: 3,
    },
    {
      title: "Kumite Avançado",
      category: "sensei-luciano",
      image_url: "/images/gallery/kumite-01.jpg",
      aspect_ratio: "square",
      display_order: 4,
    },
    {
      title: "Graduação 2024",
      category: "belt-ceremonies",
      image_url: "/images/gallery/ceremony-02.jpg",
      aspect_ratio: "portrait",
      display_order: 5,
    },
    {
      title: "Turma Infantil",
      category: "kids",
      image_url: "/images/gallery/kids-02.jpg",
      aspect_ratio: "landscape",
      display_order: 6,
    },
    {
      title: "Equipamentos",
      category: "dojo",
      image_url: "/images/gallery/dojo-02.jpg",
      aspect_ratio: "square",
      display_order: 7,
    },
  ]);
  console.log("  ✅ gallery_images");

  // ---- DOJO STATS ----
  await supabase
    .from("dojo_stats")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("dojo_stats")
    .insert([
      {
        total_gold: 127,
        total_silver: 84,
        total_bronze: 56,
        total_trophies: 15,
      },
    ]);
  console.log("  ✅ dojo_stats");

  // ---- HALL OF FAME ----
  await supabase
    .from("hall_of_fame")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("hall_of_fame").insert([
    {
      name: "Sensei Luciano",
      achievement: "Fundador e 5 vezes campeão estadual",
      photo_url: "/images/senseis/luciano.jpg",
      display_order: 0,
    },
    {
      name: "Ana Silva",
      achievement: "Campeã Brasileira Sub-21 2023",
      photo_url: "/images/athletes/ana.jpg",
      display_order: 1,
    },
    {
      name: "Pedro Santos",
      achievement: "3x Campeão Estadual Kata Masculino",
      photo_url: "/images/athletes/pedro.jpg",
      display_order: 2,
    },
    {
      name: "Julia Costa",
      achievement: "Medalha de Prata — Open Internacional 2023",
      photo_url: "/images/athletes/julia.jpg",
      display_order: 3,
    },
  ]);
  console.log("  ✅ hall_of_fame");

  // ---- CHAMPIONSHIPS ----
  await supabase
    .from("championship_results")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("championships")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  const { data: champs } = await supabase
    .from("championships")
    .insert([
      {
        name: "Campeonato Paulista de Karate 2024",
        event_date: "2024-09-14",
        location: "São Paulo, SP",
        status: "finalizado",
        gold: 3,
        silver: 2,
        bronze: 1,
        display_order: 0,
      },
      {
        name: "Copa Brasil de Clubes 2023",
        event_date: "2023-11-05",
        location: "Curitiba, PR",
        status: "finalizado",
        gold: 2,
        silver: 3,
        bronze: 2,
        display_order: 1,
      },
      {
        name: "Open Internacional 2023",
        event_date: "2023-07-22",
        location: "Campo Grande, MS",
        status: "finalizado",
        gold: 1,
        silver: 2,
        bronze: 0,
        display_order: 2,
      },
    ])
    .select();

  if (champs && champs.length > 0) {
    const [paulista, copaBrasil, open] = champs;
    await supabase.from("championship_results").insert([
      // Paulista 2024
      {
        championship_id: paulista.id,
        athlete_name: "Ana Silva",
        placement: 1,
        category: "Kata Feminino Sub-21",
      },
      {
        championship_id: paulista.id,
        athlete_name: "Pedro Santos",
        placement: 1,
        category: "Kata Masculino Sênior",
      },
      {
        championship_id: paulista.id,
        athlete_name: "Julia Costa",
        placement: 2,
        category: "Kumite Feminino -55kg",
      },
      // Copa Brasil 2023
      {
        championship_id: copaBrasil.id,
        athlete_name: "Pedro Santos",
        placement: 1,
        category: "Kata Masculino Sênior",
      },
      {
        championship_id: copaBrasil.id,
        athlete_name: "Ana Silva",
        placement: 2,
        category: "Kata Feminino Sub-21",
      },
      // Open Internacional 2023
      {
        championship_id: open.id,
        athlete_name: "Julia Costa",
        placement: 2,
        category: "Kumite Feminino -55kg",
      },
    ]);
  }
  console.log("  ✅ championships + championship_results");

  // ---- PLANS ----
  await supabase
    .from("plans")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("plans").insert([
    {
      plan_key: "tres-vezes",
      title: "3x por Semana",
      subtitle: "Treino intenso para máxima evolução",
      recommended: false,
      tiers: [
        { label: "Mês", price: "R$ 300,00", isMonthlyHighlight: true },
        {
          label: "Trimestral",
          price: "R$ 280,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Semestral",
          price: "R$ 270,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Anual",
          price: "R$ 250,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
      ],
      display_order: 0,
    },
    {
      plan_key: "duas-vezes",
      title: "2x por Semana",
      subtitle: "Equilíbrio ideal de rotina",
      recommended: true,
      tiers: [
        { label: "Mês", price: "R$ 280,00", isMonthlyHighlight: true },
        {
          label: "Trimestral",
          price: "R$ 270,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Semestral",
          price: "R$ 250,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Anual",
          price: "R$ 240,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
      ],
      display_order: 1,
    },
    {
      plan_key: "familia",
      title: "Família",
      subtitle: "Treinem juntos com desconto",
      recommended: false,
      tiers: [
        { label: "Mês", price: "R$ 250,00", isMonthlyHighlight: true },
        {
          label: "Trimestral",
          price: "R$ 240,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Semestral",
          price: "R$ 225,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
        {
          label: "Anual",
          price: "R$ 215,00",
          isMonthlyHighlight: false,
          suffix: "/mês",
        },
      ],
      display_order: 2,
    },
  ]);
  console.log("  ✅ plans");

  // ---- BELT EXAMS ----
  await supabase
    .from("belt_exams")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("belt_exams").insert([
    {
      belt: "Branca até Verde",
      price: "R$ 210,00",
      family_price: "Família: R$ 200,00",
      highlighted: true,
      display_order: 0,
    },
    {
      belt: "Verde para Roxa",
      price: "R$ 250,00",
      family_price: "Família: R$ 230,00",
      highlighted: true,
      display_order: 1,
    },
    {
      belt: "Roxa para Marrom",
      price: "R$ 300,00",
      family_price: "Família: R$ 250,00",
      highlighted: true,
      display_order: 2,
    },
    {
      belt: "Valor da Faixa Simples",
      price: "R$ 45,00",
      family_price: "Família: R$ 40,00",
      highlighted: false,
      display_order: 3,
    },
  ]);
  console.log("  ✅ belt_exams");

  // ---- DROP-IN CLASSES ----
  await supabase
    .from("drop_in_classes")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("drop_in_classes").insert([
    { label: "Aula Avulsa (Dojo)", price: "R$ 60,00", display_order: 0 },
    {
      label: "Alto Rendimento / Competição",
      price: "R$ 30,00",
      display_order: 1,
    },
  ]);
  console.log("  ✅ drop_in_classes");

  // ---- FAQ ITEMS ----
  await supabase
    .from("faq_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("faq_items").insert([
    {
      question: "Preciso comprar o kimono logo no início?",
      answer:
        "Não é obrigatório para as primeiras aulas experimentais. Após o primeiro mês, é necessário ter o kimono para continuar treinando.",
      display_order: 0,
    },
    {
      question: "Como funcionam os exames de faixa?",
      answer:
        "Os exames de faixa ocorrem a cada 3 a 6 meses, dependendo da graduação e do desenvolvimento técnico do aluno. O Sensei avalia o aluno e aprova quando está pronto.",
      display_order: 1,
    },
    {
      question: "Posso trancar o plano em caso de lesão?",
      answer:
        "Sim. Com apresentação de atestado médico, o plano pode ser congelado por até 60 dias sem custo adicional.",
      display_order: 2,
    },
    {
      question: "Quais são as formas de pagamento aceitas?",
      answer:
        "Aceitamos cartão de crédito (recorrência), débito, PIX e dinheiro. Planos trimestrais e anuais podem ser parcelados no cartão de crédito.",
      display_order: 3,
    },
  ]);
  console.log("  ✅ faq_items");

  console.log("🎉 Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
