-- Seed data aligned with -data.ts static files
-- Run after 20260309_04_add_sensei_fields.sql

-- Clear in reverse dependency order
TRUNCATE championship_results CASCADE;
TRUNCATE championships CASCADE;
TRUNCATE hall_of_fame CASCADE;
TRUNCATE dojo_stats CASCADE;
TRUNCATE gallery_images CASCADE;
TRUNCATE schedules CASCADE;
TRUNCATE testimonials CASCADE;
TRUNCATE senseis CASCADE;
TRUNCATE plans CASCADE;
TRUNCATE belt_exams CASCADE;
TRUNCATE drop_in_classes CASCADE;
TRUNCATE faq_items CASCADE;

-- senseis (founder + 3 instructors)
INSERT INTO senseis (name, rank, specialty, bio, quote, organization, photo_url, is_founder, display_order) VALUES
(
  'Sensei Luciano dos Santos',
  'Faixa Preta 5º Dan',
  NULL,
  'Com mais de 25 anos de dedicação ininterrupta ao Karate Shotokan, o Sensei Luciano acredita que o verdadeiro dojo está dentro de cada um de nós. Sua jornada começou aos 6 anos de idade, e desde então, ele tem transformado vidas através da disciplina marcial.

Sua filosofia de ensino foca não apenas na técnica perfeita, mas no desenvolvimento do caráter. "Disciplina, respeito e superação constante" são os pilares que sustentam cada aula ministrada no dojo.',
  'O Karate não é sobre ser melhor que o outro, é sobre ser melhor do que você era ontem. O verdadeiro oponente está dentro de você.',
  'Shotokan Karate International',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDFpBzKXfJIKNRExcdf0Zr38-fsPdCSH5GtqRp7CpDXnaWBaCdb3b0wr_BEiOe8fFMGEtzIYfaoljoTWgFzgxiWyL_kcYPtp7--CV2X_e0xLyCDM4mVlhZKHuhzyWykntPui5dz7bHVavzbw438qiYCbqdKvToklFM5fo5LVNb9_B6LtXrRWcZ6et70nUaU4jzciu54wWxVj4-D97qgpgRjtJ2VjBCWJVRm7YcOOSAMLi8e_8LToebqrE85pKNAH3gGzv47kgK4tWnM',
  true,
  0
),
(
  'Sensei Anna Santos',
  '3º Dan - Especialista Pedagógica',
  'Infantil',
  'Com formação em Educação Física e especialização em desenvolvimento motor infantil, Anna torna o aprendizado do Karate lúdico e disciplinado para crianças.',
  NULL, NULL,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDIosygA2Jje56ugPwcQZK4utH7WLK7SKwl_cVTRkKDvV1-LN7T5FbnFmjsxBwZD4jpddv8WNBotL2trHfHVL7UTPlJq4c8GbHVg_Pe5NdlCoMl3lS0lm4VvJtMlygAwn5ZxD5m3Zo0qAzpnvmIpGkVsAbL1syGqUgRsO4oFUvhC8a_3ci8D3Urc40ZzzHL6b4Q6ETCqrikCpPMQ4umURGCZt-C6AnQZT2oBoMWlXLMX2qe9W3HajagJXtA938W9a2Ido6N4NEiGI1u',
  false,
  1
),
(
  'Sensei Wynner Armoa',
  '4º Dan - Técnico Nacional',
  'Kata & Técnica',
  'Meticuloso e detalhista, Sensei Wynner foca na perfeição dos movimentos (Kata) e na aplicação técnica (Bunkai), elevando o nível técnico do dojo.',
  NULL, NULL,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8nnrJM0ENCyHww4Pe43-4SRsrnwxHq0phyMIxOA5fs8l9lKM-bHzGxkOK3pCO8mS9Xr2kwvC0a3bruWRFHxh8Z3UxRE08kxloRJX4EnsfbPm7sa0sPoXIgtwinX_I10M6vdG6VulDdzWMqXbzqCIpG_RJeg0Dn2wmNLh9qbuXWZZHxblm_I2gTt-cVRb-jOX-OXbBUEokJRHz32ORvsR6p4mFT2YNLJqlNNaw0YAVBCcfBsnFd6LhXxkHTbqNhtfedNfQS6wil3kc',
  false,
  2
),
(
  'Sensei Letícia Mendez',
  '3º Dan - Ex-Atleta Olímpica',
  'Alto Rendimento',
  'Responsável pela equipe de competição, Letícia traz sua experiência internacional para preparar atletas de alto rendimento com foco em Kumite.',
  NULL, NULL,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqxwiuYSn8cowNjVdejtBj0QScYltfSrh9vY_ah43Nl0r3GK_dtzJfdOX_vzUbZfNi_A5E_B4sESfs6st9CRZTYgA98Q8D_IvrNUF9IS2V56eMGwJrtIXXHaCfvoZn5XxQVrGtydXWOA8I07419QuUXY4exBpi5wc94C5Mg8UH-3vPag9CFPQeNl1U05DHj4Ijz27YuwTGnwc92raiyfrkmutaUDvZRZlq84KlmpGHYN8RA7Q4pvNBsV9DJmF9HYgcl4ZWCIWmiHJG',
  false,
  3
);

