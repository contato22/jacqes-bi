import Header from "@/components/Header";
import {
  FileBarChart,
  Users,
  AlertTriangle,
  MapPin,
  AlertOctagon,
  TrendingUp,
  FileText,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatorioDados {
  icon: React.ElementType;
  title: string;
  description: string;
  status: "disponivel" | "em_breve";
  color: string;
}

const relatorios: RelatorioDados[] = [
  {
    icon: FileBarChart,
    title: "Resumo Mensal do Danilo",
    description:
      "Visão consolidada do mês: score por dimensão, evolução operacional, contas acompanhadas e principais movimentos de Março 2026.",
    status: "disponivel",
    color: "bg-brand-500/10 border border-brand-500/20 text-brand-400",
  },
  {
    icon: Users,
    title: "Relatório de Saúde da Carteira",
    description:
      "Status de saúde, risco e oportunidade por conta. Inclui tendências, responsividade do cliente e gestão de risco por conta.",
    status: "disponivel",
    color: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
  },
  {
    icon: AlertTriangle,
    title: "Relatório de Contas em Risco",
    description:
      "Contas com risco Alto ou Médio, motivo de risco identificado, pendências críticas e plano de ação recomendado.",
    status: "disponivel",
    color: "bg-red-500/10 border border-red-500/20 text-red-400",
  },
  {
    icon: MapPin,
    title: "Relatório de Visitas e Follow-ups",
    description:
      "Visitas realizadas vs. planejadas, follow-ups no prazo, SLA de resposta por conta e reagendamentos pendentes.",
    status: "disponivel",
    color: "bg-blue-500/10 border border-blue-500/20 text-blue-400",
  },
  {
    icon: AlertOctagon,
    title: "Relatório de Pendências Críticas",
    description:
      "Todas as pendências críticas e vencidas por conta, com responsável, prazo e status de resolução.",
    status: "disponivel",
    color: "bg-orange-500/10 border border-orange-500/20 text-orange-400",
  },
  {
    icon: TrendingUp,
    title: "Relatório de Evolução Operacional",
    description:
      "Histórico de score por dimensão ao longo dos meses, comparativo com metas e projeção para próximo período.",
    status: "em_breve",
    color: "bg-purple-500/10 border border-purple-500/20 text-purple-400",
  },
  {
    icon: FileText,
    title: "Relatório de Processos Criados",
    description:
      "Checklists, SOPs e templates criados no período. Índice de autonomia e ativos reutilizáveis documentados.",
    status: "em_breve",
    color: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400",
  },
  {
    icon: Star,
    title: "Relatório de Oportunidades de Expansão",
    description:
      "Contas com oportunidade identificada, análise de potencial de expansão e próximos passos recomendados.",
    status: "em_breve",
    color: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
  },
];

function RelatrioCard({ icon: Icon, title, description, status, color }: RelatorioDados) {
  const disponivel = status === "disponivel";
  return (
    <div className={cn("card p-5 flex flex-col gap-4", !disponivel && "opacity-60")}>
      <div className="flex items-start justify-between">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <Icon size={18} />
        </div>
        <span
          className={cn(
            "badge text-[10px]",
            disponivel ? "badge-green" : "badge-yellow"
          )}
        >
          {disponivel ? "Disponível" : "Em breve"}
        </span>
      </div>
      <div>
        <div className="font-semibold text-gray-200">{title}</div>
        <div className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</div>
      </div>
      <div className="pt-2 border-t border-gray-800">
        {disponivel ? (
          <button className="btn-primary text-xs w-full text-center">
            Ver relatório
          </button>
        ) : (
          <button
            disabled
            className="w-full text-center text-xs text-gray-600 py-1.5 rounded-lg border border-gray-800 cursor-not-allowed"
          >
            Em construção
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const disponivelCount = relatorios.filter((r) => r.status === "disponivel").length;
  const emBreveCount = relatorios.filter((r) => r.status === "em_breve").length;

  return (
    <>
      <Header
        title="Relatórios"
        subtitle="Relatórios operacionais — Danilo · CS & Operações · AWQ Group"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Summary bar */}
        <div className="card p-4 flex items-center gap-4 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Relatórios — Março 2026
          </span>
          <div className="flex items-center gap-2 ml-2">
            <span className="badge badge-green">{disponivelCount} disponíveis</span>
            <span className="badge badge-yellow">{emBreveCount} em breve</span>
          </div>
        </div>

        {/* Report cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {relatorios.map((relatorio) => (
            <RelatrioCard key={relatorio.title} {...relatorio} />
          ))}
        </div>
      </div>
    </>
  );
}
