import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap, Mail, Phone, Linkedin, Facebook, ArrowRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { publicPhotoUrl, type Teacher } from "@/lib/teacher-types";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty — Bloom Public School" },
      { name: "description", content: "Meet our experienced and dedicated teaching faculty at Bloom Public School." },
      { property: "og:title", content: "Our Faculty — Bloom Public School" },
      { property: "og:description", content: "Profiles of our expert educators." },
    ],
  }),
  component: FacultyPage,
});

function FacultyPage() {
  const [rows, setRows] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("All");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("teachers")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setRows((data as unknown as Teacher[]) || []);
      setLoading(false);
    })();
  }, []);

  const departments = ["All", ...Array.from(new Set(rows.map((r) => r.department).filter(Boolean) as string[]))];
  const ql = q.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (dept !== "All" && r.department !== dept) return false;
    if (!ql) return true;
    return (
      r.full_name.toLowerCase().includes(ql) ||
      r.designation.toLowerCase().includes(ql) ||
      r.subjects.some((s) => s.toLowerCase().includes(ql))
    );
  });

  return (
    <section className="container-page pt-28 pb-20">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Our People</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
          Faculty & educators
        </h1>
        <p className="mt-3 text-muted-foreground">
          A team of passionate teachers committed to nurturing curiosity, character and competence.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1 rounded-full border border-border bg-surface-elevated p-1">
          {departments.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                dept === d ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, subject…"
            className="w-full sm:w-72 rounded-full border border-border bg-surface-elevated pl-9 pr-3 py-2 text-sm outline-none focus:border-ring"
          />
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6 h-72 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
            No teacher profiles to display yet.
          </div>
        ) : (
          filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group rounded-3xl border border-border bg-card p-6 hover:shadow-[var(--shadow-elevated)] transition"
            >
              <div className="flex items-start gap-4">
                <Avatar name={t.full_name} src={publicPhotoUrl(t.photo_path)} />
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold truncate">{t.full_name}</h3>
                  <p className="text-sm text-primary truncate">{t.designation}</p>
                  {t.department && <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.department}</p>}
                </div>
              </div>

              {t.subjects.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.subjects.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{s}</span>
                  ))}
                </div>
              )}

              {t.bio && <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{t.bio}</p>}

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {t.email && <a aria-label="Email" href={`mailto:${t.email}`} className="hover:text-foreground"><Mail className="size-4" /></a>}
                  {t.phone && <a aria-label="Phone" href={`tel:${t.phone}`} className="hover:text-foreground"><Phone className="size-4" /></a>}
                  {t.linkedin_url && <a aria-label="LinkedIn" target="_blank" rel="noreferrer" href={t.linkedin_url} className="hover:text-foreground"><Linkedin className="size-4" /></a>}
                  {t.facebook_url && <a aria-label="Facebook" target="_blank" rel="noreferrer" href={t.facebook_url} className="hover:text-foreground"><Facebook className="size-4" /></a>}
                </div>
                <Link
                  to="/faculty/$id"
                  params={{ id: t.id }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition"
                >
                  Profile <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    return <img src={src} alt={name} className="size-16 rounded-2xl object-cover bg-secondary shrink-0" loading="lazy" />;
  }
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="size-16 rounded-2xl grid place-items-center bg-[image:var(--gradient-primary)] text-primary-foreground font-display font-semibold text-lg shrink-0">
      {initials || <GraduationCap className="size-6" />}
    </div>
  );
}
