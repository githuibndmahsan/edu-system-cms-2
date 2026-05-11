import { useRef, useState, type ReactNode } from "react";
import { Upload, Loader2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropZoneProps = {
  accept: string; // e.g. "image/*" or "application/pdf"
  maxSizeMB: number;
  onFile: (file: File) => Promise<void> | void;
  preview?: ReactNode; // e.g. an <img> thumbnail
  hint?: string;
  filename?: string | null;
  onClear?: () => void;
  compact?: boolean;
};

export function DropZone({ accept, maxSizeMB, onFile, preview, hint, filename, onClear, compact }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const matchesAccept = (file: File) => {
    if (!accept || accept === "*") return true;
    return accept.split(",").map((s) => s.trim()).some((a) => {
      if (a.endsWith("/*")) return file.type.startsWith(a.slice(0, -1));
      if (a.startsWith(".")) return file.name.toLowerCase().endsWith(a.toLowerCase());
      return file.type === a;
    });
  };

  const handle = async (file?: File | null) => {
    if (!file) return;
    setErr(null);
    if (!matchesAccept(file)) { setErr("Unsupported file type"); return; }
    if (file.size > maxSizeMB * 1024 * 1024) { setErr(`Max ${maxSizeMB}MB`); return; }
    try {
      setBusy(true);
      await onFile(file);
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
        className={cn(
          "relative w-full rounded-2xl border-2 border-dashed bg-surface-elevated transition-all cursor-pointer outline-none",
          "hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring",
          drag ? "border-primary bg-primary/5 scale-[1.01]" : "border-border",
          compact ? "p-3" : "p-5",
        )}
      >
        <input ref={inputRef} type="file" accept={accept} hidden
          onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }} />
        <div className={cn("flex items-center gap-4", compact && "gap-3")}>
          {preview ? (
            <div className="shrink-0">{preview}</div>
          ) : (
            <div className={cn("shrink-0 grid place-items-center rounded-xl bg-secondary text-muted-foreground", compact ? "size-10" : "size-14")}>
              {busy ? <Loader2 className="size-5 animate-spin" /> : filename ? <CheckCircle2 className="size-5 text-[--color-success]" /> : <Upload className="size-5" />}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">
              {busy ? "Uploading…" : drag ? "Drop file to upload" : filename ? "Replace file" : "Drag & drop or click to upload"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {filename ? filename : hint || `Up to ${maxSizeMB}MB`}
            </div>
          </div>
          {filename && onClear && !busy && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="shrink-0 grid place-items-center size-8 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              aria-label="Remove file"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
