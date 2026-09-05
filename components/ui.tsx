import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({ children, variant = "primary", className, ...rest }: {
  children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: "bg-midnight text-champagne hover:bg-obsidian border border-imperial/60 shadow-royal dark:bg-imperial dark:text-obsidian dark:hover:bg-imperial-light",
    secondary: "bg-transparent border border-[var(--border)] hover:border-imperial text-[var(--fg)]",
    ghost: "bg-transparent border-transparent underline underline-offset-4 hover:text-[var(--gold-contrast)]",
    danger: "bg-transparent border border-error text-error hover:bg-error hover:text-white",
  }[variant];
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors", styles, className)} {...rest}>{children}</button>;
}

export function Card({ children, className, ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("royal-card p-6", className)} {...rest}>{children}</div>;
}

export function SectionHeading({ kicker, title, desc }: { kicker?: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {kicker && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-contrast)]">{kicker}</p>}
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      <div className="royal-divider mx-auto my-4 w-24" aria-hidden="true" />
      {desc && <p className="text-[var(--muted)]">{desc}</p>}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label && <p className="mb-1 text-sm text-[var(--muted)]">{label}</p>}
      <div className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "Progress"}>
        <div className="h-full rounded-full bg-gradient-to-r from-imperial-dark via-imperial to-imperial-light transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <div className="royal-card p-8 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[var(--muted)]">{desc}</p>
      {action && <div className="mt-4 flex justify-center gap-3">{action}</div>}
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div role="note" className={cn("rounded-2xl border p-4 text-sm",
      tone === "warn" ? "border-warning/50 bg-warning/10" : "border-[var(--border)] bg-black/[0.03] dark:bg-white/[0.04]")}>
      {children}
    </div>
  );
}
