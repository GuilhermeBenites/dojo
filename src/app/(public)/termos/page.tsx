import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const canonical = `${SITE_URL}/termos`;

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: `Termos de uso do ${SITE_NAME}. Condições para acesso ao site e matrícula no dojo.`,
  alternates: { canonical },
  robots: { index: false },
};

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        Termos de Uso
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">
        Última atualização: março de 2025
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao acessar este site ou se matricular no Dojo Luciano dos Santos,
            você concorda com os termos e condições descritos neste documento. Caso
            não concorde, por favor, não utilize nossos serviços.
          </p>
        </section>

        <section>
          <h2>2. Serviços oferecidos</h2>
          <p>
            O Dojo Luciano dos Santos oferece aulas de Karate Shotokan para todas
            as idades, sob orientação de sensei credenciado pela Federação de
            Karate de Mato Grosso do Sul (FKMS). Os horários, planos e valores
            estão sujeitos a alteração sem aviso prévio.
          </p>
        </section>

        <section>
          <h2>3. Matrícula e pagamento</h2>
          <ul>
            <li>
              A matrícula é efetivada após o preenchimento da ficha cadastral e o
              pagamento da primeira mensalidade.
            </li>
            <li>
              Mensalidades vencidas após 10 dias incorrem em multa de 2% e juros
              de 1% ao mês.
            </li>
            <li>
              O cancelamento deve ser solicitado com 30 dias de antecedência. Não
              há reembolso de mensalidades já pagas.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Responsabilidade e saúde</h2>
          <p>
            O aluno ou responsável declara estar ciente dos riscos inerentes à
            prática de artes marciais e isenta o dojo de responsabilidade por
            lesões decorrentes de uso inadequado das instalações ou desobediência
            às orientações do sensei. Recomendamos consulta médica antes de
            iniciar a prática.
          </p>
        </section>

        <section>
          <h2>5. Código de conduta</h2>
          <p>
            Espera-se de todos os alunos respeito ao sensei, colegas e às
            instalações. Comportamentos contrários ao espírito do Karate — como
            violência fora do tatame, bullying ou desrespeito — podem resultar em
            suspensão ou cancelamento da matrícula.
          </p>
        </section>

        <section>
          <h2>6. Uso do site</h2>
          <p>
            O conteúdo deste site (textos, imagens, logotipos) é de propriedade
            do Dojo Luciano dos Santos e não pode ser reproduzido sem autorização.
            É proibido utilizar o site para fins ilegais ou que prejudiquem
            terceiros.
          </p>
        </section>

        <section>
          <h2>7. Limitação de responsabilidade</h2>
          <p>
            O dojo não se responsabiliza por danos indiretos decorrentes do uso
            do site ou interrupções no serviço. As informações publicadas têm
            caráter informativo e podem ser atualizadas a qualquer momento.
          </p>
        </section>

        <section>
          <h2>8. Contato</h2>
          <p>
            Dúvidas sobre estes termos podem ser enviadas pelo WhatsApp{" "}
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
      </div>
    </main>
  );
}
