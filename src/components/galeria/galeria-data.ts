import type { GalleryCategory, GalleryImage } from "@/types/gallery";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Todos",
  "Sensei Luciano",
  "Cerimônias de Faixa",
  "Aulas Infantis",
  "Dojo",
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "gi-01",
    title: "Sensei Luciano",
    category: "Sensei Luciano",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD8J9hdRwoPIHpxYofJC7nEa2v-xp_89PocoGYhAF81npcHPQiXyqrpqv8FnRisT95yKoUdNHWn4ElqyTSuzYwtf6LlVTqNraqjg5wPX8aTj20VVgish-u4RxkdyzBgeA7Xza_3_i8t46rFIsSC_XIU4KtBWTCWFe8WwYIxNhYMCghe5Rt-HHQqppx-SRKFoS6FdWssm8dI8fLFK-1W8UrNR7NZFtz-qA5iR-tVy_uH81h-uZrnfaSoAtD3kWOwmE10pY9ZA_wDxes",
    alt: "Sensei Luciano em pose de karate",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "gi-02",
    title: "Kata em Grupo",
    category: "Sensei Luciano",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB615JE02HREZHKAkRt8U9ViNm71pZ8eao15fJ1LiJ0BchsvBR48ZvC0b6HqzUEuTuA-B9HgMOyrxGYx4aDFbewiTp6WtZ-zjkxpUXpuEq6bgZPBS9Hkc4FH53TBSkkjHqtKTa-mw2TwEzSFnriIbca6ZDB8TMK2w80aA3PaFGQB-FydZOw90A08a-SPZzFs4wK5P1-Fwu9sqGIosN_Xci8bvbu118sVkZePhWOwygL8mnLxjGTxDxU5U1R6kmESCV4qLVXEf-_4JVR",
    alt: "Alunos executando kata em grupo",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: "gi-03",
    title: "Pequenos Guerreiros",
    category: "Aulas Infantis",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5l7NA7MgorEuZp3ZQH7IajEQmXlj6ImvpyVJME93WY6uy5jty5Dwk8___sQv4xq_zOWw01ACNBXXWNt0NnJGBfuVrSlgqH8J3Oxt79UUGThTbjrEmV-k39JRykAMmVb1qdwlQHT8LriUoHArw9KQBO5Jou2bAqBztq4tO4IYKT08XOsTtmVeBmDtH-YLhS5cI-mkSi38pTn2E7XVRyFboayiXQl3bFvgvp1_Lsz1Ffv-33rxpbqiac5tEcmSYuIRqnPyhti87IFj7",
    alt: "Crianças em aula de karate",
    aspectClass: "aspect-square",
  },
  {
    id: "gi-04",
    title: "Graduação",
    category: "Cerimônias de Faixa",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAer03cwX0r841vAMhlAOuJlImeB76uMFp5nurShLSWS8ALPBlD32AtUaJ0-qLKZeFb9DmA1USp-yrZPytzvMhXyGGLVKuAUlQPWtAtgJQ7UbH5ExOGUu5SH-I-DrK2XHS2j-RbTcMVB2y4b-qhzKMEeKQdg_dB7nbJVbMCP6WtmbB-Hgy43ZjEv_NUWwK8o1dNmjNZD7w-PANevz-PPF6SM4OOZg_LtBL6Ohtvcjc0g7Vv6JS8hDuz9onngBEYOreap8ha85rJcmPQ",
    alt: "Cerimônia de graduação de faixa",
    aspectClass: "aspect-[9/16]",
  },
  {
    id: "gi-05",
    title: "Nosso Tatame",
    category: "Dojo",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4wKpoo67VS5JDpfB123GMSxOj9HvYT0jf9afvLFlEWUsjBARnpa6-bLMKLLt15U_gE-efST0SMqBGX8zkxnmCs10b6H5jw_Esc8CfOro6C6_Ji6yhiuGLxPq1wg5IIgnEwSmpjvZAcrNl1ssu3OmBdZOxLNTz8YyGc2OyCRByZ4Je6lWpWJg3kb_NICnHkTcTxblY6XhJSs5M2YAvL690f7-rlCBwU5vpB_SAgJ9-XpqKJTbtlPjCDgqGhHw003KMXdzqr8Wf_exM",
    alt: "Vista do tatame do dojo",
    aspectClass: "aspect-[16/9]",
  },
  {
    id: "gi-06",
    title: "Preparação Mental",
    category: "Dojo",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiQ9lMnPKsw0F1UGJC0uV8_hdALS0yjouB4rsqzw5XvtG2RZb7RcJHnjpgVkPTfkTd4jRSLAywAzqCqwCJOXyBs5Z2HmSHtWmYRBUg-RKFNnjqdZU2egm3rE6aK8EmHDKdk3719u89SHb1Il2qqzqXwy4ZL-bmgPM-uSvQnkzBoOkRdCNtyfjYBt4yYXYTt8XryNIirzMmniI2Sw9d4JFfLBMWbc9JqsyEcVQwVZYpxPCkDWArMcYZCq1w0Jfxdgd5aItzOBqfHuU6",
    alt: "Momento de preparação mental antes do treino",
    aspectClass: "aspect-square",
  },
  {
    id: "gi-07",
    title: "Treino de Chute",
    category: "Sensei Luciano",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBm54XZsZNPmyHrK3t7MMeQwSPjmeIc0ZO5X4jgzEZ4iFmWvRgpuVpjFX1FU_9Aftw2uaZgshVMire6lR5wGfDrEy7sTtCPlZXdmLjwdt5PSh3kCBFlriVKM2q9Jw6k4yXNRA-S1liSO1SH6IucSN7WBsXDUyvlxi7z7QQ7gN2Tkg04_WStQ0R2AgfDVoZj0d-FEGNCsJ6f6coFpBMMT9jKM5tQkV6yOR3oXvXcYSbFpZn7wfl1_5KTA8mtJocUZdY7KbMbaLCjDQlI",
    alt: "Treino de técnicas de chute",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "gi-08",
    title: "A Faixa Preta",
    category: "Cerimônias de Faixa",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZS1n73cWNRMTWYqwcP2GVufkHXghM3YNaTiNhtLqdCu3eqlVHTuYZV8qtOa5gHdmySVSqWQ9872m9Iu2aKEXfnT8st9kkCFkg5ys7MSlPkXmMdWJNMi2TeDaCqBgvM99Rn5M_vJhStStuNZ27_ckj32g-e_MIlEcIemGF-Roa3kVKNoNhGCXKwxQjURj1aUm8vm6Jzvt8a2iZm87OSq1VjzrQuBF4gSifPfL_H1uO19OYOYZqbslDenZklalhB6lPHgwHSa16vrY",
    alt: "Cerimônia de faixa preta",
    aspectClass: "aspect-[16/9]",
  },
];
