import React, { useEffect, useRef, useState } from "react";

/* ---------------- icons ---------------- */
export const I: Record<string, React.ReactNode> = {
  home: <><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h5v-6h4v6h5V9.5" /></>,
  shield: <><path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  tasks: <><rect x="4" y="4" width="16" height="17" rx="2.5" /><path d="M8 4V2.8M16 4V2.8M8 10l1.8 1.8L13 8.5M8 15.5h8" /></>,
  brief: <><rect x="3" y="7.5" width="18" height="13" rx="2.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 13h18" /></>,
  doc: <><path d="M6 2.8h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  cal: <><rect x="3.5" y="5" width="17" height="16" rx="2.5" /><path d="M8 5V3M16 5V3M3.5 10h17M8 14.5h2M14 14.5h2M8 17.5h2" /></>,
  star: <path d="M12 3l2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9 6.4 19.8l1.2-6.1L3 9.4l6.3-.8z" />,
  passport: <><rect x="3" y="5" width="18" height="15" rx="2.5" /><circle cx="8.5" cy="11.5" r="2.2" /><path d="M13.5 9.5H20M13.5 13H20M6 17h14" /></>,
  users: <><circle cx="9" cy="8" r="3.4" /><path d="M2.8 20c.6-3.4 3-5.4 6.2-5.4s5.6 2 6.2 5.4" /><circle cx="16.8" cy="9" r="2.6" /><path d="M15.6 14.9c2.9.2 4.9 2 5.5 4.9" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  bolt: <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z" />,
  chart: <><path d="M4 21V4" /><path d="M4 21h17" /><path d="M8.5 17v-6M13.5 17V7.5M18.5 17v-4" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M6 6l2.2 2.2M15.8 15.8L18 18M18 6l-2.2 2.2M8.2 15.8L6 18" /></>,
  bell: <><path d="M6 16v-6a6 6 0 1 1 12 0v6l1.5 2.5h-15z" /><path d="M10 21.5a2.2 2.2 0 0 0 4 0" /></>,
  out: <><path d="M9 21H5.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2H9" /><path d="M15 16.5L19.5 12 15 7.5M19.5 12H9.5" /></>,
  check: <path d="M4.5 12.5l5 5L19.5 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  clip: <><rect x="8.5" y="8.5" width="12" height="12" rx="2" /><path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h1" /></>,
  link: <><path d="M10 14a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1" /><path d="M14 10a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.1" /></>,
  qr: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><path d="M13 13h3v3h-3zM17.5 17.5H20V20h-2.5z" /></>,
  api: <><path d="M8 6l-5 6 5 6M16 6l5 6-5 6" /><path d="M13.5 4l-3 16" /></>,
  tg: <path d="M21 4L3 11l6 2.5L11.5 20l3-4.5L20 18z" />,
  wallet: <><rect x="3" y="6" width="18" height="14" rx="2.5" /><path d="M3 9.5h18M16 15h2" /></>,
  build: <><rect x="4" y="3.5" width="12" height="17" rx="1.5" /><path d="M16 9.5h4V21h-4M7.5 7.5h2M7.5 11h2M7.5 14.5h2M12 7.5h1.5M12 11h1.5M12 14.5h1.5M8.5 20.5v-3h3v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7.5L12 13.5l8.5-6" /></>,
  csv: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9.5h18M3 14.5h18M9 4v16M15 4v16" /></>,
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
};

export function Icon({ d, size = 16, className = "" }: { d: React.ReactNode; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      {d}
    </svg>
  );
}

