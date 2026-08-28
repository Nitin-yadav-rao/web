"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminButton, Field, Input, StatusMessage } from "@/components/admin/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Login failed.");
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  }

  return (
    <div className="mx-auto max-w-[420px] py-24">
      <div className="mb-8">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg3">Nitin.log</div>
        <h1 className="font-display text-[32px] font-normal leading-none text-fg">Admin login</h1>
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 border border-line bg-bg2 p-7">
        <Field label="Password">
          <Input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <AdminButton type="submit" variant="primary" disabled={status === "saving"}>
          {status === "saving" ? "Checking…" : "Log in"}
        </AdminButton>
        <StatusMessage status={status === "error" ? "error" : "idle"} message={error} />
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
