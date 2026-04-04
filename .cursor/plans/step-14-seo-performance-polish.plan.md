---
name: Step 14 — SEO, Performance, and Production Polish
overview: Final pass to maximize search engine visibility, runtime performance, and production readiness. Adds metadataBase + title templates to the root layout, upgrades all public page metadata (Twitter cards, OG images, keywords), generates sitemap.xml and robots.txt via Next.js API, implements JSON-LD structured data (LocalBusiness + SportsEvent schemas), adds a floating WhatsApp FAB, creates loading.tsx for all public routes, and delivers custom not-found/error pages. Closes the project with a full E2E test run confirming the complete anonymous conversion path.
todos:
  - id: s14-01
    content: "Phase 1: Root layout — add metadataBase, title.template, and shared SEO constants"
    status: pending
  - id: s14-02
    content: "Phase 2: Upgrade metadata on all public pages — Twitter cards, OG images, locale, keywords"
    status: pending
  - id: s14-03
    content: "Phase 3: sitemap.ts + robots.ts — list all public routes, disallow admin"
    status: pending
  - id: s14-04
    content: "Phase 4: JSON-LD structured data — LocalBusiness (root layout) + SportsEvent (campeonatos)"
    status: pending
  - id: s14-05
    content: "Phase 5: Floating WhatsApp FAB — fixed-position button injected in public layout"
    status: pending
  - id: s14-06
    content: "Phase 6: Public route loading.tsx skeletons — one per public route"
    status: pending
  - id: s14-07
    content: "Phase 7: Custom error pages — not-found.tsx + error.tsx at root"
    status: pending
  - id: s14-08
    content: "Phase 8: E2E tests — seo-performance.spec.ts covering meta, sitemap, WhatsApp FAB, conversion path"
    status: pending
isProject: false
---

# Step 14 — SEO, Performance, and Production Polish

## Context

Steps 1–13 produced a fully functional site: six public pages with live Supabase data, a complete admin area (CMS + students + dashboard + finance), and authentication. This final step applies the production veneer:

| Gap                             | Current state                                          |
| ------------------------------- | ------------------------------------------------------ |
| `metadataBase` / title template | Not set — OG image URLs will be relative, not absolute |
| Twitter card metadata           | Missing on all pages                                   |
| OG images                       | Missing on all pages                                   |
| `sitemap.xml`                   | Does not exist                                         |
| `robots.txt`                    | Does not exist                                         |
| JSON-LD structured data         | None                                                   |
| Floating WhatsApp button        | Only in Navbar/Footer — no persistent FAB              |
| Public route `loading.tsx`      | None — pages have no Suspense skeleton screens         |
| Custom 404 / error page         | Next.js default pages used                             |

**Architecture:** Server Components handle all SEO output (metadata, JSON-LD, structured data). The WhatsApp FAB is the only new client component. No new Shadcn installs required.

---

## Phase 1: Root Layout — metadataBase and Title Template

### `src/lib/constants.ts` — add SEO constants

Append to the existing constants file:

```typescript
// SEO
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dojoludanosantos.com.br";
export const SITE_NAME = "Dojo Luciano dos Santos Karate";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

// Social
export const INSTAGRAM_URL = "https://instagram.com/dojoludanosantos"; // update if known
```

`NEXT_PUBLIC_SITE_URL` is an env var set at deploy time (Vercel) to the canonical domain. The fallback ensures the plan works locally.

### `public/og-image.png`

Place a 1200×630 px Open Graph image at `public/og-image.png`. The image should include the dojo logo and brand colours. This is a design asset — create a placeholder now and replace with the final artwork before launch.

### `src/app/layout.tsx`

Replace the current static `metadata` export with a fully configured one:

