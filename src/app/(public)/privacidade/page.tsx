import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const canonical = `${SITE_URL}/privacidade`;

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Política de privacidade do ${SITE_NAME}. Saiba como coletamos e usamos suas informações.`,
  alternates: { canonical },
  robots: { index: false },
};

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        Política de Privacidade
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">
        Última atualização: março de 2025
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>1. Informações que coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente ao preencher
            formulários de contato, agendar aulas ou se matricular, como: nome
            completo, e-mail, telefone e data de nascimento.
          </p>
        </section>

        <section>
          <h2>2. Como usamos suas informações</h2>
          <p>Utilizamos seus dados para:</p>
          <ul>
            <li>Entrar em contato sobre horários, eventos e matrículas;</li>
            <li>Enviar comunicados sobre o dojo (campanhas, feriados, etc.);</li>
            <li>Processar pagamentos de mensalidades;</li>
            <li>Cumprir obrigações legais.</li>
          </ul>
        </section>

        <section>
          <h2>3. Compartilhamento de dados</h2>
          <p>
            Não vendemos nem alugamos seus dados pessoais. Podemos compartilhá-los
            com prestadores de serviço estritamente necessários à operação do dojo
            (ex.: sistema de pagamento), sempre sob obrigação de
            confidencialidade.
          </p>
        </section>

        <section>
          <h2>4. Armazenamento e segurança</h2>
          <p>
            Seus dados são armazenados em servidores seguros e protegidos por
            medidas técnicas e organizacionais adequadas. Mantemos as informações
            apenas pelo tempo necessário às finalidades descritas nesta política.
          </p>
        </section>

        <section>
          <h2>5. Seus direitos (LGPD)</h2>
          <p>
            Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
            você tem direito a: confirmar a existência de tratamento; acessar seus
            dados; corrigir dados incompletos ou incorretos; solicitar exclusão;
            e revogar consentimento a qualquer momento.
          </p>
          <p>
            Para exercer esses direitos, entre em contato pelo WhatsApp{" "}
            <a
              href="https://wa.me/5567992879411"
              target="_blank"
              rel="noopener noreferrer"
            >
              (67) 99287-9411
            </a>
            .
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Este site pode utilizar cookies essenciais para funcionamento e
            análise de desempenho. Você pode desabilitar cookies nas configurações
            do seu navegador, mas isso pode afetar algumas funcionalidades.
          </p>
        </section>

        <section>
          <h2>7. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Alterações relevantes
            serão comunicadas pelo site ou por e-mail.
          </p>
        </section>
      </div>
    </main>
  );
}
