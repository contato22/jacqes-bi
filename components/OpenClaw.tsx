"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Send,
  Trash2,
  ChevronDown,
  Loader2,
  Zap,
  User,
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

// ─── Sistema prompt com contexto completo do BI ───────────────────────────────

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
• Risco:        13/20 (65%) ⚠️ — Conta 04 crítica
• Processo:     11/20 (55%) ❌ — ponto mais fraco, foco prioritário

FAIXAS DE SCORE:
0–59 Abaixo | 60–74 Operação Mínima ← atual | 75–84 Bom | 85–94 Sólido | 95–100 Owner

CARTEIRA (4 contas · modelo M4E):
1. JACQES (D2C/E-commerce)
   • Saúde: Saudável | Risco: Baixo | Oportunidade: Forte | Pendências: 2
   • Conta âncora do portfólio. Tranche 1 de vesting conquistada. Crescimento consistente.
   • Última visita: 10/03 | Próxima: 25/03 | Dono: Danilo

2. AWQ Agência (Agência de Marketing)
   • Saúde: Estável c/ Atenção | Risco: Médio | Oportunidade: Leve | Pendências: 3
   • Renda mensal R$ 4.5k. Atenção para alinhamento de expectativas.
   • Última visita: 01/03 | Próxima: 28/03 | Dono: Danilo

3. AWQ Produtora (Produção de Conteúdo)
   • Saúde: Saudável | Risco: Baixo | Oportunidade: Média | Pendências: 1
   • Operação interna. Renda mensal estável R$ 10k.
   • Última visita: 05/03 | Próxima: 02/04 | Dono: Miguel

4. Conta 04 — Prospecção (PME/Varejo)
   • Saúde: Sensível | Risco: ALTO | Oportunidade: Forte | Pendências: 5
   • Expectativa desalinhada identificada. Em análise para entrada no portfólio M4E.
   • Última visita: nenhuma | Próxima: 22/03 | Dono: Danilo

ALERTAS ATIVOS:
🔴 Conta 04: expectativa desalinhada, 5 pendências sem resolução, visita em 22/03
🟡 2 visitas não realizadas sem reagendamento no mês
🟡 1 relatório pós-visita pendente
ℹ️  Variável não paga (score 69 < meta 75)

FOCO PRÓXIMO MÊS:
• Zerar pendências abertas na Conta 04
• Criar checklist de visita padrão (melhora Processo)
• Aumentar autonomia operacional

═══════════════════════════════════════
DIRETRIZES DE RESPOSTA:
• Responda sempre em português, de forma direta e prática
• Para análises, use bullets, tabelas ou estrutura clara
• Seja proativo em identificar riscos, oportunidades e próximos passos
• Quando sugerir ações, ordene por impacto no score
• Se perguntado sobre o que fazer, priorize as dimensões mais fracas (Processo, Risco)`;

// ─── Chamada à API da Anthropic (streaming) ───────────────────────────────────

async function streamMessage(
  history: Message[],
  onChunk: (text: string) => void,
  signal: AbortSignal,
) {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_ANTHROPIC_API_KEY não configurada.");

  const apiMessages = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

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
      messages: apiMessages,
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
        if (
          event.type === "content_block_delta" &&
          event.delta?.type === "text_delta"
        ) {
          onChunk(event.delta.text as string);
        }
      } catch {
        // ignora linhas malformadas
      }
    }
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function OpenClaw() {
  const { user } = useAuth();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError]       = useState("");

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const abortRef   = useRef<AbortController | null>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setError("");
    setInput("");

    const userMsg: Message = {
      id:      crypto.randomUUID(),
      role:    "user",
      content: text,
      ts:      new Date(),
    };

    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id:      assistantId,
      role:    "assistant",
      content: "",
      ts:      new Date(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages([...nextHistory, assistantMsg]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      await streamMessage(nextHistory, (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
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
  }, [input, messages, streaming]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError("");
    setStreaming(false);
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

      {/* ── Panel overlay ── */}
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
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow shadow-brand-900/40">
            <Zap size={14} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Open Claw</div>
            <div className="text-[10px] text-gray-500">Agente de BI · AWQ Group</div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clear}
              title="Limpar conversa"
              className="text-gray-600 hover:text-gray-400 transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="text-gray-600 hover:text-gray-300 transition-colors p-1"
          >
            <ChevronDown size={16} />
          </button>
        </div>

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
              {/* Sugestões */}
              <div className="flex flex-col gap-2 w-full max-w-[300px] mt-2">
                {[
                  "Como aumentar o score para 75?",
                  "Qual o status da Conta 04?",
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
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap size={11} className="text-white" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-brand-600/25 text-brand-100 border border-brand-500/20"
                    : "bg-gray-800 text-gray-200 border border-gray-700/50",
                )}
              >
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
          {!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY && (
            <p className="text-[10px] text-amber-500/80 mb-2">
              ⚠️ Configure <code className="text-amber-400">NEXT_PUBLIC_ANTHROPIC_API_KEY</code> no <code>.env.local</code> para ativar o agente.
            </p>
          )}
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
                "transition-all scrollbar-thin max-h-32",
                "disabled:opacity-50",
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
              {streaming
                ? <Loader2 size={15} className="animate-spin" />
                : <Send size={15} />
              }
            </button>
          </div>
          <p className="text-[10px] text-gray-700 mt-1.5">Enter para enviar · Shift+Enter para nova linha</p>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