```typescript
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, OG_IMAGE_URL } from "@/lib/constants";

const lexend = Lexend({ ... }); // keep existing

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | Tradição & Disciplina`,
  },
  description:
    "Disciplina, foco e autodefesa para todas as idades. Transforme sua mente e corpo com a tradição do verdadeiro Karate.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dojoludanosantos", // update if handle differs
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout(...) { /* unchanged */ }
```

**Why `metadataBase` matters:** Without it, Next.js cannot resolve relative paths in `openGraph.images` to absolute URLs — Google and social scrapers receive broken image links.

---

## Phase 2: Upgrade Metadata on All Public Pages

The root layout now provides `openGraph.images`, `twitter`, and `metadataBase`. Each page only needs to set page-specific fields. Update each file's `metadata` export as follows. Pattern:

```typescript
export const metadata: Metadata = {
  title: "<Short page title>",           // template appends " | Dojo Luciano dos Santos Karate"
  description: "<150 char description>",
  keywords: [...],
  openGraph: {
    title: "<Same or slightly longer OG title>",
    description: "<Same description>",
    url: "<absolute canonical URL for this page>",
    // images and siteName inherited from root
  },
  // twitter card inherited from root
  alternates: { canonical: "<absolute URL>" },
};
```

### Per-page changes

| File                                    | `title`                      | `keywords`                                               | `openGraph.url` / `alternates.canonical` |
| --------------------------------------- | ---------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| `src/app/(public)/page.tsx`             | `"Karate em Dourados MS"`    | `["karate", "dojo", "artes marciais", "Dourados", "MS"]` | `SITE_URL`                               |
| `src/app/(public)/senseis/page.tsx`     | `"Nossos Senseis"`           | `["sensei", "faixa preta", "instrutor de karate"]`       | `${SITE_URL}/senseis`                    |
| `src/app/(public)/horarios/page.tsx`    | `"Localização & Horários"`   | `["horário karate", "academia karate Dourados"]`         | `${SITE_URL}/horarios`                   |
| `src/app/(public)/galeria/page.tsx`     | `"Galeria de Fotos"`         | `["galeria karate", "fotos dojo"]`                       | `${SITE_URL}/galeria`                    |
| `src/app/(public)/campeonatos/page.tsx` | `"Campeonatos & Conquistas"` | `["campeonato karate", "resultados", "medalhas"]`        | `${SITE_URL}/campeonatos`                |
| `src/app/(public)/planos/page.tsx`      | `"Planos e Valores"`         | `["mensalidade karate", "preço karate Dourados"]`        | `${SITE_URL}/planos`                     |

**Note on `title`:** With `title.template = "%s | Dojo Luciano dos Santos Karate"` set in root, setting `title: "Nossos Senseis"` on the page renders as `"Nossos Senseis | Dojo Luciano dos Santos Karate"` in the browser tab and in search results — no changes needed to pages that already have this pattern.

---

## Phase 3: sitemap.ts + robots.ts

### `src/app/sitemap.ts` (new file)

```typescript
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/senseis", priority: 0.8, changeFrequency: "monthly" },
    { path: "/horarios", priority: 0.9, changeFrequency: "weekly" },
    { path: "/galeria", priority: 0.7, changeFrequency: "weekly" },
    { path: "/campeonatos", priority: 0.8, changeFrequency: "monthly" },
    { path: "/planos", priority: 0.9, changeFrequency: "monthly" },
  ] as const;

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
```

Next.js automatically serves this at `/sitemap.xml`.

### `src/app/robots.ts` (new file)

```typescript
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

Next.js serves this at `/robots.txt`.

---

## Phase 4: JSON-LD Structured Data

### `src/components/json-ld.tsx` (new file — no "use client")

A thin utility component that injects a JSON-LD `<script>` tag:

```typescript
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### LocalBusiness schema — inject in `src/app/(public)/layout.tsx`

Add below the existing layout:

```typescript
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, WHATSAPP_URL } from "@/lib/constants";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Dojo Luciano dos Santos Karate",
  description:
    "Escola de Karate com ensino para crianças e adultos em Dourados, MS.",
  url: SITE_URL,
  telephone: "+5567992879411",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dourados",
    addressRegion: "MS",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Wednesday", "Friday"],
      opens: "07:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Thursday"],
      opens: "07:00",
      closes: "21:00",
    },
  ],
  sameAs: [WHATSAPP_URL],
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppFab />  {/* added in Phase 5 */}
    </>
  );
}
```

### SportsEvent schema — `src/app/(public)/campeonatos/page.tsx`

On the championships page, fetch the championships list and inject a JSON-LD `ItemList` of events:

```typescript
import { JsonLd } from "@/components/json-ld";
import { getChampionships } from "@/services/championships";
import { SITE_URL } from "@/lib/constants";

