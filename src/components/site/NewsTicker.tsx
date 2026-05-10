import { Megaphone } from "lucide-react";
import { NEWS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function NewsTicker() {
  const items = [...NEWS, ...NEWS];
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface-elevated">
      <div className="container-page flex items-stretch gap-4 py-2.5">
        <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-border shrink-0">
          <span className="grid place-items-center size-7 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Megaphone className="size-3.5" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-10 whitespace-nowrap [animation:var(--animate-marquee)] hover:[animation-play-state:paused]">
            {items.map((n, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    n.level === "urgent" && "bg-destructive",
                    n.level === "important" && "bg-[--color-warning]",
                    n.level === "normal" && "bg-[--color-cyan-accent]"
                  )}
                />
                <span className={cn(n.level === "urgent" && "text-destructive font-medium")}>{n.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
