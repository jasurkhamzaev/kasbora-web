import React, { useId } from "react";

/** K ikonka: vertikal blue→cyan stroke, diagonal (purple leg + upward arrow), odam-nuqta */
export function KasboraMark({ size = 40 }: { size?: number }) {
  const id = useId().replace(/[:]/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="KASBORA">
      <defs>
        <linearGradient id={`v${id}`} x1="12" y1="4" x2="12" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B5FFF" /><stop offset="1" stopColor="#00D9C0" />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="54" y1="58" x2="23" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" /><stop offset="1" stopColor="#2E6BFF" />
        </linearGradient>
        <linearGradient id={`a${id}`} x1="23" y1="34" x2="49" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B5FFF" /><stop offset="1" stopColor="#00D9C0" />
        </linearGradient>
        <linearGradient id={`d${id}`} x1="31" y1="9" x2="42" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" /><stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="6" y="4" width="12.5" height="56" rx="6.25" fill={`url(#v${id})`} />
      <path d="M54 58L23 34" stroke={`url(#l${id})`} strokeWidth="11.5" strokeLinecap="round" />
      <path d="M23 34C32 28 38 25 42.5 21C46 17.8 47.6 14.8 48.2 11" stroke={`url(#a${id})`} strokeWidth="11.5" strokeLinecap="round" />
      <path d="M49.7 1.6L56.1 12.2L40.3 9.8Z" fill="#00D9C0" stroke="#00D9C0" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="36" cy="13.5" r="5.2" fill={`url(#d${id})`} />
    </svg>
  );
}

/** To'liq lockup: [ K ]  KASBORA — "O" ichida strelka */
export function KasboraLogo({ height = 34, light = false, className = "" }: { height?: number; light?: boolean; className?: string }) {
  const id = useId().replace(/[:]/g, "");
  const word = light ? "#F6F1E4" : "#0A1A33";
  return (
    <svg viewBox="0 0 324 64" height={height} width={(324 / 64) * height} className={className} role="img" aria-label="KASBORA" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`v${id}`} x1="12" y1="4" x2="12" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B5FFF" /><stop offset="1" stopColor="#00D9C0" />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="54" y1="58" x2="23" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" /><stop offset="1" stopColor="#2E6BFF" />
        </linearGradient>
        <linearGradient id={`a${id}`} x1="23" y1="34" x2="49" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0B5FFF" /><stop offset="1" stopColor="#00D9C0" />
        </linearGradient>
        <linearGradient id={`d${id}`} x1="31" y1="9" x2="42" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" /><stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="6" y="4" width="12.5" height="56" rx="6.25" fill={`url(#v${id})`} />
      <path d="M54 58L23 34" stroke={`url(#l${id})`} strokeWidth="11.5" strokeLinecap="round" />
      <path d="M23 34C32 28 38 25 42.5 21C46 17.8 47.6 14.8 48.2 11" stroke={`url(#a${id})`} strokeWidth="11.5" strokeLinecap="round" />
      <path d="M49.7 1.6L56.1 12.2L40.3 9.8Z" fill="#00D9C0" stroke="#00D9C0" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="36" cy="13.5" r="5.2" fill={`url(#d${id})`} />
      <g fill={word} fontFamily="'Archivo Black','Arial Black',sans-serif" fontWeight="900" fontSize="42" letterSpacing="3">
        <text x="80" y="47" textLength="132" lengthAdjust="spacingAndGlyphs">KASB</text>
        <circle cx="232.5" cy="31.5" r="12" fill="none" stroke={word} strokeWidth="7.8" />
        <path d="M228.4 31.2L232.5 26.2L236.6 31.2" fill="none" stroke="#0B5FFF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M232.5 30.4V35.6" stroke="#0B5FFF" strokeWidth="3.4" strokeLinecap="round" />
        <text x="253.5" y="47" textLength="68" lengthAdjust="spacingAndGlyphs">RA</text>
      </g>
    </svg>
  );
}
