import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export async function GET() {
  const rows = getDb().prepare('SELECT * FROM financeiro ORDER BY mes_order ASC').all()
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()
  const id   = crypto.randomUUID()
  const lucro = body.lucro ?? (body.receita ?? 0) - (body.despesas ?? 0)
  getDb().prepare(`
    INSERT INTO financeiro (id, mes, mes_order, receita, orcamento, despesas, lucro)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, body.mes, body.mes_order, body.receita ?? 0,
         body.orcamento ?? 0, body.despesas ?? 0, lucro)
  return NextResponse.json({ id }, { status: 201 })
}
