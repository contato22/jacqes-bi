import Header from "@/components/Header";
import { Settings, Bell, Shield, Database, Info } from "lucide-react";

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
      <div
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
          defaultChecked ? "bg-brand-600" : "bg-gray-700"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            defaultChecked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <Header title="Configurações" subtitle="Preferências e configurações do JACQES BI — AWQ Group" />

      <div className="px-8 py-6 space-y-4">

        {/* Info banner */}
        <div className="flex items-start gap-2 p-4 rounded-xl border border-brand-500/20 bg-brand-500/5">
          <Info size={14} className="text-brand-400 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-400">
            As configurações abaixo são informativas. As atualizações de dados devem ser feitas diretamente no{" "}
            <span className="text-brand-400">Notion</span> — o BI sincroniza automaticamente via MCP.
          </p>
        </div>

        <SettingsSection
          icon={Settings}
          title="Geral"
          description="Preferências do workspace e visualização"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Nome do workspace
              </label>
              <input
                type="text"
                defaultValue="JACQES BI"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Moeda padrão
              </label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500">
                <option>BRL — Real Brasileiro</option>
                <option>USD — Dólar Americano</option>
                <option>EUR — Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Início do exercício fiscal
              </label>
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
            { name: "Notion — Contas & Carteira",   status: "Conectado",     lastSync: "via MCP" },
            { name: "Notion — Score Mensal",         status: "Conectado",     lastSync: "via MCP" },
            { name: "Notion — Visitas",              status: "Mapeado",       lastSync: "Em uso futuro" },
            { name: "Notion — Atendimento",          status: "Mapeado",       lastSync: "Em uso futuro" },
            { name: "Notion — Execução Operacional", status: "Mapeado",       lastSync: "Em uso futuro" },
            { name: "GitHub Pages",                  status: "Deploy ativo",  lastSync: "contato22/jacqes-bi" },
          ].map((source) => (
            <div key={source.name} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-300">{source.name}</div>
                <div className="text-xs text-gray-600">{source.lastSync}</div>
              </div>
              <span
                className={`badge ${
                  source.status === "Conectado"
                    ? "badge-green"
                    : source.status === "Deploy ativo"
                    ? "badge-blue"
                    : "badge-yellow"
                }`}
              >
                {source.status}
              </span>
            </div>
          ))}
        </SettingsSection>

      </div>
    </>
  );
}