// Inside the async page component:
const championships = await getChampionships();

const eventsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Campeonatos — Dojo Luciano dos Santos",
  itemListElement: championships.map((c, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SportsEvent",
      name: c.name,
      startDate: c.date,
      location: {
        "@type": "Place",
        name: c.location,
      },
    },
  })),
};

return (
  <>
    <JsonLd data={eventsSchema} />
    {/* existing JSX */}
  </>
);
```

---

## Phase 5: Floating WhatsApp FAB

### `src/components/whatsapp-fab.tsx` (new file — "use client")

A fixed-position button that persists across all public pages. Visible on all viewports; larger on mobile to aid thumb reach.

```typescript
"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className={[
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2",
        "bg-[#25D366] hover:bg-[#1ebe5d] text-white",
        "rounded-full shadow-lg",
        "px-4 py-3 sm:px-5 sm:py-4",
        "transition-transform hover:scale-105 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-semibold">
        Fale conosco
      </span>
    </a>
  );
}
```

**Mobile:** shows just the icon circle at `bottom-6 right-6` (icon only, smaller).
**Desktop (sm+):** expands to pill shape with "Fale conosco" label.

**Inject** in `src/app/(public)/layout.tsx` — see Phase 4 code above for placement (after `<Footer />`).

---

## Phase 6: Public Route Loading Skeletons

Create one `loading.tsx` per public route. Next.js automatically renders these via Suspense while the page's async Server Component resolves. All use the same minimal skeleton pattern: a tall placeholder matching the above-the-fold content shape.

### `src/app/(public)/loading.tsx` (root public loading — catches home `/`)

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero skeleton */}
      <Skeleton className="h-[70vh] w-full rounded-none" />
      {/* Benefits grid skeleton */}
      <div className="container mx-auto py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
```

### `src/app/(public)/senseis/loading.tsx`

```tsx
export default function SenseisLoading() {
  return (
    <div className="space-y-12 py-16 container mx-auto">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
```

### `src/app/(public)/horarios/loading.tsx`

```tsx
export default function HorariosLoading() {
  return (
    <div className="space-y-8 py-16 container mx-auto">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
```

### `src/app/(public)/galeria/loading.tsx`

```tsx
export default function GaleriaLoading() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-16 container mx-auto space-y-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`w-full rounded-xl ${i % 3 === 0 ? "h-64" : "h-48"}`}
        />
      ))}
    </div>
  );
}
```

### `src/app/(public)/campeonatos/loading.tsx`

```tsx
export default function CampeonatosLoading() {
  return (
    <div className="space-y-12 py-16 container mx-auto">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}
```

### `src/app/(public)/planos/loading.tsx`

```tsx
export default function PlanosLoading() {
  return (
    <div className="space-y-12 py-16 container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
```

---

## Phase 7: Custom Error Pages

### `src/app/not-found.tsx` (root — new file)

Branded 404 page using public layout elements:

```tsx
import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-7xl font-black text-primary">404</p>
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground max-w-md">
        A página que você procura não existe ou foi movida. Volte para a página
        inicial ou fale conosco pelo WhatsApp.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Ir para o início
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
```

### `src/app/error.tsx` (root — new file — "use client")

Next.js error boundaries must be Client Components:

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-5xl font-black text-primary">Oops!</p>
      <h1 className="text-2xl font-bold">Algo deu errado</h1>
      <p className="text-muted-foreground max-w-md">
        Ocorreu um erro inesperado. Tente novamente ou volte para a página
        inicial.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="rounded-full border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
        >
          Página inicial
        </Link>
      </div>
    </div>
  );
}
```

---

## Phase 8: E2E Tests

**File:** `tests/seo-performance.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

