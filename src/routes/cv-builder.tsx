import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Download, Sparkles, GraduationCap, Briefcase, Award, Languages as LangIcon, BookOpen, User, Mail, Phone, Linkedin, MapPin, Eye, FileEdit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DropZone } from "@/components/site/DropZone";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cv-builder")({
  head: () => ({
    meta: [
      { title: "Free CV Builder — Bloom Public School" },
      { name: "description", content: "Create a professional, printable CV in minutes with our free guided builder." },
      { property: "og:title", content: "Free CV Builder" },
      { property: "og:description", content: "Build a polished CV and download as PDF." },
    ],
  }),
  component: CVBuilderPage,
});

type Edu = { degree: string; institution: string; year: string };
type Exp = { role: string; org: string; period: string; description: string };
type Proj = { title: string; description: string };

type CV = {
  photo: string | null;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  education: Edu[];
  experience: Exp[];
  skills: string[];
  languages: string[];
  achievements: string[];
  projects: Proj[];
};

const empty: CV = {
  photo: null,
  name: "", title: "", email: "", phone: "", location: "", linkedin: "", summary: "",
  education: [], experience: [], skills: [], languages: [], achievements: [], projects: [],
};

function CVBuilderPage() {
  const [cv, setCv] = useState<CV>(empty);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const set = <K extends keyof CV>(k: K, v: CV[K]) => setCv((s) => ({ ...s, [k]: v }));
  const handlePrint = () => window.print();

  return (
    <section className="container-page pt-28 pb-20 print:pt-0 print:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Free Tool</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight">Professional CV builder</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">Fill the guided form, preview live, and download a clean printable PDF — no signup required.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-surface-elevated p-1 lg:hidden">
            <TabBtn active={tab === "edit"} onClick={() => setTab("edit")} icon={FileEdit} label="Edit" />
            <TabBtn active={tab === "preview"} onClick={() => setTab("preview")} icon={Eye} label="Preview" />
          </div>
          <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 shadow-[var(--shadow-elevated)]">
            <Download className="size-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6 print:block">
        {/* Editor */}
        <div className={cn("space-y-5 print:hidden", tab !== "edit" && "hidden lg:block")}>
          <Card title="Personal info" icon={User}>
            <Field label="Profile photo (optional)">
              <DropZone
                accept="image/*"
                maxSizeMB={4}
                hint="JPG or PNG up to 4MB — embedded in your CV"
                filename={cv.photo ? "Photo added" : null}
                onFile={async (file) => {
                  const dataUrl = await new Promise<string>((resolve, reject) => {
                    const r = new FileReader();
                    r.onload = () => resolve(r.result as string);
                    r.onerror = () => reject(new Error("Could not read file"));
                    r.readAsDataURL(file);
                  });
                  set("photo", dataUrl);
                }}
                onClear={() => set("photo", null)}
                preview={cv.photo ? <img src={cv.photo} alt="" className="size-16 rounded-xl object-cover border border-border" /> : undefined}
              />
            </Field>
            <Grid2>
              <Field label="Full name"><Input value={cv.name} onChange={(v) => set("name", v)} placeholder="Your name" /></Field>
              <Field label="Headline / Title"><Input value={cv.title} onChange={(v) => set("title", v)} placeholder="Mathematics Teacher" /></Field>
              <Field label="Email"><Input value={cv.email} onChange={(v) => set("email", v)} placeholder="you@example.com" /></Field>
              <Field label="Phone"><Input value={cv.phone} onChange={(v) => set("phone", v)} placeholder="+92 300 1234567" /></Field>
              <Field label="Location"><Input value={cv.location} onChange={(v) => set("location", v)} placeholder="Lahore, Pakistan" /></Field>
              <Field label="LinkedIn"><Input value={cv.linkedin} onChange={(v) => set("linkedin", v)} placeholder="linkedin.com/in/…" /></Field>
            </Grid2>
            <Field label="Professional summary">
              <textarea value={cv.summary} onChange={(e) => set("summary", e.target.value)} rows={3}
                placeholder="A brief professional summary…"
                className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm outline-none focus:border-ring resize-none" />
            </Field>
          </Card>

          <Repeater title="Education" icon={GraduationCap} items={cv.education}
            onChange={(v) => set("education", v as Edu[])}
            empty={(): Edu => ({ degree: "", institution: "", year: "" })}
            render={(it, s) => (
              <Grid2>
                <Field label="Degree"><Input value={it.degree} onChange={(v) => s({ ...it, degree: v })} placeholder="B.Ed" /></Field>
                <Field label="Institution"><Input value={it.institution} onChange={(v) => s({ ...it, institution: v })} placeholder="University name" /></Field>
                <Field label="Year"><Input value={it.year} onChange={(v) => s({ ...it, year: v })} placeholder="2020" /></Field>
              </Grid2>
            )} />

          <Repeater title="Experience" icon={Briefcase} items={cv.experience}
            onChange={(v) => set("experience", v as Exp[])}
            empty={(): Exp => ({ role: "", org: "", period: "", description: "" })}
            render={(it, s) => (
              <>
                <Grid2>
                  <Field label="Role"><Input value={it.role} onChange={(v) => s({ ...it, role: v })} placeholder="Senior Teacher" /></Field>
                  <Field label="Organization"><Input value={it.org} onChange={(v) => s({ ...it, org: v })} placeholder="School / Company" /></Field>
                  <Field label="Period"><Input value={it.period} onChange={(v) => s({ ...it, period: v })} placeholder="2018 – Present" /></Field>
                </Grid2>
                <Field label="Description">
                  <textarea value={it.description} onChange={(e) => s({ ...it, description: e.target.value })} rows={2}
                    className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm outline-none focus:border-ring resize-none" />
                </Field>
              </>
            )} />

          <Repeater title="Projects" icon={BookOpen} items={cv.projects}
            onChange={(v) => set("projects", v as Proj[])}
            empty={(): Proj => ({ title: "", description: "" })}
            render={(it, s) => (
              <>
                <Field label="Project title"><Input value={it.title} onChange={(v) => s({ ...it, title: v })} placeholder="Smart classroom initiative" /></Field>
                <Field label="Description">
                  <textarea value={it.description} onChange={(e) => s({ ...it, description: e.target.value })} rows={2}
                    className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm outline-none focus:border-ring resize-none" />
                </Field>
              </>
            )} />

          <Card title="Skills, languages & achievements" icon={Sparkles}>
            <Field label="Skills"><Chips items={cv.skills} onChange={(v) => set("skills", v)} placeholder="e.g. Lesson planning" /></Field>
            <Field label="Languages"><Chips items={cv.languages} onChange={(v) => set("languages", v)} placeholder="e.g. English" /></Field>
            <Field label="Achievements"><Chips items={cv.achievements} onChange={(v) => set("achievements", v)} placeholder="Award or recognition…" /></Field>
          </Card>
        </div>

        {/* Live preview */}
        <div className={cn("lg:sticky lg:top-24 lg:self-start", tab !== "preview" && "hidden lg:block")}>
          <CVPreview cv={cv} />
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Preview (printable) ----------------------- */

function CVPreview({ cv }: { cv: CV }) {
  return (
    <div id="cv-print-area" className="mx-auto bg-white text-black rounded-3xl border border-border shadow-[var(--shadow-elevated)] overflow-hidden print:rounded-none print:shadow-none print:border-0 max-w-[820px]">
      <div className="bg-[image:var(--gradient-primary)] text-primary-foreground px-8 py-7">
        <h1 className="font-display text-3xl font-semibold">{cv.name || "Your name"}</h1>
        <p className="text-base opacity-90 mt-1">{cv.title || "Professional title"}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs opacity-95">
          {cv.email && <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" />{cv.email}</span>}
          {cv.phone && <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" />{cv.phone}</span>}
          {cv.location && <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{cv.location}</span>}
          {cv.linkedin && <span className="inline-flex items-center gap-1.5"><Linkedin className="size-3.5" />{cv.linkedin}</span>}
        </div>
      </div>

      <div className="p-8 space-y-6 text-sm leading-relaxed">
        {cv.summary && <PSection title="Summary"><p>{cv.summary}</p></PSection>}

        {cv.experience.length > 0 && (
          <PSection title="Experience">
            {cv.experience.map((e, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <strong className="text-[15px]">{e.role || "Role"}</strong>
                  {e.period && <span className="text-xs opacity-70">{e.period}</span>}
                </div>
                {e.org && <div className="text-[13px] opacity-80">{e.org}</div>}
                {e.description && <p className="mt-1 opacity-90">{e.description}</p>}
              </div>
            ))}
          </PSection>
        )}

        {cv.education.length > 0 && (
          <PSection title="Education">
            {cv.education.map((e, i) => (
              <div key={i} className="mb-2 last:mb-0 flex flex-wrap justify-between gap-2">
                <div>
                  <strong>{e.degree || "Degree"}</strong>
                  {e.institution && <div className="text-[13px] opacity-80">{e.institution}</div>}
                </div>
                {e.year && <span className="text-xs opacity-70">{e.year}</span>}
              </div>
            ))}
          </PSection>
        )}

        {cv.projects.length > 0 && (
          <PSection title="Projects">
            {cv.projects.map((p, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <strong>{p.title || "Project"}</strong>
                {p.description && <p className="opacity-90">{p.description}</p>}
              </div>
            ))}
          </PSection>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {cv.skills.length > 0 && (
            <PSection title="Skills"><div className="flex flex-wrap gap-1.5">{cv.skills.map((s, i) => <Pill key={i}>{s}</Pill>)}</div></PSection>
          )}
          {cv.languages.length > 0 && (
            <PSection title="Languages"><div className="flex flex-wrap gap-1.5">{cv.languages.map((s, i) => <Pill key={i}>{s}</Pill>)}</div></PSection>
          )}
        </div>

        {cv.achievements.length > 0 && (
          <PSection title="Achievements">
            <ul className="list-disc pl-5 space-y-1">
              {cv.achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </PSection>
        )}
      </div>
    </div>
  );
}

function PSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[11px] uppercase tracking-[0.18em] text-black/60 border-b border-black/15 pb-1 mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-xs rounded-full bg-black/[.06] px-2.5 py-1">{children}</span>;
}

/* ----------------------- Editor primitives ----------------------- */

function Card({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2"><div className="grid place-items-center size-8 rounded-xl bg-secondary"><Icon className="size-4" /></div><h3 className="font-display font-semibold">{title}</h3></div>
      {children}
    </div>
  );
}
function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>{children}</div>;
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm outline-none focus:border-ring" />;
}
function Chips({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [v, setV] = useState("");
  const add = () => { const val = v.trim(); if (!val) return; if (!items.includes(val)) onChange([...items, val]); setV(""); };
  return (
    <div className="rounded-xl border border-border bg-surface-elevated px-2 py-2 flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs">
          {it}<button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">×</button>
        </span>
      ))}
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} onBlur={add}
        className="flex-1 min-w-[140px] bg-transparent px-2 py-1 text-sm outline-none" />
    </div>
  );
}

function Repeater<T>({ title, icon: Icon, items, onChange, empty, render }: {
  title: string; icon: any; items: T[]; onChange: (v: T[]) => void; empty: () => T; render: (item: T, set: (v: T) => void) => React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><div className="grid place-items-center size-8 rounded-xl bg-secondary"><Icon className="size-4" /></div><h3 className="font-display font-semibold">{title}</h3></div>
        <button onClick={() => onChange([...items, empty()])} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Plus className="size-3.5" /> Add {title.toLowerCase()}</button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Click <strong>Add</strong> to get started.</p>
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

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition", active ? "bg-foreground text-background" : "text-muted-foreground")}>
      <Icon className="size-3.5" /> {label}
    </button>
  );
}
