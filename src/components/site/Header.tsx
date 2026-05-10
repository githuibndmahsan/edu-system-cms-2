import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { NAV, SCHOOL } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border/60 py-2.5" : "py-4 bg-transparent"
      )}
    >
      <div className="container-page flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center size-9 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] transition-transform group-hover:scale-105">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-display font-semibold tracking-tight text-foreground leading-none">
            {SCHOOL.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3.5 py-2 text-sm font-medium rounded-full transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/admissions"
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-foreground text-background hover:opacity-90 transition"
          >
            Apply Now
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden grid place-items-center size-10 rounded-xl border border-border bg-surface-elevated"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden container-page mt-3">
          <div className="rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-elevated)]">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/admissions"
              className="mt-1 block text-center rounded-xl px-3 py-2.5 text-sm font-semibold bg-foreground text-background"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
