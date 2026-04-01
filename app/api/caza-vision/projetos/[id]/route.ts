import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/client'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const now  = new Date().toISOString()
  getDb().prepare(`
    UPDATE projetos
    SET titulo=?, cliente=?, diretor=?, inicio=?, prazo=?, status=?, tipo=?, valor=?, updated_at=?
    WHERE id=?
  `).run(body.titulo, body.cliente ?? null, body.diretor ?? null, body.inicio ?? null,
         body.prazo ?? null, body.status ?? null, body.tipo ?? null, body.valor ?? null,
         now, params.id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  getDb().prepare('DELETE FROM projetos WHERE id=?').run(params.id)
  return NextResponse.json({ ok: true })
}
