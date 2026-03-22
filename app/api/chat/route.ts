import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

export async function POST(req: NextRequest) {
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
    req.headers.get("x-client-key") ||
    "";

  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada no servidor." }, { status: 503 });
  }

  const body = await req.text();

  const upstream = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body,
  });

  // Pass through the streaming response
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
