"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Trash2,
  ChevronDown,
  Loader2,
  Zap,
  User,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: Date;
}

const API_KEY_STORAGE = "jacqes_anthropic_key";

// ─── Sistema prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é o Open Claw, agente de inteligência de negócios integrado à plataforma JACQES BI da AWQ Group.

Você auxilia Danilo (CS & Operações) com análise operacional, insights estratégicos e recomendações práticas com base nos dados do dashboard.

═══════════════════════════════════════
CONTEXTO OPERACIONAL · MARÇO 2026
═══════════════════════════════════════

SCORE MENSAL: 69/100 · 🟡 Amarelo
• Fase: Operador em Formação
• Meta para pagamento da variável: 75 pts
• Status variável: NÃO PAGA este mês
• Para próxima faixa (Bom): faltam 6 pts

DIMENSÕES DO SCORE:
• Atendimento:  16/20 (80%) ✅ — melhor dimensão
• Operação:     15/20 (75%) ✅
• Visitas:      14/20 (70%) ⚠️ — 2 visitas não realizadas
• Risco:        13/20 (65%) ⚠️ — Tati Simões crítica
• Processo:     11/20 (55%) ❌ — ponto mais fraco, foco prioritário

FAIXAS DE SCORE:
0–59 Abaixo | 60–74 Operação Mínima ← atual | 75–84 Bom | 85–94 Sólido | 95–100 Owner

CARTEIRA (5 contas · modelo M4E):
1. André Vieira (Consultoria) — Saudável | Risco Baixo | Oportunidade Forte | 2 pendências
2. Luis Vieira (Consultoria) — Estável c/ Atenção | Risco Médio | 3 pendências
3. Carol Bertolini (Consultoria) — Saudável | Risco Baixo | 1 pendência
4. Tati Simões (Consultoria) — Sensível | Risco ALTO | 5 pendências — URGENTE
5. CEM (Institucional) — Estável c/ Atenção | Risco Médio | 2 pendências

ALERTAS ATIVOS:
🔴 Tati Simões: expectativa desalinhada, 5 pendências, visita em 22/03
🟡 2 visitas não realizadas sem reagendamento
🟡 1 relatório pós-visita pendente
ℹ️  Variável não paga (score 69 < meta 75)

═══════════════════════════════════════
DIRETRIZES DE RESPOSTA:
• Responda sempre em português, de forma direta e prática
• Use bullets, tabelas ou estrutura clara para análises
• Priorize ações por impacto no score quando sugerir melhorias
• Foco nas dimensões mais fracas: Processo (11/20) e Risco (13/20)`;

// ─── Stream API ───────────────────────────────────────────────────────────────

async function streamMessage(
  apiKey: string,
  history: Message[],
  onChunk: (text: string) => void,
  signal: AbortSignal,
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erro da API (${res.status}): ${err}`);
  }

  const reader  = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer    = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;
      try {
        const event = JSON.parse(data);
        if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
          onChunk(event.delta.text as string);
        }
      } catch { /* ignora linhas malformadas */ }
    }
  }
}

// ─── Tela de configuração de chave ───────────────────────────────────────────

