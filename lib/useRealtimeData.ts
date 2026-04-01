"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface RealtimeState<T> {
  data: T | null;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
}

export function useRealtimeData<T>(url: string, intervalMs = 30_000) {
  const [state, setState] = useState<RealtimeState<T>>({
    data: null,
    lastUpdated: null,
    loading: true,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: T = await res.json();
      setState({ data: json, lastUpdated: new Date(), loading: false, error: null });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: (err as Error).message,
      }));
    }
  }, [url]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [refresh, intervalMs]);

  return { ...state, refresh };
}
