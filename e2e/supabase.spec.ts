import { test, expect } from "@playwright/test";

// The dev server must be running (pnpm dev) before executing.
// These tests hit the /api/health endpoint to verify DB connectivity.

test.describe("Supabase database health", () => {
  test("health endpoint returns status ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("senseis table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.senseis).toBe(4);
  });

  test("testimonials table has 3 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.testimonials).toBe(3);
  });

  test("schedules table has 6 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.schedules).toBe(6);
  });

  test("gallery_images table has 8 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.gallery_images).toBe(8);
  });

  test("championships table has 3 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.championships).toBe(3);
  });

  test("hall_of_fame table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.hall_of_fame).toBe(4);
  });

  test("dojo_stats table has 1 seeded row", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.dojo_stats).toBe(1);
  });

  test("plans table has 3 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.plans).toBe(3);
  });

  test("belt_exams table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.belt_exams).toBe(4);
  });

  test("drop_in_classes has 2 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.drop_in_classes).toBe(2);
  });

  test("faq_items table has 4 seeded rows", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = await response.json();
    expect(body.counts.faq_items).toBe(4);
  });
});
