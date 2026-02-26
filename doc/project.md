# Documentação do Projeto: Dojo Digital

## 1. Visão Geral

O **Dojo Digital** é uma plataforma de presença online e gestão administrativa para academias de artes marciais. O projeto é dividido em dois grandes núcleos: uma **Vitrine Pública** de alto desempenho (SEO) e uma **Área Administrativa** para gestão operacional.

- **Objetivo Principal:** Conversão de visitantes em alunos e automação de processos internos.
- **Stack Tecnológica:** Next.js (App Router), TypeScript, Tailwind CSS e Supabase.

---

## 2. Arquitetura de Funcionalidades

### 2.1. Vitrine Pública (Foco em SEO e Marketing)

Esta camada é otimizada para buscadores e deve garantir que todos os dados sejam indexados via **Server-Side Rendering (SSR)**.

- **Landing Page (Home):**
- Seção de impacto (Hero) com proposta de valor e CTA (Call to Action) para aula experimental.
- Seção de benefícios do Karatê (Saúde, Disciplina, Foco).
- Prova Social: Depoimentos dinâmicos de alunos e pais.

- **Página de Localização e Horários:**
- Integração com mapas para visualização do endereço.
- Grade de horários dinâmica filtrável por categoria (Ex: Infantil, Adulto, Competição).

- **Página de Senseis (Autoridade):**
- Listagem de instrutores com biografia técnica, graduação e especialidades.

- **Galeria de Fotos (Visual):**
- Grade de imagens otimizadas com suporte a categorias (Eventos, Treinos, Exames).
- Sistema de _lightbox_ para visualização em tela cheia.

- **Histórico de Campeonatos:**
- Registro de participações em eventos.
- Quadro de medalhas e destaques de atletas do Dojo.

---

### 2.2. Área Administrativa

Área restrita, acessível apenas via autenticação, com foco em usabilidade e produtividade.

- **Dashboard de Indicadores:**
- Resumo de novos leads, total de alunos ativos e aniversariantes do mês.

- **Gestão de Conteúdo (CMS Interno):**
- Interface para criação, edição e exclusão de horários, fotos da galeria e resultados de campeonatos sem necessidade de código.

- **Gestão de Alunos:**
- Cadastro completo de alunos, controle de graduações (faixas) e histórico de presença.

- **Controle Financeiro:**
- Monitoramento de status de mensalidades e planos contratados.

---

## 3. Requisitos de Comportamento e Experiência (UX)

### 3.1. Performance e SEO

- **Otimização de Imagens:** Todas as imagens devem sofrer compressão automática e carregamento progressivo (_lazy loading_).
- **SEO Semântico:** Uso rigoroso de Tags HTML5 para que o Google entenda a hierarquia da informação.
- **Metadados Dinâmicos:** Cada página deve gerar automaticamente seu título e descrição para redes sociais e buscadores.

### 3.2. Responsividade (Mobile First)

- O site deve ser totalmente funcional em dispositivos móveis, priorizando o acesso rápido ao botão de WhatsApp e à grade de horários.

### 3.3. Segurança e Autenticação

- **Controle de Acesso (RBAC):** Separação clara entre o que é público e o que exige permissão de "Administrador".
- **Proteção de Dados:** Conformidade básica com proteção de dados de alunos (LGPD/GDPR).

---

## 4. Fluxo de Navegação Sugerido

1. **Usuário Anônimo:** Home -> Horários -> Leads (Conversão via Form/WhatsApp).
2. **Administrador:** Login -> Painel de Gestão -> Atualização de Horários/Campeonatos -> Logout.

---
