// ─── Internal SQLite client — CAZA VISION ─────────────────────────────────────
// Single file database stored at data/caza-vision.db
// Server-side only (used from Server Components and Route Handlers).

import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'caza-vision.db')

// Ensure directory exists
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

// Singleton — avoid re-opening the file on every hot-reload in development
declare global {
  // eslint-disable-next-line no-var
  var __cazaDb: Database.Database | undefined
}

function open(): Database.Database {
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  applySchema(db)
  seedIfEmpty(db)
  return db
}

export function getDb(): Database.Database {
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis.__cazaDb) globalThis.__cazaDb = open()
    return globalThis.__cazaDb
  }
  return open()
}

// ── Schema ─────────────────────────────────────────────────────────────────────

function applySchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projetos (
      id         TEXT PRIMARY KEY,
      titulo     TEXT NOT NULL,
      cliente    TEXT,
      diretor    TEXT,
      inicio     TEXT,
      prazo      TEXT,
      status     TEXT,
      tipo       TEXT,
      valor      REAL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS financeiro (
      id         TEXT PRIMARY KEY,
      mes        TEXT NOT NULL,
      mes_order  INTEGER NOT NULL,
      receita    REAL NOT NULL DEFAULT 0,
      orcamento  REAL NOT NULL DEFAULT 0,
      despesas   REAL NOT NULL DEFAULT 0,
      lucro      REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id           TEXT PRIMARY KEY,
      nome         TEXT NOT NULL,
      email        TEXT,
      segmento     TEXT,
      status       TEXT,
      desde        TEXT,
      telefone     TEXT,
      budget_anual REAL,
      tipo         TEXT,
      created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );
  `)
}

// ── Seed ───────────────────────────────────────────────────────────────────────

function seedIfEmpty(db: Database.Database): void {
  const count = (db.prepare('SELECT COUNT(*) as n FROM projetos').get() as { n: number }).n
  if (count > 0) return  // already seeded
  seed(db)
}

function uid(): string {
  return crypto.randomUUID()
}

function seed(db: Database.Database): void {
  // ── Clientes ──────────────────────────────────────────────────────────────
  const clientes = [
    { id: uid(), nome: 'Natura', email: 'producao@natura.com', segmento: 'Beleza & Cuidados', status: 'Ativo', desde: '2023-03-15', telefone: '(11) 3030-5000', budget_anual: 250000, tipo: 'Marca' },
    { id: uid(), nome: 'Magazine Luiza', email: 'mkt@magalu.com.br', segmento: 'Varejo', status: 'Ativo', desde: '2023-07-01', telefone: '(11) 3504-2000', budget_anual: 180000, tipo: 'Empresa' },
    { id: uid(), nome: 'Samsung Brasil', email: 'agency@samsung.com', segmento: 'Tecnologia', status: 'Ativo', desde: '2024-01-10', telefone: '(11) 2105-9000', budget_anual: 320000, tipo: 'Empresa' },
    { id: uid(), nome: 'Havaianas', email: 'mkt@havaianas.com', segmento: 'Moda & Lifestyle', status: 'Convertido', desde: '2022-11-20', telefone: '(11) 3132-7000', budget_anual: 150000, tipo: 'Marca' },
    { id: uid(), nome: 'Ambev', email: 'producao@ambev.com.br', segmento: 'Bebidas & Alimentos', status: 'Em Proposta', desde: '2024-09-05', telefone: '(11) 2122-5000', budget_anual: 200000, tipo: 'Empresa' },
    { id: uid(), nome: 'O Boticário', email: 'conteudo@boticario.com.br', segmento: 'Beleza & Cuidados', status: 'Ativo', desde: '2023-05-12', telefone: '(41) 3340-6000', budget_anual: 120000, tipo: 'Marca' },
  ]

  const insertCliente = db.prepare(`
    INSERT INTO clientes (id, nome, email, segmento, status, desde, telefone, budget_anual, tipo)
    VALUES (@id, @nome, @email, @segmento, @status, @desde, @telefone, @budget_anual, @tipo)
  `)
  for (const c of clientes) insertCliente.run(c)

  // ── Projetos ──────────────────────────────────────────────────────────────
  const projetos = [
    { id: uid(), titulo: 'Campanha Natura Verão 25', cliente: 'Natura', diretor: 'Lucas Mendes', inicio: '2025-01-08', prazo: '2025-02-15', status: 'Entregue', tipo: 'Vídeo Publicitário', valor: 45000 },
    { id: uid(), titulo: 'Evento Magazine Luiza Day', cliente: 'Magazine Luiza', diretor: 'Carla Freitas', inicio: '2025-03-20', prazo: '2025-04-25', status: 'Em Produção', tipo: 'Evento / Live', valor: 28000 },
    { id: uid(), titulo: 'Filme Institucional Samsung', cliente: 'Samsung Brasil', diretor: 'Rafael Souza', inicio: '2025-02-03', prazo: '2025-04-10', status: 'Em Edição', tipo: 'Filme Institucional', valor: 72000 },
    { id: uid(), titulo: 'Reels Havaianas Q1', cliente: 'Havaianas', diretor: 'Ana Costa', inicio: '2024-12-05', prazo: '2025-01-20', status: 'Entregue', tipo: 'Conteúdo Digital', valor: 12000 },
    { id: uid(), titulo: 'Fotos Produto Ambev Skol', cliente: 'Ambev', diretor: null, inicio: '2025-03-12', prazo: '2025-04-30', status: 'Aguardando Aprovação', tipo: 'Fotografia', valor: 8500 },
    { id: uid(), titulo: 'Campanha Boticário Dia das Mães', cliente: 'O Boticário', diretor: 'Lucas Mendes', inicio: '2025-02-18', prazo: '2025-04-01', status: 'Entregue', tipo: 'Vídeo Publicitário', valor: 38000 },
    { id: uid(), titulo: 'Conteúdo Natura Mês de Abril', cliente: 'Natura', diretor: 'Carla Freitas', inicio: '2025-03-25', prazo: '2025-04-18', status: 'Em Produção', tipo: 'Conteúdo Digital', valor: 15000 },
    { id: uid(), titulo: 'Evento Bradesco Tech Summit', cliente: 'Bradesco', diretor: 'Rafael Souza', inicio: '2025-02-28', prazo: '2025-04-20', status: 'Em Edição', tipo: 'Evento / Live', valor: 35000 },
    { id: uid(), titulo: 'Filme Totvs Cultura & Inovação', cliente: 'Totvs', diretor: 'Ana Costa', inicio: '2024-11-10', prazo: '2025-01-31', status: 'Entregue', tipo: 'Filme Institucional', valor: 55000 },
    { id: uid(), titulo: 'Fotos Lifestyle Reserva Inverno', cliente: 'Reserva', diretor: null, inicio: '2024-12-20', prazo: '2025-02-10', status: 'Entregue', tipo: 'Fotografia', valor: 11000 },
    { id: uid(), titulo: 'Campanha Samsung Galaxy S25', cliente: 'Samsung Brasil', diretor: 'Lucas Mendes', inicio: '2025-01-15', prazo: '2025-03-28', status: 'Entregue', tipo: 'Vídeo Publicitário', valor: 68000 },
    { id: uid(), titulo: 'Reels Boticário Masculino', cliente: 'O Boticário', diretor: 'Carla Freitas', inicio: '2025-03-01', prazo: '2025-05-15', status: 'Em Produção', tipo: 'Conteúdo Digital', valor: 9000 },
    { id: uid(), titulo: 'Live Havaianas Verão', cliente: 'Havaianas', diretor: 'Rafael Souza', inicio: '2024-11-25', prazo: '2025-01-10', status: 'Entregue', tipo: 'Evento / Live', valor: 22000 },
    { id: uid(), titulo: 'Fotos Produto Natura Ekos', cliente: 'Natura', diretor: null, inicio: '2025-03-10', prazo: '2025-05-20', status: 'Aguardando Aprovação', tipo: 'Fotografia', valor: 14000 },
    { id: uid(), titulo: 'Filme Ambev Fundação 100 Anos', cliente: 'Ambev', diretor: 'Lucas Mendes', inicio: '2025-04-01', prazo: '2025-06-30', status: 'Em Produção', tipo: 'Filme Institucional', valor: 90000 },
  ]

  const insertProjeto = db.prepare(`
    INSERT INTO projetos (id, titulo, cliente, diretor, inicio, prazo, status, tipo, valor)
    VALUES (@id, @titulo, @cliente, @diretor, @inicio, @prazo, @status, @tipo, @valor)
  `)
  for (const p of projetos) insertProjeto.run(p)

  // ── Financeiro ────────────────────────────────────────────────────────────
  // mesOrder: YYYYMM integer
  const financeiro = [
    { id: uid(), mes: 'Jan/25', mes_order: 202501, receita: 78000,  orcamento: 70000,  despesas: 32000, lucro: 46000 },
    { id: uid(), mes: 'Fev/25', mes_order: 202502, receita: 55000,  orcamento: 60000,  despesas: 28000, lucro: 27000 },
    { id: uid(), mes: 'Mar/25', mes_order: 202503, receita: 95000,  orcamento: 85000,  despesas: 38000, lucro: 57000 },
    { id: uid(), mes: 'Abr/25', mes_order: 202504, receita: 112000, orcamento: 100000, despesas: 44000, lucro: 68000 },
    { id: uid(), mes: 'Mai/25', mes_order: 202505, receita: 88000,  orcamento: 90000,  despesas: 36000, lucro: 52000 },
    { id: uid(), mes: 'Jun/25', mes_order: 202506, receita: 70000,  orcamento: 75000,  despesas: 31000, lucro: 39000 },
    { id: uid(), mes: 'Jul/25', mes_order: 202507, receita: 65000,  orcamento: 70000,  despesas: 29000, lucro: 36000 },
    { id: uid(), mes: 'Ago/25', mes_order: 202508, receita: 82000,  orcamento: 80000,  despesas: 33000, lucro: 49000 },
    { id: uid(), mes: 'Set/25', mes_order: 202509, receita: 91000,  orcamento: 88000,  despesas: 37000, lucro: 54000 },
    { id: uid(), mes: 'Out/25', mes_order: 202510, receita: 105000, orcamento: 95000,  despesas: 41000, lucro: 64000 },
    { id: uid(), mes: 'Nov/25', mes_order: 202511, receita: 120000, orcamento: 110000, despesas: 46000, lucro: 74000 },
    { id: uid(), mes: 'Dez/25', mes_order: 202512, receita: 98000,  orcamento: 105000, despesas: 40000, lucro: 58000 },
    { id: uid(), mes: 'Jan/26', mes_order: 202601, receita: 85000,  orcamento: 80000,  despesas: 34000, lucro: 51000 },
    { id: uid(), mes: 'Fev/26', mes_order: 202602, receita: 62000,  orcamento: 70000,  despesas: 27000, lucro: 35000 },
    { id: uid(), mes: 'Mar/26', mes_order: 202603, receita: 108000, orcamento: 95000,  despesas: 42000, lucro: 66000 },
  ]

  const insertFin = db.prepare(`
    INSERT INTO financeiro (id, mes, mes_order, receita, orcamento, despesas, lucro)
    VALUES (@id, @mes, @mes_order, @receita, @orcamento, @despesas, @lucro)
  `)
  for (const f of financeiro) insertFin.run(f)
}
