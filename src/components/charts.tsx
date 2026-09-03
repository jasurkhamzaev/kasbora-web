import React, { useEffect, useState } from "react";

/** Passport uchun haqiqiy URL — skanerlanganda aynan shu passport ochiladi */
export function passportUrl(username: string): string {
  const base = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}`
    : "https://kasbora.uz/";
  return `${base}#/p/${username}`;
}

/** Haqiqiy skanerlanadigan QR kod (qrcode kutubxonasi) */
export function QrReal({ value, size = 92, label }: { value: string; size?: number; label?: string }) {
  const [data, setData] = useState("");
  useEffect(() => {
    let on = true;
    import("qrcode")
      .then(QR => QR.toDataURL(value, { width: Math.max(200, size * 3), margin: 1, errorCorrectionLevel: "M", color: { dark: "#14201A", light: "#FFFFFF" } }))
      .then(u => { if (on) setData(u); })
      .catch(() => {});
    return () => { on = false; };
  }, [value, size]);
  if (!data) return <div className="rounded-md border-[1.5px] border-ink bg-white shrink-0 animate-pulse" style={{ width: size, height: size }} />;
  return (
    <img src={data} width={size} height={size} alt={label || "QR kod"} title={label || value}
      className="rounded-md border-[1.5px] border-ink bg-white shrink-0" style={{ imageRendering: "pixelated" }} />
  );
}

/** Deterministik pseudo-QR (dekorativ, skanerlanadigan ko'rinishda) */
export function QrBox({ seed, size = 92 }: { seed: string; size?: number }) {
  const N = 21;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
  const cells: boolean[] = [];
  for (let i = 0; i < N * N; i++) cells.push(rand() > 0.52);
  const finder = (cx: number, cy: number) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const on = x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4);
      cells[(cy + y) * N + (cx + x)] = on;
    }
  };
  finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
  const c = size / N;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="rounded-md border-[1.5px] border-ink bg-white shrink-0">
      {cells.map((on, i) => on ? <rect key={i} x={(i % N) * c} y={Math.floor(i / N) * c} width={c + 0.4} height={c + 0.4} fill="#14201A" /> : null)}
    </svg>
  );
}

export function Donut({ value, size = 148, stroke = 13, color = "#0B5D43", label, sub }: {
  value: number; size?: number; stroke?: number; color?: string; label?: React.ReactNode; sub?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - Math.min(100, value) / 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label ?? <span className="font-display font-extrabold text-3xl">{value}</span>}
        {sub && <span className="font-mono text-[12px] uppercase tracking-widest text-ink-soft mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}

export function BarChart({ items, unit = "" }: { items: { label: string; value: number; color?: string }[]; unit?: string }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.label}>
          <div className="flex justify-between text-[12.5px] mb-1">
            <span className="font-semibold">{it.label}</span>
            <span className="font-mono font-bold">{it.value}{unit}</span>
          </div>
          <div className="h-[10px] rounded-full bg-line/50 border border-line overflow-hidden">
            <div className="h-full rounded-full bar-anim" style={{ width: (it.value / max) * 100 + "%", background: it.color || "var(--color-pine)", animationDelay: i * 90 + "ms" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(...steps.map(s => s.value), 1);
  const colors = ["#0B5D43", "#2A7F9E", "#F2A81D", "#F0532D", "#7C3AED", "#4C5B2A"];
  return (
    <div className="flex items-end gap-2 h-36">
      {steps.map((s, i) => (
        <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
          <span className="font-mono text-[12px] font-bold">{s.value}</span>
          <div className="w-full rounded-t-md border-x-[1.5px] border-t-[1.5px] border-ink bar-anim"
            style={{ height: Math.max(8, (s.value / max) * 100) + "%", background: colors[i % colors.length], animationDelay: i * 100 + "ms" }} />
          <span className="text-[12px] font-mono uppercase tracking-wide text-ink-soft text-center leading-tight">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
