"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { contasData } from "@/lib/data";

// Derived from contasData so it never goes stale
const HEALTH_CONFIG: Record<string, { color: string; displayName: string }> = {
  "Saudável":            { color: "#22c55e", displayName: "Saudável" },
  "Estável com Atenção": { color: "#eab308", displayName: "Estável c/ Atenção" },
  "Sensível":            { color: "#f97316", displayName: "Sensível" },
  "Em Risco":            { color: "#ef4444", displayName: "Em Risco" },
};

function buildHealthData() {
  const counts: Record<string, number> = {};
  for (const conta of contasData) {
    counts[conta.saude] = (counts[conta.saude] ?? 0) + 1;
  }
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([saude, value]) => ({
      name: HEALTH_CONFIG[saude]?.displayName ?? saude,
      value,
      color: HEALTH_CONFIG[saude]?.color ?? "#6b7280",
    }));
}

const accountHealthData = buildHealthData();

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { color: string };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl shadow-black/40">
      <div className="flex items-center gap-2 text-xs">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-gray-400">{item.name}</span>
        <span className="font-semibold text-white ml-1">
          {item.value} conta{item.value !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default function AccountHealthChart() {
  const total = accountHealthData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Saúde da Carteira</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Distribuição por status de saúde
        </p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={accountHealthData}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={3}
            dataKey="value"
          >
            {accountHealthData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 space-y-2">
        {accountHealthData.map((seg) => (
          <div key={seg.name} className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-xs text-gray-400 flex-1">{seg.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(seg.value / total) * 100}%`,
                    backgroundColor: seg.color,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-300 w-8 text-right">
                {seg.value}/{total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
