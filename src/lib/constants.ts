export const WHATSAPP_URL = "https://wa.me/5567992879411";

export const ADMIN_ROUTES = {
  LOGIN: "/admin/login",
  DASHBOARD: "/admin/dashboard",
  CONTENT: "/admin/content",
  STUDENTS: "/admin/students",
  FINANCE: "/admin/finance",
} as const;

export const BELT_OPTIONS = [
  { value: "branca", label: "Branca" },
  { value: "amarela", label: "Amarela" },
  { value: "laranja", label: "Laranja" },
  { value: "verde", label: "Verde" },
  { value: "azul", label: "Azul" },
  { value: "roxa", label: "Roxa" },
  { value: "marrom", label: "Marrom" },
  { value: "preta-1", label: "Preta 1º Dan" },
  { value: "preta-2", label: "Preta 2º Dan" },
  { value: "preta-3", label: "Preta 3º Dan" },
] as const;

export type BeltValue = (typeof BELT_OPTIONS)[number]["value"];
