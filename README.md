# Dojo Digital

An online presence and administrative management platform for martial arts academies. The project is split into two major layers: a high-performance **Public Showcase** (SEO-focused) and a secure **Admin Area** for operational management.

**Primary goal:** Convert website visitors into enrolled students and automate internal academy processes.

---

## Features

### Public Showcase

- **Landing Page** — Hero section with a value proposition and CTA for a trial class, benefits overview, and dynamic student testimonials.
- **Schedule Page** — Interactive class timetable filterable by category (Kids, Adults, Competition).
- **Senseis Page** — Instructor profiles with biography, rank, and specialties.
- **Photo Gallery** — Optimized image grid with categories (Events, Training, Exams) and a lightbox viewer.
- **Championship History** — Records of competition participations and athlete highlights.

### Admin Area (authenticated)

- **Dashboard** — Summary of new leads, active students, and monthly birthdays.
- **Content Management (CMS)** — Create, edit, and delete schedules, gallery photos, and championship results — no code required.
- **Student Management** — Full student registration, belt/graduation tracking, and attendance history.
- **Financial Control** — Monthly fee status monitoring and plan management.

---

## Tech Stack

| Layer              | Technology                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| Framework          | [Next.js](https://nextjs.org) (App Router)                              |
| Language           | TypeScript (Strict Mode)                                                |
| Styling            | [Tailwind CSS v4](https://tailwindcss.com)                              |
| UI Components      | [shadcn/ui](https://ui.shadcn.com) (Radix UI)                           |
| Backend / Database | [Supabase](https://supabase.com) (Auth, PostgreSQL, Storage)            |
| State Management   | [Zustand](https://zustand-demo.pmnd.rs)                                 |
| Forms & Validation | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Testing (Unit)     | [Vitest](https://vitest.dev) + Testing Library                          |
| Testing (E2E)      | [Playwright](https://playwright.dev)                                    |
| Package Manager    | [pnpm](https://pnpm.io)                                                 |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other commands

```bash
pnpm build       # Production build
pnpm lint        # Run ESLint
pnpm test        # Run unit tests (Vitest)
pnpm test-e2e    # Run end-to-end tests (Playwright)
```

---

## Project Structure

```
src/
├── app/          # Routes and layouts (Server Components by default)
├── components/   # UI components, forms, and shared layouts
├── hooks/        # Reusable logic and data-fetching hooks
├── lib/          # Supabase client, utilities, and config
├── services/     # API and database abstraction layer
├── store/        # Zustand stores (global admin state)
├── types/        # Global TypeScript interfaces and types
└── styles/       # Global CSS and theme variables
```

---

## Contact

- GitHub: [Guilherme Benites](https://github.com/GuilhermeBenites)
- LinkedIn: [Guilherme Benites](https://www.linkedin.com/in/guilherme-benites-39639233)
