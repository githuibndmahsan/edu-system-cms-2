import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Loader2, Search, GraduationCap, Briefcase, Award, Sparkles, Languages, Trophy, ArrowLeft, Save, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { emptyTeacher, publicPhotoUrl, type Certification, type Experience, type Qualification, type Teacher } from "@/lib/teacher-types";
import { DropZone } from "@/components/site/DropZone";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/teachers")({ component: AdminTeachersPage });

function AdminTeachersPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/admin/login" }); }, [loading, user, navigate]);

  const [rows, setRows] = useState<Teacher[]>([]);
  const [busy, setBusy] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Teacher | "new" | null>(null);

  const load = async () => {
    setBusy(true);
    const { data } = await supabase.from("teachers").select("*").order("sort_order").order("created_at", { ascending: false });
    setRows((data as unknown as Teacher[]) || []);
    setBusy(false);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => !ql || r.full_name.toLowerCase().includes(ql) || r.designation.toLowerCase().includes(ql));
  }, [rows, q]);

  const togglePublish = async (t: Teacher) => {
    const next = !t.is_published;
    setRows((rs) => rs.map((r) => r.id === t.id ? { ...r, is_published: next } : r));
    await supabase.from("teachers").update({ is_published: next }).eq("id", t.id);
  };

  const remove = async (t: Teacher) => {
    if (!confirm(`Remove ${t.full_name}?`)) return;
    await supabase.from("teachers").delete().eq("id", t.id);
    if (t.photo_path) await supabase.storage.from("teacher-photos").remove([t.photo_path]);
    if (t.resume_path) await supabase.storage.from("teacher-resumes").remove([t.resume_path]);
    setRows((rs) => rs.filter((r) => r.id !== t.id));
  };

  if (loading || !user) return <div className="container-page py-20 text-center"><Loader2 className="size-5 animate-spin inline" /></div>;
  if (!isAdmin) return <div className="container-page py-20 text-center text-muted-foreground">Admin access required.</div>;

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> Admin</Link>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold">Teacher profiles</h1>
          <p className="text-muted-foreground text-sm mt-1">Add, edit and publish teacher profiles for the public website.</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 shadow-[var(--shadow-elevated)]"
        >
          <Plus className="size-4" /> Add Teacher
        </button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search teachers…" className="w-full rounded-full border border-border bg-surface-elevated pl-9 pr-3 py-2 text-sm outline-none focus:border-ring" />
      </div>

      <div className="mt-6">
        {busy ? (
          <div className="rounded-3xl border border-border p-10 text-center text-muted-foreground"><Loader2 className="size-5 animate-spin inline mr-2" />Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No teacher profiles yet. Click <strong>Add Teacher</strong> to create the first one.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => {
              const photo = publicPhotoUrl(t.photo_path);
              return (
                <div key={t.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col">
                  <div className="flex items-start gap-3">
                    {photo ? (
                      <img src={photo} alt={t.full_name} className="size-14 rounded-xl object-cover" />
                    ) : (
                      <div className="size-14 rounded-xl bg-secondary grid place-items-center text-sm font-semibold">{t.full_name.split(" ").map((p) => p[0]).slice(0,2).join("").toUpperCase()}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{t.full_name}</div>
                      <div className="text-xs text-primary truncate">{t.designation}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.department || "—"}</div>
                    </div>
                    <span className={cn("text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 font-medium",
                      t.is_published ? "bg-success/15 text-[--color-success]" : "bg-secondary text-muted-foreground")}>
                      {t.is_published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <button onClick={() => setEditing(t)} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 hover:bg-secondary"><Pencil className="size-3.5" /> Edit</button>
                    <button onClick={() => togglePublish(t)} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 hover:bg-secondary">
                      {t.is_published ? <><EyeOff className="size-3.5" /> Unpublish</> : <><Eye className="size-3.5" /> Publish</>}
                    </button>
                    <button onClick={() => remove(t)} className="ml-auto inline-flex items-center gap-1 rounded-full bg-destructive/15 text-destructive px-2.5 py-1 hover:opacity-90"><Trash2 className="size-3.5" /> Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <TeacherEditor
            initial={editing === "new" ? null : editing}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); load(); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------- Editor (slide-over) ------------------------- */

function TeacherEditor({ initial, onClose, onSaved }: { initial: Teacher | null; onClose: () => void; onSaved: () => void }) {
  const [t, setT] = useState(() => initial ? { ...initial } : { ...emptyTeacher(), id: "" } as any);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);

  const set = <K extends keyof Teacher>(k: K, v: Teacher[K]) => setT((s: Teacher) => ({ ...s, [k]: v }));

  const handlePhoto = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("teacher-photos").upload(path, file, { upsert: false });
    if (error) throw new Error(error.message);
    if (t.photo_path) await supabase.storage.from("teacher-photos").remove([t.photo_path]);
    set("photo_path", path);
  };

  const clearPhoto = async () => {
    if (t.photo_path) await supabase.storage.from("teacher-photos").remove([t.photo_path]);
    set("photo_path", null);
  };

  const handleResume = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("teacher-resumes").upload(path, file, { upsert: false });
    if (error) throw new Error(error.message);
    if (t.resume_path) await supabase.storage.from("teacher-resumes").remove([t.resume_path]);
    set("resume_path", path);
  };

  const clearResume = async () => {
    if (t.resume_path) await supabase.storage.from("teacher-resumes").remove([t.resume_path]);
    set("resume_path", null);
  };

  const save = async () => {
    if (!t.full_name.trim() || !t.designation.trim()) { alert("Name and designation are required"); return; }
    setSaving(true);
    const payload = {
      full_name: t.full_name, designation: t.designation, department: t.department || null,
      teaching_level: t.teaching_level || null, subjects: t.subjects, qualifications: t.qualifications,
      experiences: t.experiences, certifications: t.certifications, skills: t.skills,
      languages: t.languages, achievements: t.achievements, bio: t.bio || null,
      email: t.email || null, phone: t.phone || null, linkedin_url: t.linkedin_url || null,
      facebook_url: t.facebook_url || null, photo_path: t.photo_path, resume_path: t.resume_path,
      is_published: t.is_published, sort_order: t.sort_order || 0,
    };
    const { error } = initial
      ? await supabase.from("teachers").update(payload).eq("id", initial.id)
      : await supabase.from("teachers").insert(payload);
    setSaving(false);
    if (error) { alert(error.message); return; }
    onSaved();
  };

  const photo = publicPhotoUrl(t.photo_path);
  const steps = ["Basics", "CV", "Skills", "Contact"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="absolute right-0 top-0 h-full w-full sm:max-w-2xl bg-background border-l border-border overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">{initial ? "Edit teacher" : "Add teacher"}</h2>
            <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length} · {steps[step]}</p>
          </div>
          <button onClick={onClose} className="grid place-items-center size-9 rounded-full hover:bg-secondary"><X className="size-4" /></button>
        </header>

        <div className="px-5 sm:px-8 pt-4 pb-2 flex gap-1.5">
          {steps.map((s, i) => (
            <button key={s} onClick={() => setStep(i)}
              className={cn("flex-1 h-1.5 rounded-full transition-colors", i <= step ? "bg-foreground" : "bg-secondary")} />
          ))}
        </div>

        <div className="px-5 sm:px-8 py-6 space-y-6">
          {step === 0 && (
            <>
              <Field label="Profile photo">
                <div className="flex items-center gap-4">
                  {photo ? (
                    <img src={photo} alt="" className="size-20 rounded-2xl object-cover border border-border" />
                  ) : (
                    <div className="size-20 rounded-2xl border border-dashed border-border grid place-items-center text-muted-foreground"><Upload className="size-5" /></div>
                  )}
                  <div>
                    <input ref={photoInput} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
                    <button onClick={() => photoInput.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-sm hover:bg-secondary"><Upload className="size-4" /> Upload photo</button>
                    <p className="text-xs text-muted-foreground mt-1.5">JPG / PNG up to 4MB</p>
                  </div>
                </div>
              </Field>
              <Grid2>
                <Field label="Full name *"><Input value={t.full_name} onChange={(v) => set("full_name", v)} placeholder="Ms. Ayesha Khan" /></Field>
                <Field label="Designation *"><Input value={t.designation} onChange={(v) => set("designation", v)} placeholder="Senior Teacher" /></Field>
                <Field label="Department"><Input value={t.department || ""} onChange={(v) => set("department", v)} placeholder="Sciences" /></Field>
                <Field label="Teaching level"><Input value={t.teaching_level || ""} onChange={(v) => set("teaching_level", v)} placeholder="Secondary (Grade 9–10)" /></Field>
              </Grid2>
              <Field label="Short bio">
                <textarea value={t.bio || ""} onChange={(e) => set("bio", e.target.value)} rows={4}
                  placeholder="A short professional introduction…"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm outline-none focus:border-ring resize-none" />
              </Field>
              <Field label="Subject expertise">
                <ChipsInput items={t.subjects} onChange={(v) => set("subjects", v)} placeholder="e.g. Physics, then press Enter" />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <RepeaterSection
                title="Qualifications" icon={GraduationCap} items={t.qualifications}
                onChange={(v) => set("qualifications", v as Qualification[])}
                empty={(): Qualification => ({ degree: "", institution: "", year: "" })}
                render={(it, set) => (
                  <Grid2>
                    <Field label="Degree"><Input value={it.degree} onChange={(v) => set({ ...it, degree: v })} placeholder="M.Sc Physics" /></Field>
                    <Field label="Institution"><Input value={it.institution} onChange={(v) => set({ ...it, institution: v })} placeholder="Punjab University" /></Field>
                    <Field label="Year"><Input value={it.year} onChange={(v) => set({ ...it, year: v })} placeholder="2018" /></Field>
                  </Grid2>
                )}
              />
              <RepeaterSection
                title="Experience" icon={Briefcase} items={t.experiences}
                onChange={(v) => set("experiences", v as Experience[])}
                empty={(): Experience => ({ role: "", organization: "", period: "", description: "" })}
                render={(it, set) => (
                  <>
                    <Grid2>
                      <Field label="Role"><Input value={it.role} onChange={(v) => set({ ...it, role: v })} placeholder="Senior Physics Teacher" /></Field>
                      <Field label="Organization"><Input value={it.organization} onChange={(v) => set({ ...it, organization: v })} placeholder="Beaconhouse School" /></Field>
                      <Field label="Period"><Input value={it.period} onChange={(v) => set({ ...it, period: v })} placeholder="2018 – Present" /></Field>
                    </Grid2>
                    <Field label="Description (optional)">
                      <textarea value={it.description || ""} onChange={(e) => set({ ...it, description: e.target.value })} rows={2}
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm outline-none focus:border-ring resize-none" />
                    </Field>
                  </>
                )}
              />
              <RepeaterSection
                title="Certifications" icon={Award} items={t.certifications}
                onChange={(v) => set("certifications", v as Certification[])}
                empty={(): Certification => ({ title: "", issuer: "", year: "" })}
                render={(it, set) => (
                  <Grid2>
                    <Field label="Title"><Input value={it.title} onChange={(v) => set({ ...it, title: v })} placeholder="Cambridge CELTA" /></Field>
                    <Field label="Issuer"><Input value={it.issuer} onChange={(v) => set({ ...it, issuer: v })} placeholder="Cambridge" /></Field>
                    <Field label="Year"><Input value={it.year} onChange={(v) => set({ ...it, year: v })} placeholder="2021" /></Field>
                  </Grid2>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Field label={<><Sparkles className="size-3.5 inline mr-1" /> Skills</>}>
                <ChipsInput items={t.skills} onChange={(v) => set("skills", v)} placeholder="e.g. Curriculum design" />
              </Field>
              <Field label={<><Languages className="size-3.5 inline mr-1" /> Languages</>}>
                <ChipsInput items={t.languages} onChange={(v) => set("languages", v)} placeholder="e.g. English" />
              </Field>
              <Field label={<><Trophy className="size-3.5 inline mr-1" /> Achievements</>}>
                <ChipsInput items={t.achievements} onChange={(v) => set("achievements", v)} placeholder="Award or recognition…" />
              </Field>
              <Field label="Resume (optional)">
                <div className="flex items-center gap-3">
                  <input ref={resumeInput} type="file" accept="application/pdf" hidden onChange={(e) => e.target.files?.[0] && handleResume(e.target.files[0])} />
                  <button onClick={() => resumeInput.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-2 text-sm hover:bg-secondary"><Upload className="size-4" /> {t.resume_path ? "Replace PDF" : "Upload PDF"}</button>
                  {t.resume_path && <span className="text-xs text-muted-foreground">Uploaded ✓</span>}
                </div>
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Grid2>
                <Field label="Email"><Input value={t.email || ""} onChange={(v) => set("email", v)} placeholder="ayesha@school.edu.pk" /></Field>
                <Field label="Phone"><Input value={t.phone || ""} onChange={(v) => set("phone", v)} placeholder="+92 300 1234567" /></Field>
                <Field label="LinkedIn URL"><Input value={t.linkedin_url || ""} onChange={(v) => set("linkedin_url", v)} placeholder="https://linkedin.com/in/…" /></Field>
                <Field label="Facebook URL"><Input value={t.facebook_url || ""} onChange={(v) => set("facebook_url", v)} placeholder="https://facebook.com/…" /></Field>
              </Grid2>
              <label className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated px-4 py-3 cursor-pointer">
                <input type="checkbox" checked={!!t.is_published} onChange={(e) => set("is_published", e.target.checked)} className="size-4 accent-current" />
                <div>
                  <div className="text-sm font-medium">Publish on public website</div>
                  <div className="text-xs text-muted-foreground">Visible on /faculty when checked.</div>
                </div>
              </label>
            </>
          )}
        </div>

        <footer className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border px-5 sm:px-8 py-4 flex items-center justify-between gap-3">
          <button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} className="rounded-full border border-border px-4 py-2 text-sm disabled:opacity-50">Back</button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} className="rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium">Next</button>
          ) : (
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium disabled:opacity-60">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save teacher
            </button>
          )}
        </footer>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------- Form primitives ------------------------ */

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm outline-none focus:border-ring" />
  );
}

function ChipsInput({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [v, setV] = useState("");
  const add = () => {
    const val = v.trim();
    if (!val) return;
    if (!items.includes(val)) onChange([...items, val]);
    setV("");
  };
  return (
    <div className="rounded-xl border border-border bg-surface-elevated px-2 py-2 flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs">
          {it}
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
        </span>
      ))}
      <input
        value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
        onBlur={add}
        className="flex-1 min-w-[140px] bg-transparent px-2 py-1 text-sm outline-none"
      />
    </div>
  );
}

function RepeaterSection<T>({ title, icon: Icon, items, onChange, empty, render }: {
  title: string; icon: any; items: T[]; onChange: (v: T[]) => void; empty: () => T; render: (item: T, set: (v: T) => void) => React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Icon className="size-4" /><h3 className="font-medium">{title}</h3></div>
        <button onClick={() => onChange([...items, empty()])} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Plus className="size-3.5" /> Add</button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No {title.toLowerCase()} added yet.</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((it, i) => (
              <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-border p-4 space-y-3 relative">
                <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="absolute right-2 top-2 size-7 grid place-items-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /></button>
                {render(it, (v) => onChange(items.map((x, j) => (j === i ? v : x))))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
