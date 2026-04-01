import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export async function GET() {
  const rows = getDb().prepare('SELECT * FROM projetos ORDER BY created_at ASC').all()
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()
  const id = crypto.randomUUID()
  getDb().prepare(`
    INSERT INTO projetos (id, titulo, cliente, diretor, inicio, prazo, status, tipo, valor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, body.titulo, body.cliente ?? null, body.diretor ?? null, body.inicio ?? null,
         body.prazo ?? null, body.status ?? null, body.tipo ?? null, body.valor ?? null)
  return NextResponse.json({ id }, { status: 201 })
}
