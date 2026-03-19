import { NextRequest, NextResponse } from "next/server";

const VALID_USERNAME = process.env.AUTH_USERNAME ?? "danilo";
const VALID_PASSWORD = process.env.AUTH_PASSWORD ?? "awqgroup2026";
const SESSION_TOKEN = process.env.SESSION_TOKEN ?? "jacqes-bi-danilo-awq";
const SESSION_COOKIE = "jacqes_session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