function KeySetup({ onSave }: { onSave: (key: string) => void }) {
  const [val, setVal]     = useState("");
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const key = val.trim();
    if (!key.startsWith("sk-ant-")) {
      setErr("Chave inválida. Deve começar com sk-ant-");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      // Valida a chave com uma chamada mínima
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        }),
      });
      if (res.status === 401) { setErr("Chave inválida ou sem permissão."); return; }
      localStorage.setItem(API_KEY_STORAGE, key);
      onSave(key);
    } catch {
      setErr("Erro de rede ao validar a chave.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
      <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center">
        <Key size={22} className="text-brand-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-200">Configurar Open Claw</p>
        <p className="text-xs text-gray-500 mt-1 max-w-[280px]">
          Insira sua chave da API Anthropic para ativar o agente. A chave é salva localmente no seu navegador.
        </p>
      </div>

      <div className="w-full space-y-3">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={val}
            onChange={(e) => { setVal(e.target.value); setErr(""); }}
            placeholder="sk-ant-api03-..."
            className="w-full pr-10 pl-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>

        {err && (
          <p className="text-xs text-red-400">{err}</p>
        )}

        <button
          onClick={handleSave}
          disabled={!val.trim() || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {loading ? "Validando..." : "Salvar e ativar"}
        </button>
      </div>

      <a
        href="https://console.anthropic.com/settings/keys"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2"
      >
        Obter chave no console.anthropic.com →
      </a>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function OpenClaw() {
  const { user } = useAuth();

  const [open, setOpen]         = useState(false);
  const [apiKey, setApiKey]     = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError]       = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const abortRef  = useRef<AbortController | null>(null);

  // Carrega chave: env var (build-time) → localStorage (runtime)
  useEffect(() => {
    const envKey   = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
    const localKey = localStorage.getItem(API_KEY_STORAGE) || "";
    setApiKey(envKey || localKey);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && apiKey) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, apiKey]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming || !apiKey) return;

    setError("");
    setInput("");

    const userMsg: Message      = { id: crypto.randomUUID(), role: "user",      content: text, ts: new Date() };
    const assistantId           = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId,         role: "assistant", content: "",   ts: new Date() };

    const nextHistory = [...messages, userMsg];
    setMessages([...nextHistory, assistantMsg]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      await streamMessage(apiKey, nextHistory, (chunk) => {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m),
        );
      }, ctrl.signal);
    } catch (e: unknown) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message || "Erro ao conectar com o agente.");
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, messages, streaming, apiKey]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError("");
    setStreaming(false);
  };

  const resetKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey("");
    clear();
  };

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg shadow-black/40",
          "flex items-center justify-center transition-all duration-200",
          "bg-gradient-to-br from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600",
          "border border-brand-400/30",
          open && "opacity-0 pointer-events-none",
        )}
        title="Open Claw — Agente BI"
      >
        <Zap size={20} className="text-white" />
      </button>

      {/* ── Panel ── */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-[420px]",
          "bg-gray-900 border-l border-gray-800 shadow-2xl shadow-black/60",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Open Claw</div>
            <div className="text-[10px] text-gray-500">
              {apiKey ? "Agente de BI · AWQ Group" : "Configuração necessária"}
            </div>
          </div>
          {apiKey && messages.length > 0 && (
            <button onClick={clear} title="Limpar conversa" className="text-gray-600 hover:text-gray-400 transition-colors p-1">
              <Trash2 size={14} />
            </button>
          )}
          {apiKey && (
            <button onClick={resetKey} title="Trocar chave API" className="text-gray-600 hover:text-gray-400 transition-colors p-1">
              <Key size={14} />
            </button>
          )}
          <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-300 transition-colors p-1">
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Body: setup ou chat */}
        {!apiKey ? (
          <KeySetup onSave={(k) => setApiKey(k)} />
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center">
                    <Zap size={22} className="text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Open Claw pronto</p>
                    <p className="text-xs text-gray-600 mt-1 max-w-[280px]">
                      Pergunte sobre o score, contas, alertas ou peça análises e recomendações.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-[300px] mt-2">
                    {[
                      "Como aumentar o score para 75?",
                      "Qual o status da Tati Simões?",
                      "Quais são as prioridades desta semana?",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                        className="text-xs text-left px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 border border-gray-700/50 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap size={11} className="text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-brand-600/25 text-brand-100 border border-brand-500/20"
                      : "bg-gray-800 text-gray-200 border border-gray-700/50",
                  )}>
                    {msg.content || (
                      msg.role === "assistant" && streaming && (
                        <span className="inline-flex gap-1">
                          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </span>
                      )
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white",
                      user?.role === "admin"
                        ? "bg-gradient-to-br from-awq-gold to-amber-600"
                        : "bg-gradient-to-br from-brand-500 to-brand-700",
                    )}>
                      {user?.role === "admin" ? "A" : <User size={11} />}
                    </div>
                  )}
                </div>
              ))}

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Pergunte sobre o BI..."
                  rows={1}
                  disabled={streaming}
                  className={cn(
                    "flex-1 resize-none bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5",
                    "text-sm text-gray-200 placeholder:text-gray-600",
                    "focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30",
                    "transition-all max-h-32 disabled:opacity-50",
                  )}
                  style={{ height: "auto", minHeight: "42px" }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
                  }}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || streaming}
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                    input.trim() && !streaming
                      ? "bg-brand-600 hover:bg-brand-500 text-white"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed",
                  )}
                >
                  {streaming ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-700 mt-1.5">Enter para enviar · Shift+Enter para nova linha</p>
            </div>
          </>
        )}
      </div>

      {/* Backdrop mobile */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
