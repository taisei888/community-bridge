import type { CSSProperties } from "react";

const c = (v: string) => `var(${v})`;

function guessType(hint?: string): string {
  if (!hint) return "community";
  const h = hint.toLowerCase();
  if (/ゴルフ|ゲートボール|スポーツ|ボール/.test(h)) return "sports";
  if (/体操|ストレッチ|運動|ウォーキング|散歩|健康/.test(h)) return "exercise";
  if (/歌|カラオケ|音楽|合唱/.test(h)) return "music";
  if (/料理|食事|茶|お菓子/.test(h)) return "food";
  if (/花|園芸|ガーデニング|畑/.test(h)) return "garden";
  if (/旅行|遠足|バス|外出/.test(h)) return "travel";
  if (/祭|まつり|盆踊り|イベント/.test(h)) return "festival";
  if (/交流|集まり|おしゃべり|サロン/.test(h)) return "community";
  return "community";
}

function SportsSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <circle cx="45" cy="35" r="20" fill={c("--c-main")} opacity="0.3" />
      <circle cx="45" cy="35" r="12" fill={c("--c-main")} opacity="0.45" />
      <path d="M32 58 Q45 50 58 58" stroke={c("--c-sub")} strokeWidth="3" fill="none" opacity="0.5" />
      <circle cx="28" cy="26" r="5" fill={c("--c-sub")} opacity="0.35" />
      <circle cx="62" cy="26" r="4" fill={c("--c-accent")} opacity="0.35" />
      <path d="M38 65 L52 65" stroke={c("--c-main")} strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function ExerciseSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <circle cx="45" cy="18" r="10" fill={c("--c-main")} opacity="0.4" />
      <path d="M45 28 L45 55" stroke={c("--c-main")} strokeWidth="3" opacity="0.45" />
      <path d="M30 38 L45 32 L60 38" stroke={c("--c-sub")} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M40 55 L34 72" stroke={c("--c-main")} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <path d="M50 55 L56 72" stroke={c("--c-main")} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <circle cx="22" cy="65" r="7" fill={c("--c-accent")} opacity="0.2" />
      <circle cx="68" cy="60" r="9" fill={c("--c-sub")} opacity="0.2" />
    </svg>
  );
}

function MusicSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <circle cx="32" cy="58" r="10" fill={c("--c-main")} opacity="0.4" />
      <circle cx="60" cy="52" r="10" fill={c("--c-sub")} opacity="0.4" />
      <path d="M42 58 L42 22 L70 15 L70 52" stroke={c("--c-main")} strokeWidth="2.5" opacity="0.45" />
      <path d="M42 22 L70 15" stroke={c("--c-accent")} strokeWidth="2.5" opacity="0.4" />
      <circle cx="22" cy="32" r="4" fill={c("--c-accent")} opacity="0.3" />
      <circle cx="75" cy="68" r="5" fill={c("--c-accent")} opacity="0.25" />
    </svg>
  );
}

function FoodSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <ellipse cx="45" cy="55" rx="28" ry="12" fill={c("--c-sub")} opacity="0.3" />
      <path d="M22 50 Q45 32 68 50" fill={c("--c-main")} opacity="0.25" />
      <circle cx="35" cy="42" r="6" fill={c("--c-accent")} opacity="0.4" />
      <circle cx="55" cy="40" r="5" fill={c("--c-main")} opacity="0.35" />
      <circle cx="45" cy="46" r="4" fill={c("--c-sub")} opacity="0.4" />
      <path d="M45 18 Q47 28 45 32" stroke={c("--c-main")} strokeWidth="2" opacity="0.3" />
      <path d="M40 20 Q42 28 40 34" stroke={c("--c-main")} strokeWidth="2" opacity="0.25" />
      <path d="M50 19 Q52 27 50 33" stroke={c("--c-main")} strokeWidth="2" opacity="0.25" />
    </svg>
  );
}

function GardenSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <path d="M45 72 L45 38" stroke={c("--c-main")} strokeWidth="3" opacity="0.4" />
      <circle cx="45" cy="28" r="14" fill={c("--c-main")} opacity="0.3" />
      <circle cx="36" cy="34" r="10" fill={c("--c-accent")} opacity="0.3" />
      <circle cx="54" cy="34" r="10" fill={c("--c-sub")} opacity="0.3" />
      <circle cx="45" cy="24" r="6" fill={c("--c-sub")} opacity="0.4" />
      <path d="M25 72 Q45 66 65 72" stroke={c("--c-main")} strokeWidth="2" fill={c("--c-main")} fillOpacity="0.15" />
      <circle cx="22" cy="55" r="4" fill={c("--c-accent")} opacity="0.25" />
      <circle cx="68" cy="48" r="5" fill={c("--c-main")} opacity="0.2" />
    </svg>
  );
}

function TravelSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <rect x="28" y="32" width="34" height="25" rx="5" fill={c("--c-main")} opacity="0.3" />
      <rect x="34" y="26" width="22" height="9" rx="4" fill={c("--c-sub")} opacity="0.3" />
      <circle cx="38" cy="45" r="4" fill={c("--c-accent")} opacity="0.4" />
      <circle cx="52" cy="45" r="4" fill={c("--c-accent")} opacity="0.4" />
      <path d="M18 65 Q45 58 72 65" stroke={c("--c-main")} strokeWidth="2" opacity="0.3" />
      <circle cx="16" cy="38" r="6" fill={c("--c-sub")} opacity="0.15" />
      <circle cx="74" cy="32" r="7" fill={c("--c-accent")} opacity="0.15" />
    </svg>
  );
}

function FestivalSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <path d="M32 28 L45 15 L58 28 Z" fill={c("--c-accent")} opacity="0.4" />
      <rect x="39" y="28" width="12" height="40" rx="3" fill={c("--c-main")} opacity="0.3" />
      <circle cx="28" cy="50" r="8" fill={c("--c-sub")} opacity="0.25" />
      <circle cx="62" cy="45" r="6" fill={c("--c-accent")} opacity="0.25" />
      <circle cx="22" cy="32" r="4" fill={c("--c-main")} opacity="0.2" />
      <circle cx="68" cy="62" r="5" fill={c("--c-sub")} opacity="0.2" />
      <path d="M28 72 Q45 64 62 72" stroke={c("--c-sub")} strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function CommunitySVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <circle cx="30" cy="32" r="10" fill={c("--c-main")} opacity="0.3" />
      <circle cx="60" cy="32" r="10" fill={c("--c-sub")} opacity="0.3" />
      <circle cx="45" cy="26" r="10" fill={c("--c-accent")} opacity="0.25" />
      <path d="M15 62 Q30 48 45 62 Q60 48 75 62" fill={c("--c-main")} opacity="0.15" />
      <circle cx="30" cy="30" r="4" fill={c("--c-main")} opacity="0.5" />
      <circle cx="60" cy="30" r="4" fill={c("--c-sub")} opacity="0.5" />
      <circle cx="45" cy="24" r="4" fill={c("--c-accent")} opacity="0.4" />
    </svg>
  );
}

function getIllustration(type: string) {
  switch (type) {
    case "sports": return <SportsSVG />;
    case "exercise": return <ExerciseSVG />;
    case "music": return <MusicSVG />;
    case "food": return <FoodSVG />;
    case "garden": return <GardenSVG />;
    case "travel": return <TravelSVG />;
    case "festival": return <FestivalSVG />;
    default: return <CommunitySVG />;
  }
}

type Props = {
  hint?: string;
  style?: CSSProperties;
};

export function IllustrationPlaceholder({ hint, style }: Props) {
  const type = guessType(hint);
  return (
    <div style={{
      borderRadius: "10px",
      overflow: "hidden",
      background: `linear-gradient(135deg, color-mix(in srgb, ${c("--c-main")} 12%, white), color-mix(in srgb, ${c("--c-sub")} 10%, white))`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      ...style,
    }}>
      {getIllustration(type)}
    </div>
  );
}
