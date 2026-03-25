import Header from "@/components/Header";
import { FileBarChart, Download, Calendar, TrendingUp, Users, Globe } from "lucide-react";

interface ReportCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  lastGenerated: string;
  type: string;
  color: string;
}

function ReportCard({ icon: Icon, title, description, lastGenerated, type, color }: ReportCardProps) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        <span className="badge badge-blue">{type}</span>
      </div>
      <div>
        <div className="font-semibold text-gray-200">{title}</div>
        <div className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
        <span className="text-xs text-gray-600">Gerado em: {lastGenerated}</span>
        <button className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
          <Download size={12} />
          Exportar
        </button>
      </div>
    </div>
  );
}

const reports: ReportCardProps[] = [
  {
    icon: TrendingUp,
    title: "Relatório de Receita Mensal",
    description:
      "Detalhamento completo de receitas, despesas e margens de lucro com comparações YoY e análise por segmento.",
    lastGenerated: "18 Mar 2026",
    type: "Financeiro",
    color: "bg-brand-500/10 border border-brand-500/20 text-brand-400",
  },
  {
    icon: Users,
    title: "Relatório de Saúde de Clientes",
    description:
      "Pontuações NPS, scoring de risco de churn, análise de coorte LTV e planos de ação para contas em risco.",
    lastGenerated: "15 Mar 2026",
    type: "Clientes",
    color: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
  },
  {
    icon: Globe,
    title: "Relatório de Performance Regional",
    description:
      "Distribuição geográfica de receita, taxas de penetração de mercado e scoring de oportunidades de expansão.",
    lastGenerated: "12 Mar 2026",
    type: "Estratégia",
    color: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400",
  },
  {
    icon: FileBarChart,
    title: "Relatório de Analytics de Produtos",
    description:
      "Métricas de uso, adoção de features, receita por SKU e análise de trajetória de crescimento por linha de produto.",
    lastGenerated: "10 Mar 2026",
    type: "Produto",
    color: "bg-purple-500/10 border border-purple-500/20 text-purple-400",
  },
  {
    icon: Calendar,
    title: "Board Report Q1 2026",
    description:
      "Sumário executivo para o conselho do AWQ Group — dashboard de KPIs, marcos estratégicos e guidance.",
    lastGenerated: "5 Mar 2026",
    type: "Executivo",
    color: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Auditoria de Canais de Aquisição",
    description:
      "Breakdown de CAC, ROI por canal, modelagem de atribuição e recomendações de alocação de budget.",
    lastGenerated: "1 Mar 2026",
    type: "Marketing",
    color: "bg-pink-500/10 border border-pink-500/20 text-pink-400",
  },
];

export default function RelatoriosPage() {
  return (
    <>
      <Header
        title="Relatórios"
        subtitle="Relatórios gerados e exportações de dados para stakeholders do JACQES"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Quick action bar */}
        <div className="card p-4 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
            Gerar:
          </span>
          {["Resumo Mensal", "Coorte de Clientes", "Previsão de Receita", "Relatório Customizado"].map(
            (label) => (
              <button
                key={label}
                className={label === "Relatório Customizado" ? "btn-primary" : "btn-secondary"}
              >
                {label}
              </button>
            )
          )}
        </div>

        {/* Report cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.title} {...report} />
          ))}
        </div>

        {/* Scheduled reports */}
        <div className="card p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-white">Relatórios Agendados</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Entrega automática para stakeholders do AWQ Group
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                name: "Digest Semanal de Receita",
                freq: "Toda segunda às 09:00",
                recipients: "board@awqgroup.com, cfo@jacqes.com",
                active: true,
              },
              {
                name: "Pulse Diário de KPIs",
                freq: "Diário às 07:00",
                recipients: "analytics@jacqes.com",
                active: true,
              },
              {
                name: "Pack Mensal do Conselho",
                freq: "Todo dia 1 do mês",
                recipients: "board@awqgroup.com",
                active: true,
              },
              {
                name: "Atualização Trimestral de Investidores",
                freq: "1 Jan, Abr, Jul, Out",
                recipients: "investors@awqgroup.com",
                active: false,
              },
            ].map((sched) => (
              <div
                key={sched.name}
                className="flex items-center gap-4 py-3 border-b border-gray-800/50 last:border-0"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    sched.active ? "bg-emerald-400 animate-pulse" : "bg-gray-700"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200">{sched.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {sched.freq} · {sched.recipients}
                  </div>
                </div>
                <span className={`badge ${sched.active ? "badge-green" : "badge-red"}`}>
                  {sched.active ? "Ativo" : "Pausado"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
