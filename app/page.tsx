/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import LoginForm from "./LoginForm";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);
  useEffect(() => { setLogged(localStorage.getItem("arena_session") === "arena-atual-2026-07-20-blocked-old-access"); setReady(true); }, []);
  if (!ready) return null;
  return logged ? <Dashboard /> : <LoginForm onLogin={() => setLogged(true)} />;
}
