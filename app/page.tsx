import { cookies } from "next/headers";
import Dashboard from "./Dashboard";
import LoginForm from "./LoginForm";

const SESSION_VALUE = "arena-atual-session-rev3-2026-07-20";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = (await cookies()).get("arena_session")?.value;
  return session === SESSION_VALUE ? <Dashboard /> : <LoginForm />;
}