/* ---------------- buttons ---------------- */
export function Btn({ variant = "solid", small, className = "", children, ...rest }: {
  variant?: "lime" | "solid" | "outline" | "ghost" | "coral"; small?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    lime: "bg-lime text-pine-ink border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-ink)]",
    solid: "bg-pine text-cream border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-ink)]",
    outline: "bg-paper text-ink border-ink hover:bg-lime-soft",
    ghost: "bg-transparent text-ink-soft border-transparent hover:bg-cream hover:text-ink",
    coral: "bg-coral text-docink border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-ink)]",
  }[variant];
  return (
    <button className={`inline-flex items-center justify-center gap-1.5 font-display font-bold rounded-[10px] border-[1.5px] btn-press transition-all disabled:opacity-45 disabled:pointer-events-none ${small ? "text-[12.5px] px-3.5 py-2" : "text-[13.5px] px-5 py-2.5"} ${v} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* ---------------- pills ---------------- */
const PILL_TONES: Record<string, string> = {
  ink: "bg-ink text-cream border-ink",
  pine: "bg-lime-soft text-pine-deep border-pine/40",
  moss: "bg-lime-soft text-moss border-moss/40",
  sky: "bg-sky-soft text-sky border-sky/40",
  amber: "bg-amber-soft text-amber border-amber/50",
  coral: "bg-coral-soft text-coral border-coral/40",
  violet: "bg-violet/10 text-violet border-violet/40",
  lime: "bg-lime text-pine-ink border-ink",
};
export function Pill({ tone = "ink", className = "", children }: { tone?: string; className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border-[1.5px] font-mono text-[12px] font-bold tracking-wide whitespace-nowrap ${PILL_TONES[tone] || PILL_TONES.ink} ${className}`}>
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, string> = {
  APPLIED: "sky", SHORTLISTED: "amber", REJECTED: "coral", ACCEPTED: "pine", IN_PROGRESS: "sky", COMPLETED: "pine",
  SUBMITTED: "sky", UNDER_REVIEW: "amber", PASSED: "pine", FAILED: "coral",
  INVITED: "amber", CONFIRMED: "pine", DECLINED: "coral",
  ASSIGNED: "sky", OFFERED: "amber", HIRED: "pine",
  PENDING: "amber", REVEALED: "violet",
  DRAFT: "amber", PUBLISHED: "pine", APPLICATIONS_OPEN: "lime", CLOSED: "ink",
};
export function StatusPill({ s }: { s: string }) {
  return <Pill tone={STATUS_TONE[s] || "ink"}>{s}</Pill>;
}

/* ---------------- stamp ---------------- */
export function Stamp({ tone = "coral", className = "", children }: { tone?: "coral" | "pine"; className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-block font-mono text-[12px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-[4px] border-[1.5px] -rotate-2 bg-paper ${tone === "coral" ? "text-coral border-coral" : "text-pine border-pine"} ${className}`}>
      {children}
    </span>
  );
}

/* ---------------- modal ---------------- */
export function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`anim-pop relative card w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[92vh] overflow-y-auto rounded-b-none sm:rounded-b-[12px] shadow-[8px_8px_0_0_rgba(20,32,26,0.85)]`}>
        <div className="sticky top-0 z-[1] bg-paper border-b-[1.5px] border-ink px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="font-display font-bold text-[14.5px] leading-snug">{title}</div>
          <button onClick={onClose} aria-label="Yopish" className="w-8 h-8 rounded-lg border-[1.5px] border-ink bg-cream hover:bg-coral-soft hover:text-coral flex items-center justify-center btn-press shrink-0">
            <Icon d={I.x} size={14} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- field ---------------- */
export function Field({ label, hint, children }: { label: React.ReactNode; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="lbl block mb-1.5">{label}</span>
      {children}
      {hint && <span className="block mt-1 text-[12px] text-ink-soft">{hint}</span>}
    </label>
  );
}

/* ---------------- bar ---------------- */
export function Bar({ value, max = 100, h = 8, color }: { value: number; max?: number; h?: number; color?: string }) {
  return (
    <div className="rounded-full bg-line/60 border border-line overflow-hidden w-full" style={{ height: h }}>
      <div className="h-full rounded-full bar-anim" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color || "var(--color-pine)" }} />
    </div>
  );
}

/* ---------------- empty ---------------- */
export function Empty({ title, body, children }: { title: React.ReactNode; body?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="card-soft border-dashed !border-ink/30 p-8 text-center">
      <div className="font-display font-bold text-[15px] mb-1.5">{title}</div>
      {body && <p className="text-[13px] text-ink-soft max-w-sm mx-auto mb-4">{body}</p>}
      {children && <div className="flex justify-center">{children}</div>}
    </div>
  );
}

/* ---------------- avatar ---------------- */
export function Avatar({ name, color, size = 38 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className="rounded-full flex items-center justify-center font-display font-bold shrink-0 border-[1.5px] border-ink/25"
      style={{ width: size, height: size, background: color || "#0B5D43", color: "#F6F1E4", fontSize: size * 0.36 }}>
      {initials}
    </span>
  );
}

/* ---------------- scroll reveal ---------------- */
export function Reveal({ children, delay = 0, dir = "up", className = "" }: {
  children: React.ReactNode; delay?: number; dir?: "up" | "left"; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) { setInView(true); return; }
    // Failsafe: observer ishlamasa ham matn ko'rinsin
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const fail = window.setTimeout(() => setInView(true), 1100);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); window.clearTimeout(fail); obs.disconnect(); }
    }, { threshold: 0.05, rootMargin: "0px 0px 120px 0px" });
    obs.observe(el);
    return () => { window.clearTimeout(fail); obs.disconnect(); };
  }, []);
  return (
    <div ref={ref} className={`${dir === "left" ? "rev-l" : "rev"} ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------- count up ---------------- */
export function CountUp({ to, dec }: { to: number; dec?: boolean }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const run = () => {
      const start = performance.now();
      const dur = 900;
      const tick = (nowT: number) => {
        const p = Math.min(1, (nowT - start) / dur);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!el) { run(); return; }
    // Failsafe: observer ishlamasa ham sonlar ko'rinsin
    if (!("IntersectionObserver" in window)) { run(); return; }
    const fail = window.setTimeout(run, 1100);
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      window.clearTimeout(fail);
      obs.disconnect();
      run();
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => { window.clearTimeout(fail); obs.disconnect(); };
  }, [to]);
  return <span ref={ref}>{dec ? v.toFixed(1) : Math.round(v).toLocaleString("ru-RU")}</span>;
}
