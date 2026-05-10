import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Linkedin, Facebook, ArrowLeft, Download, Award, BookOpen, Briefcase, GraduationCap, Languages, Sparkles, Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { publicPhotoUrl, type Teacher } from "@/lib/teacher-types";

export const Route = createFileRoute("/faculty/$id")({
  component: TeacherProfilePage,
  head: ({ params }) => ({
    meta: [
      { title: `Teacher Profile — Bloom Public School` },
      { name: "description", content: `Profile of educator at Bloom Public School (${params.id}).` },
    ],
  }),
});

function TeacherProfilePage() {
  const { id } = useParams({ from: "/faculty/$id" });
  const [t, setT] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("teachers")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();
      setT((data as unknown as Teacher) || null);
      setLoading(false);
    })();
  }, [id]);

  const downloadResume = async () => {
    if (!t?.resume_path) return;
    const { data, error } = await supabase.storage.from("teacher-resumes").createSignedUrl(t.resume_path, 60);
    if (error) { alert(error.message); return; }
    setResumeUrl(data.signedUrl);
    window.open(data.signedUrl, "_blank");
  };

  if (loading) {
    return <div className="container-page py-32 text-center text-muted-foreground"><Loader2 className="size-5 animate-spin inline mr-2" />Loading…</div>;
  }
  if (!t) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="font-display text-2xl">Profile not found</h1>
        <Link to="/faculty" className="mt-4 inline-flex items-center gap-2 text-primary"><ArrowLeft className="size-4" /> Back to faculty</Link>
      </div>
    );
  }

  const photo = publicPhotoUrl(t.photo_path);

  return (
    <section className="container-page pt-28 pb-20">
      <Link to="/faculty" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Faculty</Link>

      <div className="mt-6 grid lg:grid-cols-[320px,1fr] gap-8">
        {/* Sidebar card */}
        <aside className="rounded-3xl border border-border bg-card p-6 h-fit lg:sticky lg:top-24">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[image:var(--gradient-primary)] grid place-items-center text-primary-foreground">
            {photo ? (
              <img src={photo} alt={t.full_name} className="size-full object-cover" />
            ) : (
              <span className="font-display text-5xl font-semibold">
                {t.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold">{t.full_name}</h1>
          <p className="text-primary text-sm">{t.designation}</p>
          {t.department && <p className="text-xs text-muted-foreground mt-1">{t.department}{t.teaching_level ? ` · ${t.teaching_level}` : ""}</p>}

          <div className="mt-5 space-y-2 text-sm">
            {t.email && <a href={`mailto:${t.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Mail className="size-4" />{t.email}</a>}
            {t.phone && <a href={`tel:${t.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Phone className="size-4" />{t.phone}</a>}
            {t.linkedin_url && <a target="_blank" rel="noreferrer" href={t.linkedin_url} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Linkedin className="size-4" />LinkedIn</a>}
            {t.facebook_url && <a target="_blank" rel="noreferrer" href={t.facebook_url} className="flex items-center gap-2 text-muted-foreground hover:text-foreground"><Facebook className="size-4" />Facebook</a>}
          </div>

          {t.resume_path && (
            <button onClick={downloadResume} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90">
              <Download className="size-4" /> Download CV
            </button>
          )}
        </aside>

        {/* Main */}
        <div className="space-y-6">
          {t.bio && (
            <Section icon={Sparkles} title="About">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{t.bio}</p>
            </Section>
          )}

          {t.subjects.length > 0 && (
            <Section icon={BookOpen} title="Subject expertise">
              <Chips items={t.subjects} />
            </Section>
          )}

          {t.qualifications.length > 0 && (
            <Section icon={GraduationCap} title="Qualifications">
              <Timeline items={t.qualifications.map((q) => ({ title: q.degree, sub: q.institution, meta: q.year }))} />
            </Section>
          )}

          {t.experiences.length > 0 && (
            <Section icon={Briefcase} title="Experience">
              <Timeline items={t.experiences.map((e) => ({ title: e.role, sub: e.organization, meta: e.period, body: e.description }))} />
            </Section>
          )}

          {t.certifications.length > 0 && (
            <Section icon={Award} title="Certifications">
              <Timeline items={t.certifications.map((c) => ({ title: c.title, sub: c.issuer, meta: c.year }))} />
            </Section>
          )}

          {t.skills.length > 0 && (
            <Section icon={Sparkles} title="Skills">
              <Chips items={t.skills} />
            </Section>
          )}

          {t.languages.length > 0 && (
            <Section icon={Languages} title="Languages">
              <Chips items={t.languages} />
            </Section>
          )}

          {t.achievements.length > 0 && (
            <Section icon={Trophy} title="Achievements">
              <ul className="space-y-2">
                {t.achievements.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm"><span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />{a}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </section>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="grid place-items-center size-8 rounded-xl bg-secondary text-foreground"><Icon className="size-4" /></div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => (
        <span key={i} className="text-xs rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground">{s}</span>
      ))}
    </div>
  );
}

function Timeline({ items }: { items: { title: string; sub: string; meta?: string; body?: string }[] }) {
  return (
    <ol className="relative pl-5 border-l border-border space-y-5">
      {items.map((it, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[27px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-card" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-medium">{it.title}</h3>
            {it.meta && <span className="text-xs text-muted-foreground">{it.meta}</span>}
          </div>
          <p className="text-sm text-muted-foreground">{it.sub}</p>
          {it.body && <p className="mt-1 text-sm text-muted-foreground/90 leading-relaxed">{it.body}</p>}
        </li>
      ))}
    </ol>
  );
}
