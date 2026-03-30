/**
 * POST /api/close-month
 *
 * Fecha o mês e persiste um snapshot com todos os dados da JACQES.
 *
 * Body (opcional):
 *   { "period": "2026-03" }   — fecha um período específico
 *   {}                        — fecha o mês atual
 *
 * Resposta 200:
 *   { "ok": true, "period": "2026-03", "closedAt": "..." }
 *
 * Resposta 400:
 *   { "ok": false, "error": "..." }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  kpis,
  revenueData,
  customerSegments,
  topProducts,
  customers,
  regionData,
  channelData,
  alerts,
} from "@/lib/data";
import { saveSnapshot, type MonthlySnapshot } from "@/lib/snapshot-store";

export async function POST(req: NextRequest) {
  let period: string;
  let year: number;
  let month: number;

  try {
    const body = await req.json().catch(() => ({}));

    if (body.period) {
      const match = (body.period as string).match(/^(\d{4})-(\d{2})$/);
      if (!match) {
        return NextResponse.json(
          { ok: false, error: `Formato inválido: use YYYY-MM (ex: 2026-03)` },
          { status: 400 }
        );
      }
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      period = body.period as string;
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth() + 1;
      period = `${year}-${String(month).padStart(2, "0")}`;
    }

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

    return NextResponse.json({ ok: true, period, closedAt: snapshot.closedAt });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * GET /api/close-month
 * Lista todos os snapshots salvos.
 */
export async function GET() {
  const { listSnapshots } = await import("@/lib/snapshot-store");
  return NextResponse.json({ ok: true, snapshots: listSnapshots() });
}
