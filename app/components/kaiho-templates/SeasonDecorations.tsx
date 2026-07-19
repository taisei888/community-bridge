import type { CSSProperties } from "react";

const abs = (top: string, left?: string, right?: string): CSSProperties => ({
  position: "absolute", top, ...(left ? { left } : {}), ...(right ? { right } : {}), pointerEvents: "none",
});

export function SpringDecoration() {
  return (
    <>
      {/* Cherry blossoms */}
      <svg style={abs("8px", "8px")} width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.4">
        <circle cx="20" cy="12" r="5" fill="#F9A8D4" />
        <circle cx="14" cy="18" r="5" fill="#F9A8D4" />
        <circle cx="26" cy="18" r="5" fill="#F9A8D4" />
        <circle cx="16" cy="25" r="5" fill="#F9A8D4" />
        <circle cx="24" cy="25" r="5" fill="#F9A8D4" />
        <circle cx="20" cy="19" r="3" fill="#FBBF24" />
      </svg>
      <svg style={abs("12px", undefined, "12px")} width="30" height="30" viewBox="0 0 30 30" fill="none" opacity="0.3">
        <circle cx="15" cy="9" r="4" fill="#FBCFE8" />
        <circle cx="10" cy="14" r="4" fill="#FBCFE8" />
        <circle cx="20" cy="14" r="4" fill="#FBCFE8" />
        <circle cx="12" cy="20" r="4" fill="#FBCFE8" />
        <circle cx="18" cy="20" r="4" fill="#FBCFE8" />
        <circle cx="15" cy="15" r="2.5" fill="#FDE68A" />
      </svg>
      {/* Petals falling */}
      <svg style={abs("60%", undefined, "20px")} width="20" height="20" viewBox="0 0 20 20" fill="none" opacity="0.25">
        <ellipse cx="10" cy="10" rx="4" ry="6" fill="#F9A8D4" transform="rotate(30 10 10)" />
      </svg>
      <svg style={abs("75%", "15px")} width="16" height="16" viewBox="0 0 16 16" fill="none" opacity="0.2">
        <ellipse cx="8" cy="8" rx="3" ry="5" fill="#FBCFE8" transform="rotate(-20 8 8)" />
      </svg>
    </>
  );
}

export function SummerDecoration() {
  return (
    <>
      {/* Sunflower */}
      <svg style={abs("8px", "8px")} width="36" height="36" viewBox="0 0 36 36" fill="none" opacity="0.4">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <ellipse key={r} cx="18" cy="18" rx="3" ry="8" fill="#FBBF24" transform={`rotate(${r} 18 18)`} />
        ))}
        <circle cx="18" cy="18" r="5" fill="#92400E" />
      </svg>
      {/* Wave */}
      <svg style={abs("auto", "0")} width="100%" height="30" viewBox="0 0 400 30" fill="none" opacity="0.15" preserveAspectRatio="none">
        <path d="M0 20 Q50 5 100 20 Q150 35 200 20 Q250 5 300 20 Q350 35 400 20 V30 H0Z" fill="#38BDF8" />
      </svg>
      {/* Hibiscus */}
      <svg style={abs("10px", undefined, "10px")} width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.35">
        <circle cx="16" cy="10" r="5" fill="#FB923C" />
        <circle cx="10" cy="16" r="5" fill="#FB923C" />
        <circle cx="22" cy="16" r="5" fill="#FB923C" />
        <circle cx="12" cy="22" r="5" fill="#FB923C" />
        <circle cx="20" cy="22" r="5" fill="#FB923C" />
        <circle cx="16" cy="16" r="3" fill="#FDE68A" />
      </svg>
    </>
  );
}

export function AutumnDecoration() {
  return (
    <>
      {/* Maple leaves */}
      <svg style={abs("8px", "8px")} width="35" height="35" viewBox="0 0 35 35" fill="none" opacity="0.4">
        <path d="M17 5 L20 12 L27 10 L22 16 L28 20 L21 20 L23 28 L17 23 L11 28 L13 20 L6 20 L12 16 L7 10 L14 12Z" fill="#EF4444" />
        <line x1="17" y1="23" x2="17" y2="32" stroke="#92400E" strokeWidth="1.5" />
      </svg>
      <svg style={abs("12px", undefined, "10px")} width="28" height="28" viewBox="0 0 28 28" fill="none" opacity="0.35">
        <path d="M14 4 L16 9 L22 8 L18 12 L23 16 L17 15 L18 22 L14 18 L10 22 L11 15 L5 16 L10 12 L6 8 L12 9Z" fill="#F97316" />
        <line x1="14" y1="18" x2="14" y2="26" stroke="#92400E" strokeWidth="1.2" />
      </svg>
      {/* Ginkgo */}
      <svg style={abs("70%", undefined, "15px")} width="22" height="22" viewBox="0 0 22 22" fill="none" opacity="0.25">
        <path d="M11 2 Q3 10 11 18 Q19 10 11 2Z" fill="#FBBF24" />
        <line x1="11" y1="14" x2="11" y2="22" stroke="#92400E" strokeWidth="1" />
      </svg>
    </>
  );
}

export function WinterDecoration() {
  return (
    <>
      {/* Snowflakes */}
      <svg style={abs("8px", "8px")} width="30" height="30" viewBox="0 0 30 30" fill="none" opacity="0.3">
        <line x1="15" y1="3" x2="15" y2="27" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="3" y1="15" x2="27" y2="15" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="6" y1="6" x2="24" y2="24" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="24" y1="6" x2="6" y2="24" stroke="#93C5FD" strokeWidth="1.5" />
        <circle cx="15" cy="15" r="2" fill="#BFDBFE" />
      </svg>
      <svg style={abs("15px", undefined, "12px")} width="22" height="22" viewBox="0 0 22 22" fill="none" opacity="0.25">
        <line x1="11" y1="2" x2="11" y2="20" stroke="#93C5FD" strokeWidth="1.2" />
        <line x1="2" y1="11" x2="20" y2="11" stroke="#93C5FD" strokeWidth="1.2" />
        <line x1="5" y1="5" x2="17" y2="17" stroke="#93C5FD" strokeWidth="1.2" />
        <line x1="17" y1="5" x2="5" y2="17" stroke="#93C5FD" strokeWidth="1.2" />
      </svg>
      {/* Small snowflakes scattered */}
      <svg style={abs("50%", "10px")} width="12" height="12" viewBox="0 0 12 12" fill="none" opacity="0.2">
        <circle cx="6" cy="6" r="3" fill="#DBEAFE" />
      </svg>
      <svg style={abs("65%", undefined, "20px")} width="10" height="10" viewBox="0 0 10 10" fill="none" opacity="0.15">
        <circle cx="5" cy="5" r="2.5" fill="#BFDBFE" />
      </svg>
    </>
  );
}

export function SeasonDecoration({ season }: { season?: string }) {
  switch (season) {
    case "spring": return <SpringDecoration />;
    case "summer": return <SummerDecoration />;
    case "autumn": return <AutumnDecoration />;
    case "winter": return <WinterDecoration />;
    default: return <SpringDecoration />;
  }
}
