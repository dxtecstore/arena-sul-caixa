import { NextResponse } from "next/server";

const SESSION_VALUE = "arena-atual-session-rev3-2026-07-20";

export async function POST(request: Request) {
  const { user, password } = await request.json();

  if (user.trim().toLowerCase() !== "admin" || password !== "123456atualatual") {
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
