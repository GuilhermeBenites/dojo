import Link from "next/link";
import { Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";

const FOOTER_LINKS = [
  { label: "Início", href: "/" },
  { label: "Senseis", href: "/senseis" },
  { label: "Horários", href: "/horarios" },
  { label: "Planos", href: "/planos" },
] as const;

const INSTAGRAM_URL = "#";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a0b0b]">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 mb-8 md:grid-cols-3">
          {/* Column 1: Logo + description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center text-primary">
                <Swords className="size-10" aria-hidden />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Dojo Luciano dos Santos
              </h2>
            </div>
            <p className="max-w-sm text-slate-500 dark:text-slate-400">
              Transformando vidas através do Karate. Junte-se à nossa família e
              descubra o poder da disciplina e do autocontrole.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="flex flex-col gap-4 md:items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Links Rápidos
            </h3>
            <ul className="flex flex-col gap-2 md:text-center text-slate-500 dark:text-slate-400">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact + social */}
          <div className="flex flex-col gap-6 md:items-end">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Fale Conosco
            </h3>
            <div className="flex gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={cn(
                  "group flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                  "transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30"
                )}
              >
                <svg
                  className="size-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.409-.06 3.809-.06zm1.493 13.93l2.25-1.583a1.5 1.5 0 000-2.694l-2.25-1.583A1.5 1.5 0 0011.5 8.35v3.166a1.5 1.5 0 002.308 1.25zM12 7a5 5 0 100 10 5 5 0 000-10z"
                  />
                </svg>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={cn(
                  "group flex h-12 w-12 items-center justify-center rounded-full",
                  "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                  "transition-all hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-600/30"
                )}
              >
                <svg
                  className="size-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "bg-primary hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg",
                "transition-all shadow-md w-full md:w-auto text-center inline-block"
              )}
            >
              Agende sua aula
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-8 border-t border-slate-200 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Dojo Luciano dos Santos. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
