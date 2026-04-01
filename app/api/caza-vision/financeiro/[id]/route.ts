import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const now  = new Date().toISOString()
  const lucro = body.lucro ?? (body.receita ?? 0) - (body.despesas ?? 0)
  getDb().prepare(`
    UPDATE financeiro
    SET mes=?, mes_order=?, receita=?, orcamento=?, despesas=?, lucro=?, updated_at=?
    WHERE id=?
  `).run(body.mes, body.mes_order, body.receita ?? 0, body.orcamento ?? 0,
         body.despesas ?? 0, lucro, now, params.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  getDb().prepare('DELETE FROM financeiro WHERE id=?').run(params.id)
  return NextResponse.json({ ok: true })
}
