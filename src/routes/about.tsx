import { createFileRoute } from "@tanstack/react-router";
import { Counter } from "@/components/site/Counter";
import { STATS, classroomImg } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Bloom Public School" },
      { name: "description", content: "Discover Bloom Public School: 25 years of academic excellence, modern facilities and a caring community in Pakistan." },
      { property: "og:title", content: "About Bloom Public School" },
      { property: "og:description", content: "25 years of academic excellence in Pakistan." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="container-page py-14">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">About</div>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
          Building confident, curious, kind learners — every day.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          Bloom Public School blends a rigorous academic foundation with sports, arts
          and service learning. Our community is built on respect, joy and excellence.
        </p>
      </section>

      <section className="container-page grid lg:grid-cols-2 gap-10 items-center">
        <img src={classroomImg} alt="Classroom" loading="lazy" width={1200} height={900} className="rounded-3xl border border-border" />
        <div className="space-y-5">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Our mission</h2>
          <p className="text-muted-foreground">
            To nurture each child’s potential through a balanced education that
            prepares them for global opportunities while staying rooted in our values.
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Our vision</h2>
          <p className="text-muted-foreground">
            To be Pakistan’s most loved modern school — a place where children
            learn to lead with knowledge, compassion and confidence.
          </p>
        </div>
      </section>

      <section className="container-page mt-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface-elevated p-6">
              <div className="font-display text-4xl font-semibold text-gradient">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
