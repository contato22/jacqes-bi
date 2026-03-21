// ─── Paleta de cores centralizada ────────────────────────────────────────────
// Fonte única de verdade para cores de dimensão, status, saúde e threshold.
// Importar daqui em vez de redefinir localmente em cada componente.

// Cores das 5 dimensões do score (hex para Recharts)
export const dimensionColors: Record<string, string> = {
  Atendimento: "#6366f1",
  "Operação":  "#22d3ee",
  Visitas:     "#22c55e",
  Risco:       "#f59e0b",
  Processo:    "#ec4899",
};

// Faixas de score → label + cor Tailwind
export const scoreThresholds = [
  { min: 95, label: "Owner em Formação",  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { min: 85, label: "Operador Sólido",    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20"    },
  { min: 75, label: "Bom Nível",          color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20"    },
  { min: 60, label: "Operação Mínima",    color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20"},
  { min: 0,  label: "Abaixo do Esperado", color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20"      },
] as const;

export function getScoreThreshold(score: number) {
  return scoreThresholds.find((t) => score >= t.min) ?? scoreThresholds[scoreThresholds.length - 1];
}

// Saúde da conta → classes badge
export const saudeConfig: Record<string, { badge: string; dot: string }> = {
  "Saudável":              { badge: "badge-green",  dot: "bg-emerald-400" },
  "Estável com Atenção":   { badge: "badge-yellow", dot: "bg-yellow-400"  },
  "Sensível":              { badge: "badge-red",    dot: "bg-orange-400"  },
  "Em Risco":              { badge: "badge-red",    dot: "bg-red-500"     },
};

// Risco → badge
export const riscoConfig: Record<string, string> = {
  Baixo: "badge-green",
  Médio: "badge-yellow",
  Alto:  "badge-red",
};

// Oportunidade → badge
export const oportunidadeConfig: Record<string, string> = {
  "Sem Oportunidade": "badge-blue",
  Leve:               "badge-blue",
  Média:              "badge-yellow",
  Forte:              "badge-green",
};

// Tendência → ícone + cor
export const tendenciaConfig = {
  subindo:  { color: "text-emerald-400", label: "Subindo"  },
  estavel:  { color: "text-gray-400",    label: "Estável"  },
  descendo: { color: "text-red-400",     label: "Descendo" },
} as const;
