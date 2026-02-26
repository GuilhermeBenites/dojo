# Especificação Técnica e Padrões de Desenvolvimento

## 1. Stack Tecnológica

- **Framework:** Next.js 14+ (App Router).
- **Linguagem:** TypeScript (Strict Mode).
- **Estilização:** Tailwind CSS.
- **UI Components:** Shadcn/UI (Radix UI).
- **Backend/Database:** Supabase (Auth, PostgreSQL, Storage).
- **Gerenciamento de Estado:** Zustand.
- **ORM/Query:** Supabase Client (ou Prisma/Drizzle opcional).
- **Forms:** React Hook Form + Zod (validação).

---

## 2. Organização de Pastas

```text
src/
├── app/               # Rotas e layouts (Server Components por padrão)
├── components/        # UI (Atom/Molecule), Forms e Shared Layouts
├── hooks/             # Hooks de lógica reutilizável e Queries
├── lib/               # Configurações e instâncias (Supabase, Utils)
├── services/          # Camada de abstração de API e Banco de Dados
├── store/             # Stores Zustand (Estado global do admin)
├── types/             # Interfaces e Types globais do TypeScript
└── styles/            # CSS global e variáveis de tema

```

---

## 3. Diretrizes de Implementação

### 3.1. Server vs Client Components

- **Default:** Todos os componentes devem ser _Server Components_.
- **Use Client:** Somente para componentes que exigem interatividade (onClick, onChange), hooks do React (useState, useEffect) ou Zustand.
- **SEO:** Páginas da vitrine devem ser renderizadas no servidor para garantir indexação.

### 3.2. Gerenciamento de Dados (Supabase)

- **Data Fetching:** Realizar buscas de dados preferencialmente em _Server Components_ utilizando o cliente `supabaseServer`.
- **Server Actions:** Utilizar para mutações de dados (Create, Update, Delete) na área administrativa.
- **Storage:** Imagens da galeria e perfis devem ser buscadas via URLs públicas do Supabase Storage.

### 3.3. Estado Global (Zustand)

- **Escopo:** Utilizado exclusivamente para estados que transcendem componentes únicos na área administrativa (ex: dados do usuário logado, estado de formulários multi-step).
- **Persistência:** Utilizar o middleware `persist` se necessário salvar dados no localStorage.

### 3.4. Estilização e UI

- **Responsividade:** Seguir abordagem _Mobile First_.
- **Shadcn/UI:** Não modificar componentes diretamente na pasta `ui/` se puder ser resolvido via props.
- **Cores:** Utilizar variáveis do Tailwind para manter a consistência da marca.

---

## 4. Boas Práticas e Padrões de Código

### 4.1. TypeScript

- Proibido o uso de `any`.
- Interfaces devem ser exportadas da pasta `types/`.
- Utilizar _Zod schemas_ para validação de entradas de formulários e respostas de API.

### 4.2. Performance

- Utilizar o componente `next/image` para todas as mídias.
- Implementar _Skeleton screens_ para estados de carregamento em listas (horários, campeonatos).
- Utilizar _Dynamic Imports_ para componentes pesados da área administrativa.

### 4.3. Convenções de Nomeclatura

- **Componentes:** PascalCase (`SenseiCard.tsx`).
- **Funções/Hooks:** camelCase (`useGetStudents.ts`).
- **Pastas:** kebab-case (`admin-dashboard`).

---

## 5. Fluxo de Dados para IA

1. **Leitura:** Consultar `services/` para entender as chamadas ao banco.
2. **Schema:** Respeitar os tipos definidos em `types/`.
3. **UI:** Consultar `components/ui` antes de criar novos elementos visuais.
4. **Mutação:** Utilizar _Server Actions_ localizadas dentro de `app/` para ações de escrita.

---
