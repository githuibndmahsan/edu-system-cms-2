import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Upload } from "lucide-react";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions — Bloom Public School" },
      { name: "description", content: "Apply online for Session 2026 at Bloom Public School. Simple, quick and secure form." },
      { property: "og:title", content: "Admissions Open — Bloom Public School" },
      { property: "og:description", content: "Apply online for Session 2026." },
    ],
  }),
  component: AdmissionsPage,
});

const schema = z.object({
  studentName: z.string().trim().min(2, "Enter student name").max(80),
  fatherName: z.string().trim().min(2, "Enter father's name").max(80),
  classApplying: z.string().min(1, "Select class"),
  age: z.coerce.number().int().min(3, "Min age 3").max(20),
  contact: z.string().trim().regex(/^[0-9+\-\s]{7,20}$/, "Enter valid phone"),
  address: z.string().trim().min(5, "Enter address").max(200),
  previousSchool: z.string().trim().max(120).optional().or(z.literal("")),
});

type FormState = Record<keyof z.infer<typeof schema>, string>;

const CLASSES = ["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

function AdmissionsPage() {
  const [form, setForm] = useState<FormState>({
    studentName: "", fatherName: "", classApplying: "", age: "", contact: "", address: "", previousSchool: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const onChange = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as keyof FormState] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
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
            Fill the online admission form below. Our team will guide you through
            interviews, assessment and enrolment.
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
              <input className="input" type="number" min={3} max={20} value={form.age} onChange={onChange("age")} />
            </Field>
            <Field label="Contact number" error={errors.contact}>
              <input className="input" placeholder="+92 300 0000000" value={form.contact} onChange={onChange("contact")} />
            </Field>
            <Field label="Previous school (optional)" error={errors.previousSchool}>
              <input className="input" value={form.previousSchool} onChange={onChange("previousSchool")} />
            </Field>
          </div>
          <Field label="Address" error={errors.address}>
            <textarea className="input min-h-[88px]" value={form.address} onChange={onChange("address")} />
          </Field>

          <div>
            <label className="text-sm font-medium">Documents (optional)</label>
            <label className="mt-1.5 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-surface px-4 py-3 cursor-pointer hover:bg-secondary/50 transition">
              <span className="text-sm text-muted-foreground inline-flex items-center gap-2">
                <Upload className="size-4" />{fileName || "Upload birth certificate, last result card (PDF/JPG)"}
              </span>
              <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} accept=".pdf,.jpg,.jpeg,.png" />
              <span className="rounded-full bg-secondary px-3 py-1 text-xs">Browse</span>
            </label>
          </div>

          <button type="submit" className="w-full rounded-full bg-foreground text-background py-3 text-sm font-semibold hover:opacity-90 transition">
            Submit Application
          </button>
        </form>
      </div>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--color-border); background: var(--color-surface-elevated); padding: 0.65rem 0.85rem; font-size: 0.9rem; outline: none; transition: border-color .15s, box-shadow .15s; }
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