-- testimonials
INSERT INTO testimonials (author, role, quote, display_order) VALUES
('Ana Paula Silva', 'Mãe de aluno', 'Meu filho melhorou muito a concentração na escola depois que começou a treinar. O Sensei Luciano é incrível com as crianças, ensinando respeito e disciplina de forma divertida.', 0),
('Ricardo Oliveira', 'Aluno Faixa Verde', 'Comecei o karate aos 40 anos buscando uma atividade física e encontrei uma filosofia de vida. Perdi peso, ganhei confiança e fiz grandes amigos no dojo.', 1),
('Mariana Costa', 'Aluna Iniciante', 'A defesa pessoal ensinada aqui é prática e eficiente. Me sinto muito mais segura no meu dia a dia. Recomendo para todas as mulheres!', 2);

-- schedules
INSERT INTO schedules (day_group_id, day_label, time_start, time_end, category, instructor, display_order) VALUES
('seg-qua-sex-infantil', 'Segunda / Quarta / Sexta', '16:00', '17:00', 'infantil', 'Sensei Anna Santos', 0),
('seg-qua-sex-infantil', 'Segunda / Quarta / Sexta', '18:15', '19:15', 'infantil', 'Sensei Luciano dos Santos', 1),
('ter-qui-infantil', 'Terça / Quinta', '09:00', '10:00', 'infantil', 'Sensei Wynner Armoa', 2),
('ter-qui-infantil', 'Terça / Quinta', '16:00', '17:00', 'infantil', 'Sensei Anna Santos', 3),
('ter-qui-infantil', 'Terça / Quinta', '17:00', '18:00', 'infantil', 'Sensei Letícia Mendez', 4),
('ter-qui-infantil', 'Terça / Quinta', '18:15', '19:15', 'infantil', 'Sensei Letícia Mendez', 5),
('seg-qua-sex-adultos', 'Segunda / Quarta / Sexta', '06:30', '07:30', 'adultos', 'Sensei Wynner Armoa', 6),
('seg-qua-sex-adultos', 'Segunda / Quarta / Sexta', '19:30', '21:00', 'adultos', 'Sensei Luciano dos Santos', 7),
('ter-qui-adultos', 'Terça / Quinta', '07:00', '08:00', 'adultos', 'Sensei Letícia Mendez', 8),
('ter-qui-adultos', 'Terça / Quinta', '19:30', '21:00', 'adultos', 'Sensei Luciano dos Santos', 9);

