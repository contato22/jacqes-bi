import {
  Instagram, Linkedin, Mail, Globe, Phone,
  TrendingUp, TrendingDown, Minus,
  Target, Star, BarChart2, Megaphone,
  CheckCircle, AlertCircle, Clock, Calendar,
  Youtube, MessageSquare,
} from "lucide-react";
import { type MarketingCliente, type CanalMarketing } from "@/lib/data";
import { cn } from "@/lib/utils";
import BasesDadosCard from "./BasesDadosCard";

// ─── canal icon map ────────────────────────────────────────────────────────────

const canalIconMap: Record<string, React.ElementType> = {
  instagram:  Instagram,
  linkedin:   Linkedin,
  email:      Mail,
  site:       Globe,
  whatsapp:   Phone,
  tiktok:     TrendingUp,
  youtube:    Youtube,
  meta_ads:   Megaphone,
  google_ads: BarChart2,
  outro:      Star,
};

const statusCanalConfig = {
  ativo:            { badge: "badge-green",  label: "Ativo"           },
  pausado:          { badge: "badge-yellow", label: "Pausado"         },
  "em_estruturação":{ badge: "badge-blue",   label: "Em estruturação" },
  inativo:          { badge: "badge text-gray-600 bg-gray-800", label: "Inativo" },
} as const;

const statusCampanhaConfig = {
  ativa:     { badge: "badge-green",  label: "Ativa"     },
  pausada:   { badge: "badge-yellow", label: "Pausada"   },
  encerrada: { badge: "badge text-gray-500 bg-gray-800", label: "Encerrada" },
  planejada: { badge: "badge-blue",   label: "Planejada" },
} as const;

// ─── sub-cards ────────────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} className="text-brand-400" />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DeltaBadge({ delta }: { delta?: number }) {
  if (delta === undefined || delta === 0) return null;
  const up = delta > 0;
  return (
    <span className={cn(
      "flex items-center gap-0.5 text-[10px] font-medium",
      up ? "text-emerald-400" : "text-red-400"
    )}>
      {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
      {Math.abs(delta).toFixed(1).replace(".", ",")}
      {typeof delta === "number" && Math.abs(delta) > 2 ? "%" : ""}
    </span>
  );
}

