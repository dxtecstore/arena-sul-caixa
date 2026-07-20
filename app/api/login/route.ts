import { NextResponse } from "next/server";

const SESSION_VALUE = "arena-atual-2026-07-20-revoked-old-access";

export async function POST(request: Request) {
  const { user, password } = await request.json();

  if (user !== "ARENAATUAL2026" || password !== "ArenaAtual@2026!") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("arena_session", SESSION_VALUE, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
