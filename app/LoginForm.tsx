"use client";
import { useState } from "react";

export default function LoginForm() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user, password }),
    });

    if (response.ok) {
      window.location.reload();
      return;
    }

    setError("Usuário ou senha incorretos.");
    setLoading(false);
  }

  return <main className="loginpage"><section className="loginbox"><div className="loginbrand"><span>A</span><div><b>ARENA ATUAL</b><small>CAIXA & AGENDA</small></div></div><div className="loginintro"><small>ACESSO ADMINISTRATIVO</small><h1>Bem-vindo de volta</h1><p>Entre para acessar o caixa, o estoque e os horários.</p></div><form onSubmit={login}><label>Usuário<input autoCapitalize="characters" autoComplete="username" required value={user} onChange={e=>setUser(e.target.value)} placeholder="Digite seu usuário"/></label><label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Digite sua senha"/></label>{error&&<div className="loginerror">! {error}</div>}<button disabled={loading}>{loading ? "Entrando..." : "Entrar no sistema →"}</button></form><p className="secure">◈ Acesso protegido ao painel da Arena Atual</p></section><aside className="loginart"><div><span>CAIXA DIGITAL</span><h2>Menos papel.<br/>Mais controle.</h2><p>Vendas, estoque e agenda em um só lugar.</p></div></aside></main>;
}