-- gallery_images (category = display names, aspect_ratio = fraction)
INSERT INTO gallery_images (title, category, image_url, aspect_ratio, display_order) VALUES
('Sensei Luciano', 'Sensei Luciano', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD8J9hdRwoPIHpxYofJC7nEa2v-xp_89PocoGYhAF81npcHPQiXyqrpqv8FnRisT95yKoUdNHWn4ElqyTSuzYwtf6LlVTqNraqjg5wPX8aTj20VVgish-u4RxkdyzBgeA7Xza_3_i8t46rFIsSC_XIU4KtBWTCWFe8WwYIxNhYMCghe5Rt-HHQqppx-SRKFoS6FdWssm8dI8fLFK-1W8UrNR7NZFtz-qA5iR-tVy_uH81h-uZrnfaSoAtD3kWOwmE10pY9ZA_wDxes', '3/4', 0),
('Kata em Grupo', 'Sensei Luciano', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB615JE02HREZHKAkRt8U9ViNm71pZ8eao15fJ1LiJ0BchsvBR48ZvC0b6HqzUEuTuA-B9HgMOyrxGYx4aDFbewiTp6WtZ-zjkxpUXpuEq6bgZPBS9Hkc4FH53TBSkkjHqtKTa-mw2TwEzSFnriIbca6ZDB8TMK2w80aA3PaFGQB-FydZOw90A08a-SPZzFs4wK5P1-Fwu9sqGIosN_Xci8bvbu118sVkZePhWOwygL8mnLxjGTxDxU5U1R6kmESCV4qLVXEf-_4JVR', '4/3', 1),
('Pequenos Guerreiros', 'Aulas Infantis', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5l7NA7MgorEuZp3ZQH7IajEQmXlj6ImvpyVJME93WY6uy5jty5Dwk8___sQv4xq_zOWw01ACNBXXWNt0NnJGBfuVrSlgqH8J3Oxt79UUGThTbjrEmV-k39JRykAMmVb1qdwlQHT8LriUoHArw9KQBO5Jou2bAqBztq4tO4IYKT08XOsTtmVeBmDtH-YLhS5cI-mkSi38pTn2E7XVRyFboayiXQl3bFvgvp1_Lsz1Ffv-33rxpbqiac5tEcmSYuIRqnPyhti87IFj7', '1/1', 2),
('Graduação', 'Cerimônias de Faixa', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAer03cwX0r841vAMhlAOuJlImeB76uMFp5nurShLSWS8ALPBlD32AtUaJ0-qLKZeFb9DmA1USp-yrZPytzvMhXyGGLVKuAUlQPWtAtgJQ7UbH5ExOGUu5SH-I-DrK2XHS2j-RbTcMVB2y4b-qhzKMEeKQdg_dB7nbJVbMCP6WtmbB-Hgy43ZjEv_NUWwK8o1dNmjNZD7w-PANevz-PPF6SM4OOZg_LtBL6Ohtvcjc0g7Vv6JS8hDuz9onngBEYOreap8ha85rJcmPQ', '9/16', 3),
('Nosso Tatame', 'Dojo', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4wKpoo67VS5JDpfB123GMSxOj9HvYT0jf9afvLFlEWUsjBARnpa6-bLMKLLt15U_gE-efST0SMqBGX8zkxnmCs10b6H5jw_Esc8CfOro6C6_Ji6yhiuGLxPq1wg5IIgnEwSmpjvZAcrNl1ssu3OmBdZOxLNTz8YyGc2OyCRByZ4Je6lWpWJg3kb_NICnHkTcTxblY6XhJSs5M2YAvL690f7-rlCBwU5vpB_SAgJ9-XpqKJTbtlPjCDgqGhHw003KMXdzqr8Wf_exM', '16/9', 4),
('Preparação Mental', 'Dojo', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiQ9lMnPKsw0F1UGJC0uV8_hdALS0yjouB4rsqzw5XvtG2RZb7RcJHnjpgVkPTfkTd4jRSLAywAzqCqwCJOXyBs5Z2HmSHtWmYRBUg-RKFNnjqdZU2egm3rE6aK8EmHDKdk3719u89SHb1Il2qqzqXwy4ZL-bmgPM-uSvQnkzBoOkRdCNtyfjYBt4yYXYTt8XryNIirzMmniI2Sw9d4JFfLBMWbc9JqsyEcVQwVZYpxPCkDWArMcYZCq1w0Jfxdgd5aItzOBqfHuU6', '1/1', 5),
('Treino de Chute', 'Sensei Luciano', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm54XZsZNPmyHrK3t7MMeQwSPjmeIc0ZO5X4jgzEZ4iFmWvRgpuVpjFX1FU_9Aftw2uaZgshVMire6lR5wGfDrEy7sTtCPlZXdmLjwdt5PSh3kCBFlriVKM2q9Jw6k4yXNRA-S1liSO1SH6IucSN7WBsXDUyvlxi7z7QQ7gN2Tkg04_WStQ0R2AgfDVoZj0d-FEGNCsJ6f6coFpBMMT9jKM5tQkV6yOR3oXvXcYSbFpZn7wfl1_5KTA8mtJocUZdY7KbMbaLCjDQlI', '3/4', 6),
('A Faixa Preta', 'Cerimônias de Faixa', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ZS1n73cWNRMTWYqwcP2GVufkHXghM3YNaTiNhtLqdCu3eqlVHTuYZV8qtOa5gHdmySVSqWQ9872m9Iu2aKEXfnT8st9kkCFkg5ys7MSlPkXmMdWJNMi2TeDaCqBgvM99Rn5M_vJhStStuNZ27_ckj32g-e_MIlEcIemGF-Roa3kVKNoNhGCXKwxQjURj1aUm8vm6Jzvt8a2iZm87OSq1VjzrQuBF4gSifPfL_H1uO19OYOYZqbslDenZklalhB6lPHgwHSa16vrY', '16/9', 7);

-- dojo_stats
INSERT INTO dojo_stats (total_gold, total_silver, total_bronze, total_trophies)
VALUES (127, 84, 56, 15);

-- hall_of_fame
INSERT INTO hall_of_fame (name, achievement, photo_url, display_order) VALUES
('Sensei Luciano', 'Campeão Mundial 2022', NULL, 0),
('Ana Silva', 'Campeã Brasileira 2023', NULL, 1),
('Pedro Santos', 'Ouro Pan-Americano', NULL, 2),
('Julia Costa', 'Tricampeã Estadual', NULL, 3);

-- championships + championship_results
INSERT INTO championships (name, event_date, location, status, gold, silver, bronze, display_order) VALUES
('Campeonato Paulista de Karate 2024', '2024-03-15', 'Ginásio do Ibirapuera, São Paulo', 'finalizado', 5, 2, 3, 0),
('Copa Brasil de Clubes', '2023-11-10', 'Rio de Janeiro, RJ', 'finalizado', 2, 4, 1, 1),
('Open Internacional', '2023-08-14', 'Curitiba, PR', 'finalizado', 8, 3, 5, 2);

-- championship_results (using championship names to get IDs)
INSERT INTO championship_results (championship_id, athlete_name, placement, category)
SELECT c.id, r.athlete_name, r.placement, r.category
FROM championships c
CROSS JOIN (VALUES
  ('Campeonato Paulista de Karate 2024', 'João Oliveira', 1, 'Kumite -75kg'),
  ('Campeonato Paulista de Karate 2024', 'Mariana Costa', 1, 'Kata Individual'),
  ('Campeonato Paulista de Karate 2024', 'Carlos Mendes', 2, 'Kumite +84kg'),
  ('Campeonato Paulista de Karate 2024', 'Equipe Masculina', 3, 'Kata Equipe'),
  ('Copa Brasil de Clubes', 'Sensei Luciano', 1, 'Master Kata'),
  ('Copa Brasil de Clubes', 'Julia Costa', 1, 'Kumite -55kg'),
  ('Copa Brasil de Clubes', 'Pedro Santos', 2, 'Kumite -67kg')
) AS r(champ_name, athlete_name, placement, category)
WHERE c.name = r.champ_name;

-- plans
INSERT INTO plans (plan_key, title, subtitle, recommended, tiers, display_order) VALUES
('tres-vezes', '3x por Semana', 'Treino intenso para máxima evolução', false,
 '[{"label":"Mês","price":"R$ 300,00","isMonthlyHighlight":true},{"label":"Trimestral","price":"R$ 280,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Semestral","price":"R$ 270,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Anual","price":"R$ 250,00","isMonthlyHighlight":false,"suffix":"/mês"}]',
 0),
('duas-vezes', '2x por Semana', 'Equilíbrio ideal de rotina', true,
 '[{"label":"Mês","price":"R$ 280,00","isMonthlyHighlight":true},{"label":"Trimestral","price":"R$ 270,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Semestral","price":"R$ 250,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Anual","price":"R$ 240,00","isMonthlyHighlight":false,"suffix":"/mês"}]',
 1),
('familia', 'Família', 'Treinem juntos com desconto', false,
 '[{"label":"Mês","price":"R$ 250,00","isMonthlyHighlight":true},{"label":"Trimestral","price":"R$ 240,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Semestral","price":"R$ 225,00","isMonthlyHighlight":false,"suffix":"/mês"},{"label":"Anual","price":"R$ 215,00","isMonthlyHighlight":false,"suffix":"/mês"}]',
 2);

-- belt_exams
INSERT INTO belt_exams (belt, price, family_price, highlighted, display_order) VALUES
('Branca até Verde', 'R$ 210,00', 'Família: R$ 200,00', true, 0),
('Verde para Roxa', 'R$ 250,00', 'Família: R$ 230,00', true, 1),
('Roxa para Marrom', 'R$ 300,00', 'Família: R$ 250,00', true, 2),
('Valor da Faixa Simples', 'R$ 45,00', 'Família: R$ 40,00', false, 3);

-- drop_in_classes
INSERT INTO drop_in_classes (label, price, display_order) VALUES
('Aula Avulsa (Dojo)', 'R$ 60,00', 0),
('Alto Rendimento / Competição', 'R$ 30,00', 1);

-- faq_items
INSERT INTO faq_items (question, answer, display_order) VALUES
('Preciso comprar o kimono logo no início?', 'Não é obrigatório para as primeiras aulas experimentais. Após o primeiro mês, o kimono é necessário.', 0),
('Como funcionam os exames de faixa?', 'Os exames de faixa ocorrem a cada 3 a 6 meses conforme o estágio e desenvolvimento técnico. O sensei avalia e aprova.', 1),
('Posso trancar o plano em caso de lesão?', 'Sim. Com atestado médico, o plano pode ser congelado por até 60 dias sem custo adicional.', 2),
('Quais são as formas de pagamento aceitas?', 'Aceitamos cartão de crédito (recorrência), débito, PIX e dinheiro. Planos trimestrais e anuais podem ser parcelados no cartão.', 3);
