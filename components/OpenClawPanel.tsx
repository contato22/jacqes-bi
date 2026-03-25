"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, ChevronDown, ChevronUp, Eye, EyeOff, Key, Send, Loader2, Trash2 } from "lucide-react";

const STORAGE_KEY = "openclaw_api_key";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function OpenClawPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSaveKey() {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setError("Insira uma chave de API.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": trimmed,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        }),
      });
      if (res.status === 401) {
        // 401 = chave inválida; 403 = chave válida sem acesso ao modelo (salva mesmo assim)
        const body = await res.json().catch(() => ({}));
        const errorType = body?.error?.type;
        if (errorType === "authentication_error" || res.status === 401) {
          setError("Chave inválida ou sem permissão.");
          return;
        }
      }
      // 200, 403 (modelo restrito) ou qualquer outro status — chave aceita
      localStorage.setItem(STORAGE_KEY, trimmed);
      setApiKey(trimmed);
    } catch {
      // Erro de rede/CORS — salva assim mesmo; erro aparecerá na primeira mensagem
      localStorage.setItem(STORAGE_KEY, trimmed);
      setApiKey(trimmed);
    } finally {
      setSaving(false);
    }
  }

  function handleClearKey() {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
    setInputKey("");
    setMessages([]);
  }

  async function handleSend() {
    if (!userInput.trim() || loading || !apiKey) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userInput.trim() },
    ];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system:
            "Você é Open Claw, um assistente de BI integrado ao dashboard JACQES. Ajude o usuário a interpretar dados, gerar insights e responder perguntas sobre o negócio. Seja conciso e direto.",
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message || `Erro ${res.status}`);
      }

      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "(sem resposta)";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setMessages([
        ...newMessages,
        { role: "assistant", content: `Erro: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="w-[320px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full shadow-xl">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer select-none"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-900">Open Claw</div>
          <div className="text-[11px] text-gray-400 truncate">
            {apiKey ? "Agente ativo" : "Configuração necessária"}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <>
          {!apiKey ? (
            /* ── Configuration screen ── */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-5">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Key size={28} className="text-indigo-500" />
              </div>

              <div className="text-center">
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  Configurar Open Claw
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Insira sua chave da API Anthropic para ativar o agente. A
                  chave é salva localmente no seu navegador.
                </p>
              </div>

              <div className="w-full space-y-3">
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
                    placeholder="sk-ant-... ou sk-..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}

                <button
                  onClick={handleSaveKey}
                  disabled={saving || !inputKey.trim()}
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {saving ? "Salvando..." : "Salvar e ativar"}
                </button>
              </div>

              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-500 hover:underline"
              >
                Obter chave no console.anthropic.com →
              </a>
            </div>
          ) : (
            /* ── Chat screen ── */
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 text-sm mt-8">
                    <Zap size={24} className="mx-auto mb-2 text-indigo-300" />
                    Olá! Sou o Open Claw, seu assistente de BI.
                    <br />
                    Como posso ajudar?
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-3 py-2">
                      <Loader2 size={14} className="text-gray-400 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="border-t border-gray-100 px-3 py-3 flex gap-2 items-end">
                <textarea
                  rows={1}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Pergunte algo..."
                  className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !userInput.trim()}
                  className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>

              {/* Remove key */}
              <div className="px-4 pb-3">
                <button
                  onClick={handleClearKey}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={11} />
                  Remover chave
                </button>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
}
