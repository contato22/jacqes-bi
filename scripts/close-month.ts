/**
 * close-month.ts
 *
 * Salva um snapshot com todos os dados da JACQES ao fechamento do mês.
 *
 * Uso:
 *   npm run close-month              # fecha o mês atual
 *   npm run close-month -- 2026-02   # fecha um mês específico (YYYY-MM)
 */

import {
  kpis,
  revenueData,
  customerSegments,
  topProducts,
  customers,
  regionData,
  channelData,
  alerts,
} from "../lib/data";
import { saveSnapshot, type MonthlySnapshot } from "../lib/snapshot-store";

function parsePeriod(arg?: string): { year: number; month: number; period: string } {
  if (arg) {
    const match = arg.match(/^(\d{4})-(\d{2})$/);
    if (!match) {
      console.error(`Formato inválido: "${arg}". Use YYYY-MM (ex: 2026-03)`);
      process.exit(1);
    }
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    return { year, month, period: arg };
  }

  // Usa o mês anterior ao dia de hoje (fechamento)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed
  const period = `${year}-${String(month).padStart(2, "0")}`;
  return { year, month, period };
}

function main() {
  const arg = process.argv[2];
  const { year, month, period } = parsePeriod(arg);

  const snapshot: MonthlySnapshot = {
    period,
    year,
    month,
    closedAt: new Date().toISOString(),
    kpis,
    revenueData,
    customerSegments,
    topProducts,
    customers,
    regionData,
    channelData,
    alerts,
  };

  saveSnapshot(snapshot);

  console.log(`✔ Snapshot salvo: data/snapshots/${period}.json`);
  console.log(`  Período  : ${period}`);
  console.log(`  Fechado em: ${snapshot.closedAt}`);
  console.log(`  KPIs     : ${snapshot.kpis.length}`);
  console.log(`  Clientes : ${snapshot.customers.length}`);
  console.log(`  Produtos : ${snapshot.topProducts.length}`);
  console.log(`  Receita  : ${snapshot.revenueData.length} meses`);
}

main();
