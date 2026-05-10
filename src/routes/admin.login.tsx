import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin" });
  }, [loading, user, isAdmin, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setMsg({ type: "info", text: "Account created. An existing admin must grant you access. Contact the school IT admin." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Authentication failed." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-page py-20">
      <div className="max-w-md mx-auto rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="grid place-items-center size-12 rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground mx-auto">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="mt-4 text-center font-display text-2xl font-semibold">Admin {mode === "signin" ? "Sign in" : "Sign up"}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Bloom Public School staff portal</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-4 focus:ring-ring/20" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-4 focus:ring-ring/20" />
          </label>

          {msg && (
            <div className={`rounded-xl px-3 py-2 text-sm border ${msg.type === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-secondary text-foreground"}`}>
              {msg.text}
            </div>
          )}

          <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-2.5 text-sm font-semibold disabled:opacity-60">
            {busy && <Loader2 className="size-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>No account? <button onClick={() => setMode("signup")} className="text-foreground underline">Sign up</button></>
          ) : (
            <>Have an account? <button onClick={() => setMode("signin")} className="text-foreground underline">Sign in</button></>
          )}
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to website</Link>
        </div>
      </div>
    </section>
  );
}