// ── Meta & OG ────────────────────────────────────────────────────────────────

test.describe("SEO — meta tags", () => {
  const pages = [
    { path: "/", titleFragment: "Dojo Luciano dos Santos" },
    { path: "/senseis", titleFragment: "Senseis" },
    { path: "/horarios", titleFragment: "Horários" },
    { path: "/galeria", titleFragment: "Galeria" },
    { path: "/campeonatos", titleFragment: "Campeonatos" },
    { path: "/planos", titleFragment: "Planos" },
  ];

  for (const { path, titleFragment } of pages) {
    test(`${path} — title contains "${titleFragment}"`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(new RegExp(titleFragment, "i"));
    });

    test(`${path} — has OG title meta`, async ({ page }) => {
      await page.goto(path);
      const og = page.locator('meta[property="og:title"]');
      await expect(og).toHaveAttribute("content", /.+/);
    });

    test(`${path} — has Twitter card meta`, async ({ page }) => {
      await page.goto(path);
      const twitter = page.locator('meta[name="twitter:card"]');
      await expect(twitter).toHaveAttribute("content", "summary_large_image");
    });

    test(`${path} — has canonical link`, async ({ page }) => {
      await page.goto(path);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute("href", /.+/);
    });
  }
});

// ── Sitemap & Robots ─────────────────────────────────────────────────────────

test.describe("SEO — sitemap & robots", () => {
  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("<urlset");
  });

  test("sitemap.xml lists all 6 public routes", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    const body = await page.content();
    for (const path of [
      "/senseis",
      "/horarios",
      "/galeria",
      "/campeonatos",
      "/planos",
    ]) {
      expect(body).toContain(path);
    }
  });

  test("robots.txt disallows /admin/", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const body = await page.content();
    expect(body).toContain("Disallow: /admin/");
  });
});

// ── JSON-LD ───────────────────────────────────────────────────────────────────

test.describe("SEO — JSON-LD structured data", () => {
  test("home page has LocalBusiness / SportsActivityLocation schema", async ({
    page,
  }) => {
    await page.goto("/");
    const ld = page.locator('script[type="application/ld+json"]');
    await expect(ld).toHaveCount(1);
    const content = await ld.innerText();
    const json = JSON.parse(content);
    expect(json["@type"]).toMatch(/SportsActivityLocation|LocalBusiness/);
  });

  test("campeonatos page has SportsEvent / ItemList schema", async ({
    page,
  }) => {
    await page.goto("/campeonatos");
    const ld = page.locator('script[type="application/ld+json"]');
    // 2 scripts: LocalBusiness (layout) + ItemList (page)
    await expect(ld).toHaveCount(2);
  });
});

// ── WhatsApp FAB ──────────────────────────────────────────────────────────────

test.describe("WhatsApp FAB", () => {
  test("FAB is visible on home page", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toBeVisible();
  });

  test("FAB href points to wa.me URL", async ({ page }) => {
    await page.goto("/");
    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toHaveAttribute("href", /wa\.me/);
  });

  test("FAB is visible on /planos", async ({ page }) => {
    await page.goto("/planos");
    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toBeVisible();
  });
});

// ── Conversion Path E2E ───────────────────────────────────────────────────────

