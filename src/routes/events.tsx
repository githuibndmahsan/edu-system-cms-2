import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { EVENTS, type EventCategory } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Bloom Public School" },
      { name: "description", content: "Sports galas, national days, science fairs and cultural celebrations at Bloom Public School." },
      { property: "og:title", content: "Events at Bloom Public School" },
      { property: "og:description", content: "Sports, academic, cultural and national celebrations." },
    ],
  }),
  component: EventsPage,
});

const CATEGORIES: ("All" | EventCategory)[] = ["All", "Academic", "Sports", "National", "Cultural", "Islamic"];

function EventsPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const filtered = useMemo(() => active === "All" ? EVENTS : EVENTS.filter(e => e.category === active), [active]);

  return (
    <section className="container-page py-14">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">Events</div>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-3xl">
        Moments that shape a school year.
      </h1>
      <p className="mt-5 text-muted-foreground max-w-2xl">
        From Independence Day parades to inter-class science fairs — explore the
        full spectrum of campus life at Bloom.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium border transition",
              active === c
                ? "bg-foreground text-background border-foreground"
                : "bg-surface-elevated text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((e) => (
            <motion.article
              key={e.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="group rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={e.image} alt={e.title} loading="lazy" width={1000} height={750}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-accent text-accent-foreground px-2.5 py-1 font-medium">{e.category}</span>
                  <span className="text-muted-foreground inline-flex items-center gap-1"><Calendar className="size-3.5" />{e.date}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{e.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{e.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
