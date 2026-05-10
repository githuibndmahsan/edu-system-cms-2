import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle, Facebook } from "lucide-react";
import { SCHOOL } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bloom Public School" },
      { name: "description", content: "Get in touch with Bloom Public School. Visit, call, WhatsApp or email us." },
      { property: "og:title", content: "Contact Bloom Public School" },
      { property: "og:description", content: "Phone, email, WhatsApp and address." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const items = [
    { icon: Phone, label: "Call", value: SCHOOL.phone, href: `tel:${SCHOOL.phone}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Message us instantly", href: `https://wa.me/${SCHOOL.whatsapp}` },
    { icon: Mail, label: "Email", value: SCHOOL.email, href: `mailto:${SCHOOL.email}` },
    { icon: Facebook, label: "Facebook", value: "Follow our updates", href: SCHOOL.facebook },
  ];
  return (
    <section className="container-page py-14">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">Contact</div>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
        We’d love to hear from you.
      </h1>
      <p className="mt-5 text-muted-foreground max-w-2xl">
        Reach us through any channel below. For admissions queries, please mention your child’s class.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="rounded-3xl border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] transition-all"
          >
            <div className="grid place-items-center size-11 rounded-2xl bg-secondary"><Icon className="size-5" /></div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-1 font-medium">{value}</div>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-border overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 bg-card">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center size-11 rounded-2xl bg-secondary"><MapPin className="size-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Visit us</div>
                <div className="mt-1 font-medium">{SCHOOL.address}</div>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  Walk-ins welcome on weekdays between 9:00 AM and 1:00 PM.
                  Please call ahead to schedule a campus tour.
                </p>
              </div>
            </div>
          </div>
          <iframe
            title="School location"
            src="https://www.google.com/maps?q=Lahore,Pakistan&output=embed"
            className="w-full min-h-[320px] border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
