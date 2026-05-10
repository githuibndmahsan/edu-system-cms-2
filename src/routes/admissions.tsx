import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions — Bloom Public School" },
      { name: "description", content: "Apply online for Session 2026 at Bloom Public School. Quick, mobile-friendly form with secure document upload." },
      { property: "og:title", content: "Admissions Open — Bloom Public School" },
      { property: "og:description", content: "Apply online for Session 2026." },
    ],
  }),
  component: AdmissionsPage,
});

const schema = z.object({
  studentName: z.string().trim().min(2, "Enter student name").max(80),
  fatherName: z.string().trim().min(2, "Enter father's name").max(80),
  classApplying: z.string().min(1, "Select class").max(40),
  age: z.coerce.number().int().min(3, "Min age 3").max(25),
  contact: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Enter valid phone"),
  address: z.string().trim().min(5, "Enter address").max(300),
  previousSchool: z.string().trim().max(120).optional().or(z.literal("")),
});

type FormState = Record<keyof z.infer<typeof schema>, string>;

const CLASSES = ["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function AdmissionsPage() {
  const [form, setForm] = useState<FormState>({
    studentName: "", fatherName: "", classApplying: "", age: "", contact: "", address: "", previousSchool: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > MAX_FILE_BYTES) {
      setServerError("File too large (max 5 MB).");
      return;
    }
    setServerError("");
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as keyof FormState] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      let documentPath: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        const safeName = `${crypto.randomUUID()}.${ext}`;
        const path = `${new Date().getFullYear()}/${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("admission-docs")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        documentPath = path;
      }

      const d = parsed.data;
      const { error: insErr } = await supabase.from("applications").insert({
        student_name: d.studentName,
        father_name: d.fatherName,
        class_applying: d.classApplying,
        age: d.age,
        contact: d.contact,
        address: d.address,
        previous_school: d.previousSchool || null,
        document_path: documentPath,
      });
      if (insErr) throw insErr;

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setServerError(err?.message || "Could not submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="container-page py-20">
        <div className="max-w-xl mx-auto text-center rounded-3xl border border-border bg-card p-10 shadow-[var(--shadow-soft)]">
          <div className="mx-auto grid place-items-center size-14 rounded-full bg-success/15 text-[--color-success]">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-semibold">Application received</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you, {form.studentName}. Our admissions team will reach out at {form.contact} within 2 working days.
          </p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-foreground text-background px-5 py-2.5 text-sm">Back to home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-14">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Admissions Open</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Begin your child’s journey at Bloom.
          </h1>
          <p className="mt-5 text-muted-foreground">
            Fill the online form below. Our team will guide you through interviews, assessment and enrolment.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Limited seats per class",
              "Merit-based assessment",
              "Sibling priority available",
              "Transparent fee structure",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-[--color-success] mt-0.5" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-soft)] space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Student name" error={errors.studentName}>
              <input className="input" value={form.studentName} onChange={onChange("studentName")} />
            </Field>
            <Field label="Father's name" error={errors.fatherName}>
              <input className="input" value={form.fatherName} onChange={onChange("fatherName")} />
            </Field>
            <Field label="Class applying for" error={errors.classApplying}>
              <select className="input" value={form.classApplying} onChange={onChange("classApplying")}>
                <option value="">Select class</option>
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Age" error={errors.age}>
              <input className="input" type="number" inputMode="numeric" min={3} max={25} value={form.age} onChange={onChange("age")} />
            </Field>
            <Field label="Contact number" error={errors.contact}>
              <input className="input" inputMode="tel" placeholder="+92 300 0000000" value={form.contact} onChange={onChange("contact")} />
            </Field>
            <Field label="Previous school (optional)" error={errors.previousSchool}>
              <input className="input" value={form.previousSchool} onChange={onChange("previousSchool")} />
            </Field>
          </div>
          <Field label="Address" error={errors.address}>
            <textarea className="input min-h-[88px]" value={form.address} onChange={onChange("address")} />
          </Field>

          <div>
            <label className="text-sm font-medium">Documents (optional, PDF/JPG/PNG, max 5 MB)</label>
            <label className="mt-1.5 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-surface px-4 py-3 cursor-pointer hover:bg-secondary/50 transition">
              <span className="text-sm text-muted-foreground inline-flex items-center gap-2 truncate">
                <Upload className="size-4 shrink-0" />
                <span className="truncate">{file ? file.name : "Upload birth certificate, last result card"}</span>
              </span>
              <input type="file" className="hidden" onChange={onFile} accept=".pdf,.jpg,.jpeg,.png" />
              <span className="rounded-full bg-secondary px-3 py-1 text-xs shrink-0">Browse</span>
            </label>
          </div>

          {serverError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm px-4 py-3">{serverError}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--color-border); background: var(--color-surface-elevated); padding: 0.65rem 0.85rem; font-size: 0.95rem; outline: none; transition: border-color .15s, box-shadow .15s; }
        .input:focus { border-color: var(--color-ring); box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-ring) 18%, transparent); }
      `}</style>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
