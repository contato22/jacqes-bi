import Header from "@/components/Header";
import { Settings, Bell, Shield, Database } from "lucide-react";

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
      <Header title="Settings" subtitle="Preferências da plataforma AWQ Group" />

      <div className="px-8 py-6 space-y-4">
        <SettingsSection
          icon={Settings}
          title="Geral"
          description="Preferências de workspace e exibição"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Nome do Workspace
              </label>
              <input
                type="text"
                defaultValue="AWQ Group"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Moeda Padrão
              </label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500">
                <option>USD — US Dollar</option>
                <option>EUR — Euro</option>
                <option>BRL — Real Brasileiro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Fuso Horário
              </label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-brand-500">
                <option>UTC-3 — Brasília</option>
                <option>UTC+0 — Londres</option>
                <option>UTC-5 — Nova York</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title="Notificações"
          description="Configure alertas e entregas de notificação"
        >
          <ToggleRow label="Alertas de receita consolidada" defaultChecked={true} />
          <ToggleRow label="Atualizações de Business Units" defaultChecked={true} />
          <ToggleRow label="Digest semanal" defaultChecked={true} />
          <ToggleRow label="Alertas via Slack" description="Postar no canal #awq-grupo" defaultChecked={false} />
        </SettingsSection>

        <SettingsSection
          icon={Shield}
          title="Segurança & Acesso"
          description="Gerencie permissões da equipe AWQ"
        >
          <div className="space-y-2">
            {[
              { name: "Alex Whitmore", email: "alex@awqgroup.com", role: "Owner" },
              { name: "Sam Chen", email: "s.chen@awqgroup.com", role: "Admin" },
            ].map((member) => (
              <div key={member.email} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-awq-gold to-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-300">{member.name}</div>
                  <div className="text-xs text-gray-600">{member.email}</div>
                </div>
                <span className="badge badge-blue">{member.role}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary text-xs mt-2">+ Convidar Membro</button>
        </SettingsSection>

        <SettingsSection
          icon={Database}
          title="Fontes de Dados"
          description="Integrações e pipelines de dados conectados"
        >
          {[
            { name: "JACQES BI", status: "Conectado", lastSync: "2 min atrás" },
            { name: "Caza Vision", status: "Pendente", lastSync: "—" },
            { name: "AWQ Venture", status: "Pendente", lastSync: "—" },
          ].map((source) => (
            <div key={source.name} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-300">{source.name}</div>
                <div className="text-xs text-gray-600">Última sync: {source.lastSync}</div>
              </div>
              <span className={`badge ${source.status === "Conectado" ? "badge-green" : "badge-yellow"}`}>
                {source.status}
              </span>
            </div>
          ))}
        </SettingsSection>

        <div className="flex justify-end">
          <button className="btn-primary">Salvar Alterações</button>
        </div>
      </div>
    </>
  );
}
