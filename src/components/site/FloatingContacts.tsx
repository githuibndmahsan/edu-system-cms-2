import { MessageCircle, Phone } from "lucide-react";
import { SCHOOL } from "@/lib/site-data";

export function FloatingContacts() {
  return (
    <div className="fixed z-40 right-4 bottom-4 flex flex-col gap-3">
      <a
        href={`https://wa.me/${SCHOOL.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="grid place-items-center size-14 rounded-full text-white shadow-[var(--shadow-elevated)] transition hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
      >
        <MessageCircle className="size-6" />
      </a>
      <a
        href={`tel:${SCHOOL.phone}`}
        aria-label="Call"
        className="grid place-items-center size-14 rounded-full bg-foreground text-background shadow-[var(--shadow-elevated)] transition hover:scale-105 active:scale-95"
      >
        <Phone className="size-5" />
      </a>
    </div>
  );
}
