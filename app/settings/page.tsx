"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Settings, Bell, Shield, Database, Info, Zap, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API_KEY_STORAGE = "jacqes_anthropic_key";

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ icon: Icon, title, description, children }: SettingsSectionProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 shrink-0">
          <Icon size={16} />
        </div>
        <div>
          <div className="font-semibold text-gray-200">{title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

function ToggleRow({ label, description, defaultChecked = false }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm text-gray-300">{label}</div>
        {description && <div className="text-xs text-gray-600 mt-0.5">{description}</div>}
      </div>
      <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${defaultChecked ? "bg-brand-600" : "bg-gray-700"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${defaultChecked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
    </div>
  );
}

// ── Open Claw Key Config ───────────────────────────────────────────────────────

function OpenClawConfig() {
  const [key, setKey]         = useState("");
  const [saved, setSaved]     = useState(false);
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState<"idle" | "ok" | "err">("idle");
  const [errMsg, setErrMsg]   = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE) || "";
    const env    = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
    const current = env || stored;
    if (current) {
      setKey(current);
      setSaved(true);
      setStatus("ok");
    }
  }, []);

  async function handleSave() {
    const k = key.trim();
    if (!k) return;
    setLoading(true);
    setStatus("idle");
    setErrMsg("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": k,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1,
          messages: [{ role: "user", content: "ok" }],
        }),
      });
      if (res.status === 401) {
        setStatus("err");
        setErrMsg("Chave inválida ou sem permissão.");
        return;
      }
      localStorage.setItem(API_KEY_STORAGE, k);
      setSaved(true);
      setStatus("ok");
    } catch {
      setStatus("err");
      setErrMsg("Erro de rede ao validar a chave.");
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    localStorage.removeItem(API_KEY_STORAGE);
    setKey("");
    setSaved(false);
    setStatus("idle");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">Chave da API Anthropic</div>
        {status === "ok" && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
            <CheckCircle size={11} /> Open Claw ativo
          </span>
        )}
        {status === "err" && (
          <span className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
            <XCircle size={11} /> {errMsg}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={key}
          onChange={(e) => { setKey(e.target.value); setStatus("idle"); setSaved(false); }}
          placeholder="sk-ant-api03-... ou sk-..."
          className="w-full pr-10 pl-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!key.trim() || loading || saved}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors"
        >
          {loading && <Loader2 size={11} className="animate-spin" />}
          {saved ? "Salvo e ativo" : "Salvar e ativar"}
        </button>
        {saved && (
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-500/30 rounded-lg text-xs font-medium transition-colors"
          >
            Remover
          </button>
        )}
      </div>

      <p className="text-[10px] text-gray-700">
        A chave é salva apenas localmente no seu navegador (localStorage). Nunca é enviada a servidores externos exceto para a API Anthropic.
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  useAuth(); // mantém contexto disponível
  return (
    <>
      <Header title="Configurações" subtitle="Preferências e configurações do JACQES BI — AWQ Group" />

      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4">

        {/* Info banner */}
        <div className="flex items-start gap-2 p-4 rounded-xl border border-brand-500/20 bg-brand-500/5">
          <Info size={14} className="text-brand-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-400">
            As atualizações de dados devem ser feitas diretamente no{" "}
            <span className="text-brand-400">Notion</span> — o BI sincroniza via MCP.
            Configure o agente Open Claw abaixo com sua chave Anthropic.
          </p>
        </div>

        {/* ── Open Claw ── */}
        <SettingsSection
          icon={Zap}
          title="Open Claw — Agente de BI"
          description="Configure sua chave Anthropic para ativar o agente de análise inteligente"
        >
          <OpenClawConfig />
        </SettingsSection>

        <SettingsSection
          icon={Settings}
          title="Geral"
          description="Preferências do workspace e visualização"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Nome do workspace</label>
              <input
                type="text"
                defaultValue="JACQES BI"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Moeda padrão</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500">
                <option>BRL — Real Brasileiro</option>
                <option>USD — Dólar Americano</option>
                <option>EUR — Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Início do exercício fiscal</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500">
                <option>Janeiro</option>
                <option>Julho</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Fuso horário</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500">
                <option>UTC-3 — Brasília (BRT)</option>
                <option>UTC-4 — Manaus (AMT)</option>
                <option>UTC+0 — Londres</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title="Alertas"
          description="Configure quais alertas são exibidos no BI"
        >
          <ToggleRow label="Alertas críticos de conta" description="Exibir alerta quando conta está em risco alto" defaultChecked={true} />
          <ToggleRow label="Pendências vencidas" description="Mostrar banner ao acessar o BI com pendências vencidas" defaultChecked={true} />
          <ToggleRow label="Gap para variável" description="Lembrete quando score < meta de 75 pts" defaultChecked={true} />
          <ToggleRow label="Visitas não reagendadas" description="Alertar ao ter visitas pendentes de reagendamento" defaultChecked={true} />
          <ToggleRow label="Relatório pós-visita pendente" description="Lembrar de preencher relatório após cada visita" defaultChecked={false} />
        </SettingsSection>

        <SettingsSection
          icon={Shield}
          title="Acesso"
          description="Usuários com acesso ao JACQES BI"
        >
          <div className="space-y-2">
            {[
              { name: "Miguel", initials: "M", role: "Admin", email: "Founder · AWQ Group" },
              { name: "Danilo", initials: "D", role: "Usuário", email: "CS & Operações · AWQ Group" },
            ].map((member) => (
              <div key={member.name} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-[10px] font-bold text-white">
                  {member.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-300">{member.name}</div>
                  <div className="text-xs text-gray-600">{member.email}</div>
                </div>
                <span className={`badge ${member.role === "Admin" ? "badge-blue" : "badge-green"}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Database}
          title="Fontes de dados"
          description="Integrações e pipelines de dados conectados ao BI"
        >
          {[
            { name: "Notion — Contas & Carteira",    status: "Conectado",    lastSync: "via MCP" },
            { name: "Notion — Score Mensal",          status: "Conectado",    lastSync: "via MCP" },
            { name: "Notion — Visitas",               status: "Mapeado",      lastSync: "Em uso futuro" },
            { name: "Notion — Atendimento",           status: "Mapeado",      lastSync: "Em uso futuro" },
            { name: "Notion — Execução Operacional",  status: "Mapeado",      lastSync: "Em uso futuro" },
            { name: "GitHub Pages",                   status: "Deploy ativo", lastSync: "contato22/jacqes-bi" },
          ].map((source) => (
            <div key={source.name} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-300">{source.name}</div>
                <div className="text-xs text-gray-600">{source.lastSync}</div>
              </div>
              <span className={`badge ${source.status === "Conectado" ? "badge-green" : source.status === "Deploy ativo" ? "badge-blue" : "badge-yellow"}`}>
                {source.status}
              </span>
            </div>
          ))}
        </SettingsSection>

      </div>
    </>
  );
}
