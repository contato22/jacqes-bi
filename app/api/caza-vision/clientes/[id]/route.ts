import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const now  = new Date().toISOString()
  getDb().prepare(`
    UPDATE clientes
    SET nome=?, email=?, segmento=?, status=?, desde=?, telefone=?, budget_anual=?, tipo=?, updated_at=?
    WHERE id=?
  `).run(body.nome, body.email ?? null, body.segmento ?? null, body.status ?? null,
         body.desde ?? null, body.telefone ?? null, body.budget_anual ?? null, body.tipo ?? null,
         now, params.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  getDb().prepare('DELETE FROM clientes WHERE id=?').run(params.id)
  return NextResponse.json({ ok: true })
}