test.describe("Conversion path — anonymous user", () => {
  test("visits Home → navigates to Horários → WhatsApp CTA resolves", async ({
    page,
  }) => {
    // Step 1: land on home
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Step 2: navigate to schedules via Navbar
    await page
      .getByRole("link", { name: /horários/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/horarios/);
    await expect(
      page.getByRole("heading", { name: /localização/i }),
    ).toBeVisible();

    // Step 3: click WhatsApp FAB
    const fab = page.getByRole("link", { name: /whatsapp/i });
    await expect(fab).toBeVisible();
    // Verify href is correct (don't actually open WhatsApp)
    await expect(fab).toHaveAttribute("href", /wa\.me\/5567992879411/);
  });
});

// ── Error Pages ───────────────────────────────────────────────────────────────

test.describe("Error pages", () => {
  test("404 page renders for unknown route", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-xyz");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("link", { name: /início/i })).toBeVisible();
  });
});
```

---

## Quality Test Checklist

- `pnpm build` completes with zero TypeScript errors and zero warnings
- All 6 public pages have `<title>` matching `"<Page Title> | Dojo Luciano dos Santos Karate"` in the browser tab
- `<meta property="og:image">` resolves to an absolute URL on every page
- `<meta name="twitter:card" content="summary_large_image">` present on every page
- `/sitemap.xml` returns HTTP 200 and lists all 6 public routes
- `/robots.txt` returns HTTP 200 and includes `Disallow: /admin/`
- `view-source:/` contains `<script type="application/ld+json">` with `SportsActivityLocation` schema
- `view-source:/campeonatos` contains two JSON-LD scripts (LocalBusiness + ItemList)
- WhatsApp FAB is visible and clickable on all public pages, including mobile viewport (375px)
- FAB `href` includes `5567992879411`
- Navigating to `/this-page-does-not-exist` shows the custom 404 page
- `loading.tsx` skeletons appear during simulated slow navigation (verify in browser with throttled network)
- Full conversion path: Home → Horários → WhatsApp FAB all resolve without JS errors
- E2E suite passes: `pnpm test-e2e tests/seo-performance.spec.ts`

---

## Shadcn Components Required

No new components to install — all UI primitives are already available.

---

## File Summary

| File                                       | Action                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| `src/lib/constants.ts`                     | **Modify** — add `SITE_URL`, `SITE_NAME`, `OG_IMAGE_URL`, `INSTAGRAM_URL`     |
| `public/og-image.png`                      | **Create** — 1200×630 Open Graph image asset                                  |
| `src/app/layout.tsx`                       | **Modify** — add `metadataBase`, `title.template`, full OG + Twitter defaults |
| `src/app/(public)/page.tsx`                | **Modify** — upgrade metadata (title, keywords, canonical, OG url)            |
| `src/app/(public)/senseis/page.tsx`        | **Modify** — upgrade metadata                                                 |
| `src/app/(public)/horarios/page.tsx`       | **Modify** — upgrade metadata                                                 |
| `src/app/(public)/galeria/page.tsx`        | **Modify** — upgrade metadata                                                 |
| `src/app/(public)/campeonatos/page.tsx`    | **Modify** — upgrade metadata + inject SportsEvent JSON-LD                    |
| `src/app/(public)/planos/page.tsx`         | **Modify** — upgrade metadata                                                 |
| `src/app/sitemap.ts`                       | **New** — dynamic sitemap for all public routes                               |
| `src/app/robots.ts`                        | **New** — robots directives, disallow /admin/                                 |
| `src/components/json-ld.tsx`               | **New** — thin JSON-LD script injector component                              |
| `src/app/(public)/layout.tsx`              | **Modify** — inject `<JsonLd>` (LocalBusiness), `<WhatsAppFab>`               |
| `src/components/whatsapp-fab.tsx`          | **New** — fixed-position WhatsApp CTA button                                  |
| `src/app/(public)/loading.tsx`             | **New** — home page Suspense skeleton                                         |
| `src/app/(public)/senseis/loading.tsx`     | **New**                                                                       |
| `src/app/(public)/horarios/loading.tsx`    | **New**                                                                       |
| `src/app/(public)/galeria/loading.tsx`     | **New**                                                                       |
| `src/app/(public)/campeonatos/loading.tsx` | **New**                                                                       |
| `src/app/(public)/planos/loading.tsx`      | **New**                                                                       |
| `src/app/not-found.tsx`                    | **New** — branded 404 page                                                    |
| `src/app/error.tsx`                        | **New** — client-side error boundary page                                     |
| `tests/seo-performance.spec.ts`            | **New** — E2E tests covering meta, sitemap, FAB, conversion path, error pages |
