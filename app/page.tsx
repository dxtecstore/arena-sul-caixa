import { cookies } from "next/headers";
import Dashboard from "./Dashboard";
import LoginForm from "./LoginForm";
const SESSION_VALUE = "arena-sul-7e4c8d21b9534f06a812";
export const dynamic = "force-dynamic";
export default async function Home(){const session=(await cookies()).get("arena_session")?.value;return session===SESSION_VALUE?<Dashboard/>:<LoginForm/>}
