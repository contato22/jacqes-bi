import Header from "@/components/Header";
import { Trophy, Target, Star, Zap, TrendingUp, Award, BookOpen, Rocket } from "lucide-react";

const careerStats = [
  { label: "Nível Atual", value: "Analista Sênior", sub: "Nível 7", icon: Star, color: "brand" },
  { label: "XP Total", value: "14.820 XP", sub: "+340 esta semana", icon: Zap, color: "amber" },
  { label: "Conquistas", value: "23 / 48", sub: "47% desbloqueadas", icon: Trophy, color: "purple" },
  { label: "Streak", value: "14 dias", sub: "Melhor: 31 dias", icon: TrendingUp, color: "emerald" },
];

const objectives = [
  {
    title: "Dominar Análise de Churn",
    progress: 78,
    xp: 500,
    deadline: "Abr 2026",
    category: "CS Ops",
    completed: false,
  },
  {
    title: "Certificação em BI Avançado",
    progress: 45,
    xp: 1200,
    deadline: "Jun 2026",
    category: "Analytics",
    completed: false,
  },
  {
    title: "Pipeline de Relatórios Automatizados",
    progress: 100,
    xp: 800,
    deadline: "Mar 2026",
    category: "Relatórios",
    completed: true,
  },
  {
    title: "Forecast de Receita Q2 2026",
    progress: 20,
    xp: 650,
    deadline: "Mai 2026",
    category: "Financial",
    completed: false,
  },
  {
    title: "Segmentação RFM de Clientes",
    progress: 100,
    xp: 700,
    deadline: "Fev 2026",
    category: "Carteira",
    completed: true,
  },
];

const achievements = [
  { name: "Primeira Análise", desc: "Completou a primeira análise de dados", icon: BookOpen, unlocked: true },
  { name: "Revenue Master", desc: "Atingiu meta de receita por 3 meses seguidos", icon: TrendingUp, unlocked: true },
  { name: "CS Champion", desc: "Zero churn por 60 dias consecutivos", icon: Award, unlocked: true },
  { name: "Data Wizard", desc: "Criou 10 relatórios customizados", icon: Star, unlocked: true },
  { name: "Rocket Launch", desc: "Lançou produto com +20% adoção em 30 dias", icon: Rocket, unlocked: false },
  { name: "Golden Trophy", desc: "Atingiu todas as metas do trimestre", icon: Trophy, unlocked: false },
];

const activityFeed = [
  { action: "Concluiu objetivo", detail: "Pipeline de Relatórios Automatizados", xp: "+800 XP", time: "2 dias atrás", positive: true },
  { action: "Novo streak", detail: "14 dias consecutivos de login", xp: "+50 XP", time: "Hoje", positive: true },
  { action: "Conquista desbloqueada", detail: "Data Wizard — 10 relatórios criados", xp: "+200 XP", time: "5 dias atrás", positive: true },
  { action: "Meta atualizada", detail: "Progresso em Análise de Churn: 78%", xp: "+120 XP", time: "1 semana atrás", positive: true },
];

export default function ModoCarreiraPage() {
  return (
    <>
      <Header
        title="Modo Carreira"
        subtitle="Desenvolvimento profissional, conquistas e evolução de habilidades"
      />

      <div className="px-8 py-6 space-y-6">
        {/* Career stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {careerStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5 flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    s.color === "brand"
                      ? "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                      : s.color === "amber"
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      : s.color === "purple"
                      ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                      : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-lg font-bold text-white leading-tight">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* XP Progress bar */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-white">Progresso de Nível</div>
              <div className="text-xs text-gray-500 mt-0.5">
                14.820 XP de 18.000 XP para Nível 8 — Especialista
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Próximo nível</div>
              <div className="text-sm font-bold text-brand-400 mt-0.5">Especialista</div>
            </div>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-purple-500 rounded-full transition-all"
              style={{ width: "82%" }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-600">
            <span>Nível 7</span>
            <span>82% — faltam 3.180 XP</span>
            <span>Nível 8</span>
          </div>
        </div>

        {/* Objectives + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Objectives */}
          <div className="xl:col-span-2 card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Objetivos de Desenvolvimento</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Metas de habilidade e conhecimento em progresso
              </p>
            </div>
            <div className="space-y-4">
              {objectives.map((obj) => (
                <div key={obj.title} className={obj.completed ? "opacity-60" : ""}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <Target
                        size={14}
                        className={`mt-0.5 shrink-0 ${
                          obj.completed ? "text-emerald-400" : "text-brand-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${
                            obj.completed
                              ? "text-gray-500 line-through"
                              : "text-gray-200"
                          }`}
                        >
                          {obj.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="badge badge-blue text-[10px]">{obj.category}</span>
                          <span className="text-[10px] text-gray-600">prazo: {obj.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-amber-400">+{obj.xp} XP</div>
                      <div className="text-[10px] text-gray-600 mt-0.5">{obj.progress}%</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden ml-5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        obj.completed
                          ? "bg-emerald-500"
                          : "bg-gradient-to-r from-brand-600 to-brand-400"
                      }`}
                      style={{ width: `${obj.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="card p-6">
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-white">Atividade Recente</h2>
              <p className="text-xs text-gray-500 mt-0.5">Histórico de progresso e XP</p>
            </div>
            <div className="space-y-3">
              {activityFeed.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 pb-3 border-b border-gray-800/50 last:border-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-300">{item.action}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      {item.detail}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-gray-600">{item.time}</span>
                      <span className="text-[10px] font-semibold text-amber-400">{item.xp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Conquistas</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              23 de 48 desbloqueadas — continue evoluindo!
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {achievements.map((ach) => {
              const Icon = ach.icon;
              return (
                <div
                  key={ach.name}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${
                    ach.unlocked
                      ? "bg-brand-500/10 border-brand-500/30"
                      : "bg-gray-800/30 border-gray-800 opacity-40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      ach.unlocked
                        ? "bg-brand-500/20 text-brand-400"
                        : "bg-gray-700 text-gray-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="text-xs font-semibold text-gray-200 leading-tight">
                    {ach.name}
                  </div>
                  <div className="text-[10px] text-gray-500 leading-snug">{ach.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
