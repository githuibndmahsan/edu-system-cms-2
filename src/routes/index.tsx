import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Sun, Snowflake, Calendar, Users, Award, BookOpen, Quote, Star } from "lucide-react";
import { NewsTicker } from "@/components/site/NewsTicker";
import { Counter } from "@/components/site/Counter";
import { EVENTS, FACULTY, SCHOOL, STATS, TESTIMONIALS, TIMINGS, heroImg, classroomImg } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloom Public School — Modern Education in Pakistan" },
      { name: "description", content: "Premium modern schooling in Pakistan. Admissions Open 2026 at Bloom Public School." },
      { property: "og:title", content: "Bloom Public School — Where Curiosity Blossoms" },
      { property: "og:description", content: "Admissions Open 2026. Modern campus, expert faculty, holistic learning." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <NewsTicker />
      <TimingsBar />
      <Stats />
      <FeaturedEvents />
      <AboutPreview />
      <FacultyHighlights />
      <Testimonials />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div
        aria-hidden
        className="absolute -top-40 -right-32 size-[520px] rounded-full opacity-40 blur-3xl -z-10"
        style={{ background: "radial-gradient(closest-side, oklch(0.72 0.13 220 / 0.6), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 size-[480px] rounded-full opacity-40 blur-3xl -z-10"
        style={{ background: "radial-gradient(closest-side, oklch(0.55 0.18 240 / 0.5), transparent)" }}
      />

      <div className="container-page pt-10 md:pt-16 pb-16 md:pb-24 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-[--color-cyan-accent]" />
            Admissions Open · Session 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
          >
            Where curiosity{" "}
            <span className="text-gradient">blossoms</span>
            <br className="hidden sm:block" />
            into excellence.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground"
          >
            {SCHOOL.name} is a modern Pakistani school combining rigorous academics
            with sports, arts and character — preparing confident learners for a fast-changing world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/admissions"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Apply for Admission
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-5 py-3 text-sm font-medium hover:bg-secondary transition"
            >
              Discover the school
            </Link>
          </motion.div>

          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="size-8 rounded-full border-2 border-background"
                  style={{ background: `linear-gradient(135deg, oklch(${0.55 + i*0.05} 0.15 ${220 + i*10}), oklch(0.4 0.12 260))` }}
                />
              ))}
            </div>
            <span>Trusted by <span className="font-semibold text-foreground">1,200+ families</span> across the city</span>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] border border-border"
          >
            <img
              src={heroImg}
              alt="Bloom Public School students walking outside the campus"
              width={1600}
              height={1100}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="hidden md:flex absolute -left-6 bottom-8 glass rounded-2xl border border-border p-4 shadow-[var(--shadow-soft)] gap-3 items-center [animation:var(--animate-float)]"
          >
            <div className="grid place-items-center size-10 rounded-xl bg-success/15 text-[--color-success]">
              <Award className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">98% Board Pass Rate</div>
              <div className="text-xs text-muted-foreground mt-1">2024 Matric Results</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="hidden md:flex absolute -right-4 top-8 glass rounded-2xl border border-border p-4 shadow-[var(--shadow-soft)] gap-3 items-center"
          >
            <div className="grid place-items-center size-10 rounded-xl bg-[--color-cyan-accent]/15 text-[--color-cyan-accent]">
              <Users className="size-5" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">60+ Faculty</div>
              <div className="text-xs text-muted-foreground mt-1">Highly qualified</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TimingsBar() {
  const t = TIMINGS[TIMINGS.current];
  const Icon = TIMINGS.current === "winter" ? Snowflake : Sun;
  return (
    <section className="container-page mt-10">
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-soft)] grid sm:grid-cols-4 gap-4 sm:items-center">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center size-11 rounded-2xl bg-secondary text-foreground">
            <Icon className="size-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Current schedule</div>
            <div className="font-display font-semibold capitalize">{TIMINGS.current} Timings</div>
          </div>
        </div>
        <Cell label="School Hours" value={`${t.start} – ${t.end}`} />
        <Cell label="Break" value={t.break} />
        <Cell label="Working Days" value={TIMINGS.days} />
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="container-page mt-16">
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
  );
}

function FeaturedEvents() {
  const featured = EVENTS.slice(0, 3);
  return (
    <section className="container-page mt-24">
      <SectionHead
        eyebrow="Campus Life"
        title="Featured events & celebrations"
        action={<Link to="/events" className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1">All events <ArrowRight className="size-4" /></Link>}
      />
      <div className="mt-8 grid md:grid-cols-3 gap-5">
        {featured.map((e, i) => (
          <motion.article
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={e.image}
                alt={e.title}
                loading="lazy"
                width={1000}
                height={750}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-accent text-accent-foreground px-2.5 py-1 font-medium">{e.category}</span>
                <span className="text-muted-foreground inline-flex items-center gap-1"><Calendar className="size-3.5" />{e.date}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{e.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{e.excerpt}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="container-page mt-24 grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-5 relative">
        <img
          src={classroomImg}
          alt="Students engaged in a classroom"
          loading="lazy"
          width={1200}
          height={900}
          className="rounded-3xl border border-border shadow-[var(--shadow-soft)]"
        />
      </div>
      <div className="lg:col-span-7">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">About Bloom</div>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          A modern campus built for tomorrow’s leaders.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          For 25 years, Bloom Public School has combined Pakistan’s strong educational
          values with progressive teaching methods. Our students grow in safe, joyful
          spaces — learning to think critically, act kindly and lead confidently.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {[
            { icon: BookOpen, title: "Future-ready curriculum", desc: "Cambridge-aligned with strong national identity." },
            { icon: Users, title: "Caring mentors", desc: "Small classes, individual attention." },
            { icon: Award, title: "Award-winning results", desc: "Consistent toppers in board exams." },
            { icon: Sparkles, title: "Beyond academics", desc: "Sports, arts, robotics & service." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-border bg-surface-elevated p-4">
              <div className="grid place-items-center size-10 rounded-xl bg-secondary shrink-0"><Icon className="size-5" /></div>
              <div>
                <div className="font-medium">{title}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FacultyHighlights() {
  return (
    <section className="container-page mt-24">
      <SectionHead eyebrow="Our People" title="Meet the educators behind Bloom" />
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FACULTY.map((f) => (
          <div key={f.name} className="group rounded-3xl border border-border bg-card p-5 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] transition-all">
            <div
              className="aspect-square rounded-2xl mb-4"
              style={{ background: "linear-gradient(135deg, oklch(0.85 0.05 240), oklch(0.65 0.13 240))" }}
            />
            <div className="font-display font-semibold">{f.name}</div>
            <div className="text-sm text-muted-foreground">{f.role}</div>
            <div className="mt-2 text-xs inline-flex rounded-full bg-secondary px-2.5 py-1">{f.subject}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container-page mt-24">
      <SectionHead eyebrow="Voices" title="Loved by parents and alumni" />
      <div className="mt-8 grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="rounded-3xl border border-border bg-card p-6 relative"
          >
            <Quote className="size-6 text-[--color-primary-glow] opacity-60" />
            <p className="mt-3 text-sm leading-relaxed">{t.quote}</p>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
              <div className="flex gap-0.5 text-[--color-warning]">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-3.5 fill-current" />)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{eyebrow}</div>
        <h2 className="mt-1.5 font-display text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