function CanalCard({ canal }: { canal: CanalMarketing }) {
  const Icon = canalIconMap[canal.tipo] ?? Star;
  const { badge, label } = statusCanalConfig[canal.status];
  return (
    <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gray-300" />
          <span className="text-sm font-medium text-gray-200">{canal.canal}</span>
        </div>
        <span className={`badge ${badge}`}>{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {canal.metricas.map((m) => (
          <div key={m.label} className="bg-gray-900/60 rounded-lg p-2.5">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-white tabular-nums">{m.valor}</span>
              <DeltaBadge delta={m.delta} />
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunilBar({ label, value, max, color, sub }: {
  label: string; value: number; max: number; color: string; sub?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center gap-2">
          {sub && <span className="text-gray-600">{sub}</span>}
          <span className="font-semibold text-white tabular-nums">
            {value > 0 ? value.toLocaleString("pt-BR") : "—"}
          </span>
        </div>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ─── main view ────────────────────────────────────────────────────────────────

interface Props {
  cliente: MarketingCliente;
  nomeCliente: string;
}

export default function MarketingClienteView({ cliente, nomeCliente }: Props) {
  const { funil } = cliente;
  const maxFunil  = funil.topo || 1;

  const txMF   = funil.topo  > 0 ? ((funil.meio   / funil.topo)   * 100).toFixed(0) : null;
  const txFB   = funil.meio  > 0 ? ((funil.fundo  / funil.meio)   * 100).toFixed(0) : null;
  const txBC   = funil.fundo > 0 ? ((funil.clientes / funil.fundo) * 100).toFixed(0) : null;

  const semCampanhas = cliente.campanhas.length === 0;

  return (
    <div className="space-y-4">

      {/* ── posicionamento + público + diferenciais ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard title="Posicionamento" icon={Target}>
            <p className="text-sm text-gray-300 leading-relaxed">{cliente.posicionamento}</p>
          </SectionCard>
        </div>
        <div className="space-y-4">
          <SectionCard title="Público-Alvo" icon={Target}>
            <ul className="space-y-1.5">
              {cliente.publicoAlvo.map((p) => (
                <li key={p} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard title="Diferenciais" icon={Star}>
            <ul className="space-y-1.5">
              {cliente.diferenciais.map((d) => (
                <li key={d} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      {/* ── canais ── */}
      <SectionCard title="Canais Ativos" icon={Megaphone}>
        {cliente.canais.length === 0 ? (
          <p className="text-sm text-gray-600">Nenhum canal configurado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {cliente.canais.map((c) => <CanalCard key={c.canal} canal={c} />)}
          </div>
        )}
      </SectionCard>

      {/* ── funil + campanhas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* funil */}
        <SectionCard title="Funil de Marketing" icon={BarChart2}>
          {funil.topo === 0 ? (
            <p className="text-sm text-gray-600">Funil ainda não estruturado.</p>
          ) : (
            <div className="space-y-3">
              <FunilBar label={funil.rotuloTopo     ?? "Topo"}     value={funil.topo}     max={maxFunil} color="bg-indigo-500" />
              <FunilBar label={funil.rotuloMeio     ?? "Meio"}     value={funil.meio}     max={maxFunil} color="bg-cyan-500"   sub={txMF ? `→ ${txMF}%` : undefined} />
              <FunilBar label={funil.rotuloFundo    ?? "Fundo"}    value={funil.fundo}    max={maxFunil} color="bg-brand-500"  sub={txFB ? `→ ${txFB}%` : undefined} />
              <FunilBar label={funil.rotuloClientes ?? "Clientes"} value={funil.clientes} max={maxFunil} color="bg-emerald-500" sub={txBC ? `→ ${txBC}%` : undefined} />

              <div className="pt-2 border-t border-gray-800">
                <div className="flex items-center gap-4 text-[10px] text-gray-600 flex-wrap">
                  {txMF && <span className="flex items-center gap-1"><Minus size={8} />Topo→Meio: <span className="text-gray-400 font-medium">{txMF}%</span></span>}
                  {txFB && <span className="flex items-center gap-1"><Minus size={8} />Meio→Fundo: <span className="text-gray-400 font-medium">{txFB}%</span></span>}
                  {txBC && <span className="flex items-center gap-1"><Minus size={8} />Fundo→Cliente: <span className="text-gray-400 font-medium">{txBC}%</span></span>}
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* campanhas */}
        <SectionCard title="Campanhas" icon={Calendar}>
          {semCampanhas ? (
            <p className="text-sm text-gray-600">Nenhuma campanha cadastrada.</p>
          ) : (
            <div className="space-y-2">
              {cliente.campanhas.map((c) => {
                const { badge, label } = statusCampanhaConfig[c.status];
                return (
                  <div key={c.nome} className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-medium text-gray-200 leading-tight">{c.nome}</span>
                      <span className={`badge shrink-0 ${badge}`}>{label}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Megaphone size={9} /><span>{c.canal}</span>
                      </div>
                      {c.orcamento && (
                        <div className="flex items-center gap-1.5">
                          <BarChart2 size={9} /><span>{c.orcamento}</span>
                        </div>
                      )}
                      {c.resultado && (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle size={9} /><span>{c.resultado}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock size={9} />
                        <span>Início: {formatDate(c.inicio)}{c.fim ? ` · Fim: ${formatDate(c.fim)}` : ""}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── oportunidades + desafios ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Oportunidades" icon={TrendingUp}>
          <ul className="space-y-2">
            {cliente.oportunidades.map((o) => (
              <li key={o} className="flex items-start gap-2 text-xs text-gray-300">
                <TrendingUp size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                {o}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Desafios" icon={AlertCircle}>
          <ul className="space-y-2">
            {cliente.desafios.map((d) => (
              <li key={d} className="flex items-start gap-2 text-xs text-gray-300">
                <AlertCircle size={11} className="text-red-400 mt-0.5 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* ── bases de dados ── */}
      <BasesDadosCard bases={cliente.bases} />

    </div>
  );
}
