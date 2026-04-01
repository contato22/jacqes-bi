import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export async function GET() {
  const rows = getDb().prepare('SELECT * FROM clientes ORDER BY nome ASC').all()
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()
  const id   = crypto.randomUUID()
  getDb().prepare(`
    INSERT INTO clientes (id, nome, email, segmento, status, desde, telefone, budget_anual, tipo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, body.nome, body.email ?? null, body.segmento ?? null, body.status ?? null,
         body.desde ?? null, body.telefone ?? null, body.budget_anual ?? null, body.tipo ?? null)
  return NextResponse.json({ id }, { status: 201 })
}
