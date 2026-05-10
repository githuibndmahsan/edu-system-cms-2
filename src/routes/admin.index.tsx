import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Download, CheckCircle2, XCircle, Clock, FileText, LogOut, Loader2, RefreshCcw, ShieldAlert,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminQueue,
});

type Status = "pending" | "approved" | "rejected";
type App = {
  id: string;
  student_name: string;
  father_name: string;
  class_applying: string;
  age: number;
  contact: string;
  address: string;
  previous_school: string | null;
  document_path: string | null;
  status: Status;
  notes: string | null;
  created_at: string;
};

function AdminQueue() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/admin/login" });
  }, [loading, user, navigate]);

  const [rows, setRows] = useState<App[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [tab, setTab] = useState<"all" | Status>("pending");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoadingRows(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRows(data as App[]);
    setLoadingRows(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const counts = useMemo(() => ({
    pending: rows.filter(r => r.status === "pending").length,
    approved: rows.filter(r => r.status === "approved").length,
    rejected: rows.filter(r => r.status === "rejected").length,
  }), [rows]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows
      .filter(r => tab === "all" || r.status === tab)
      .filter(r => !ql ||
        r.student_name.toLowerCase().includes(ql) ||
        r.father_name.toLowerCase().includes(ql) ||
        r.contact.toLowerCase().includes(ql) ||
        r.class_applying.toLowerCase().includes(ql)
      );
  }, [rows, tab, q]);

  const setStatus = async (id: string, status: Status) => {
    setBusyId(id);
    const prev = rows;
    setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r));
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) { setRows(prev); alert(error.message); }
    setBusyId(null);
  };

  const downloadDoc = async (path: string) => {
    const { data, error } = await supabase.storage.from("admission-docs").createSignedUrl(path, 60);
    if (error) { alert(error.message); return; }
    window.open(data.signedUrl, "_blank");
  };

  const exportCSV = () => {
    const headers = ["Student","Father","Class","Age","Contact","Address","Previous School","Status","Submitted"];
    const escape = (v: unknown) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [headers.join(",")];
    filtered.forEach(r => lines.push([
      r.student_name, r.father_name, r.class_applying, r.age, r.contact, r.address,
      r.previous_school || "", r.status, new Date(r.created_at).toISOString(),
    ].map(escape).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admissions-${tab}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (loading || (!user && !loading)) {
    return <div className="container-page py-20 text-center text-muted-foreground"><Loader2 className="size-5 animate-spin inline mr-2" />Loading…</div>;
  }

  if (user && !isAdmin) {
    return (
      <section className="container-page py-20">
        <div className="max-w-lg mx-auto rounded-3xl border border-border bg-card p-8 text-center">
          <div className="grid place-items-center size-12 rounded-2xl bg-[--color-warning]/15 text-[--color-warning] mx-auto">
            <ShieldAlert className="size-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Awaiting access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You’re signed in as <strong>{user.email}</strong> but don’t have admin access yet.
            An existing admin must grant your account the <code>admin</code> role.
          </p>
          <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Admin · Admissions</div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold">Application queue</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-sm hover:bg-secondary">
            <RefreshCcw className="size-4" /> Refresh
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-3.5 py-2 text-sm">
            <Download className="size-4" /> Export CSV
          </button>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <StatCard label="Pending" value={counts.pending} icon={Clock} tone="bg-[--color-warning]/15 text-[--color-warning]" />
        <StatCard label="Approved" value={counts.approved} icon={CheckCircle2} tone="bg-success/15 text-[--color-success]" />
        <StatCard label="Rejected" value={counts.rejected} icon={XCircle} tone="bg-destructive/15 text-destructive" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1 rounded-full border border-border bg-surface-elevated p-1">
          {(["pending","approved","rejected","all"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("rounded-full px-3.5 py-1.5 text-sm capitalize transition",
                tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, class…"
            className="w-full sm:w-72 rounded-full border border-border bg-surface-elevated pl-9 pr-3 py-2 text-sm outline-none focus:border-ring" />
        </div>
      </div>

      <div className="mt-5">
        {loadingRows ? (
          <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground"><Loader2 className="size-5 animate-spin inline mr-2" />Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No applications {tab !== "all" && `with status “${tab}”`} yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <Th>Student</Th><Th>Class</Th><Th>Age</Th><Th>Contact</Th><Th>Submitted</Th><Th>Status</Th><Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                      <Td>
                        <div className="font-medium">{r.student_name}</div>
                        <div className="text-xs text-muted-foreground">s/o {r.father_name}</div>
                      </Td>
                      <Td>{r.class_applying}</Td>
                      <Td>{r.age}</Td>
                      <Td>{r.contact}</Td>
                      <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
                      <Td><StatusBadge s={r.status} /></Td>
                      <Td className="text-right">
                        <RowActions row={r} busy={busyId === r.id} onApprove={() => setStatus(r.id, "approved")} onReject={() => setStatus(r.id, "rejected")} onDoc={downloadDoc} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden grid gap-3">
              {filtered.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{r.student_name}</div>
                      <div className="text-xs text-muted-foreground">s/o {r.father_name} · {r.class_applying} · age {r.age}</div>
                    </div>
                    <StatusBadge s={r.status} />
                  </div>
                  <div className="mt-3 text-sm">{r.contact}</div>
                  <div className="text-xs text-muted-foreground mt-1">{r.address}</div>
                  <div className="text-xs text-muted-foreground mt-1">Submitted {new Date(r.created_at).toLocaleDateString()}</div>
                  <div className="mt-3"><RowActions row={r} busy={busyId === r.id} onApprove={() => setStatus(r.id, "approved")} onReject={() => setStatus(r.id, "rejected")} onDoc={downloadDoc} /></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        <Link to="/" className="hover:text-foreground">← Public site</Link>
      </p>
    </section>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("text-left font-medium px-4 py-3", className)}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: any; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
      <div className={cn("grid place-items-center size-10 rounded-xl", tone)}><Icon className="size-5" /></div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-display text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ s }: { s: Status }) {
  const map: Record<Status, string> = {
    pending: "bg-[--color-warning]/15 text-[--color-warning]",
    approved: "bg-success/15 text-[--color-success]",
    rejected: "bg-destructive/15 text-destructive",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", map[s])}>{s}</span>;
}

function RowActions({ row, busy, onApprove, onReject, onDoc }: {
  row: App; busy: boolean; onApprove: () => void; onReject: () => void; onDoc: (p: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {row.document_path && (
        <button onClick={() => onDoc(row.document_path!)} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs hover:bg-secondary">
          <FileText className="size-3.5" /> Doc
        </button>
      )}
      {row.status !== "approved" && (
        <button disabled={busy} onClick={onApprove} className="inline-flex items-center gap-1 rounded-full bg-success/15 text-[--color-success] px-2.5 py-1 text-xs font-medium hover:opacity-90 disabled:opacity-60">
          <CheckCircle2 className="size-3.5" /> Approve
        </button>
      )}
      {row.status !== "rejected" && (
        <button disabled={busy} onClick={onReject} className="inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive px-2.5 py-1 text-xs font-medium hover:opacity-90 disabled:opacity-60">
          <XCircle className="size-3.5" /> Reject
        </button>
      )}
    </div>
  );
}
