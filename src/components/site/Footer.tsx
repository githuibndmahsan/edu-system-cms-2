import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, Phone, MapPin, Facebook } from "lucide-react";
import { NAV, SCHOOL } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center size-9 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display font-semibold text-lg">{SCHOOL.name}</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            {SCHOOL.tagline} A modern, future-ready institution committed to nurturing
            confident, curious, and compassionate young learners.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted-foreground hover:text-foreground transition">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-sm mb-3">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 shrink-0" />{SCHOOL.address}</li>
            <li className="flex items-center gap-2"><Phone className="size-4" />{SCHOOL.phone}</li>
            <li className="flex items-center gap-2"><Mail className="size-4" />{SCHOOL.email}</li>
            <li className="flex items-center gap-2"><Facebook className="size-4" /><a href={SCHOOL.facebook} target="_blank" rel="noreferrer" className="hover:text-foreground">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</span>
          <span>Crafted with care in Pakistan.</span>
        </div>
      </div>
    </footer>
  );
}
