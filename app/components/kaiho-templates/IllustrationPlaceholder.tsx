import type { CSSProperties } from "react";

const c = (v: string) => `var(${v})`;

/** 活動キーワードからイラストタイプを推定 */
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
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="35" r="18" fill={c("--c-main")} opacity="0.15" />
      <circle cx="40" cy="35" r="10" fill={c("--c-main")} opacity="0.25" />
      <path d="M30 55 Q40 48 50 55" stroke={c("--c-sub")} strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="25" cy="28" r="4" fill={c("--c-sub")} opacity="0.2" />
      <circle cx="55" cy="28" r="3" fill={c("--c-accent")} opacity="0.2" />
      <path d="M35 60 L45 60" stroke={c("--c-main")} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

function ExerciseSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="18" r="8" fill={c("--c-main")} opacity="0.2" />
      <path d="M40 26 L40 50" stroke={c("--c-main")} strokeWidth="2.5" opacity="0.25" />
      <path d="M28 35 L40 30 L52 35" stroke={c("--c-sub")} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.25" />
      <path d="M35 50 L30 65" stroke={c("--c-main")} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
      <path d="M45 50 L50 65" stroke={c("--c-main")} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
      <circle cx="20" cy="60" r="6" fill={c("--c-accent")} opacity="0.1" />
      <circle cx="60" cy="55" r="8" fill={c("--c-sub")} opacity="0.1" />
    </svg>
  );
}

function MusicSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="30" cy="52" r="8" fill={c("--c-main")} opacity="0.2" />
      <circle cx="54" cy="46" r="8" fill={c("--c-sub")} opacity="0.2" />
      <path d="M38 52 L38 20 L62 14 L62 46" stroke={c("--c-main")} strokeWidth="2" opacity="0.25" />
      <path d="M38 20 L62 14" stroke={c("--c-accent")} strokeWidth="2" opacity="0.2" />
      <circle cx="20" cy="30" r="3" fill={c("--c-accent")} opacity="0.15" />
      <circle cx="65" cy="60" r="4" fill={c("--c-accent")} opacity="0.12" />
    </svg>
  );
}

function FoodSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="50" rx="24" ry="10" fill={c("--c-sub")} opacity="0.15" />
      <path d="M20 45 Q40 30 60 45" fill={c("--c-main")} opacity="0.12" />
      <circle cx="32" cy="38" r="5" fill={c("--c-accent")} opacity="0.2" />
      <circle cx="48" cy="36" r="4" fill={c("--c-main")} opacity="0.18" />
      <circle cx="40" cy="42" r="3" fill={c("--c-sub")} opacity="0.2" />
      <path d="M40 18 Q42 25 40 28" stroke={c("--c-main")} strokeWidth="1.5" opacity="0.15" />
      <path d="M36 20 Q38 26 36 30" stroke={c("--c-main")} strokeWidth="1.5" opacity="0.12" />
      <path d="M44 19 Q46 24 44 29" stroke={c("--c-main")} strokeWidth="1.5" opacity="0.12" />
    </svg>
  );
}

function GardenSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M40 65 L40 35" stroke={c("--c-main")} strokeWidth="2" opacity="0.25" />
      <circle cx="40" cy="28" r="10" fill={c("--c-main")} opacity="0.15" />
      <circle cx="33" cy="32" r="7" fill={c("--c-accent")} opacity="0.15" />
      <circle cx="47" cy="32" r="7" fill={c("--c-sub")} opacity="0.15" />
      <circle cx="40" cy="25" r="4" fill={c("--c-sub")} opacity="0.2" />
      <path d="M25 65 Q40 60 55 65" stroke={c("--c-main")} strokeWidth="1.5" fill={c("--c-main")} fillOpacity="0.08" />
      <circle cx="22" cy="50" r="3" fill={c("--c-accent")} opacity="0.12" />
      <circle cx="58" cy="45" r="4" fill={c("--c-main")} opacity="0.1" />
    </svg>
  );
}

function TravelSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="25" y="30" width="30" height="22" rx="4" fill={c("--c-main")} opacity="0.15" />
      <rect x="30" y="25" width="20" height="8" rx="3" fill={c("--c-sub")} opacity="0.15" />
      <circle cx="35" cy="41" r="3" fill={c("--c-accent")} opacity="0.2" />
      <circle cx="45" cy="41" r="3" fill={c("--c-accent")} opacity="0.2" />
      <path d="M18 58 Q40 52 62 58" stroke={c("--c-main")} strokeWidth="1.5" opacity="0.15" />
      <circle cx="15" cy="35" r="5" fill={c("--c-sub")} opacity="0.08" />
      <circle cx="65" cy="30" r="6" fill={c("--c-accent")} opacity="0.08" />
    </svg>
  );
}

function FestivalSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M30 25 L40 15 L50 25 Z" fill={c("--c-accent")} opacity="0.2" />
      <rect x="35" y="25" width="10" height="35" rx="2" fill={c("--c-main")} opacity="0.15" />
      <circle cx="25" cy="45" r="6" fill={c("--c-sub")} opacity="0.12" />
      <circle cx="55" cy="40" r="5" fill={c("--c-accent")} opacity="0.12" />
      <circle cx="20" cy="30" r="3" fill={c("--c-main")} opacity="0.1" />
      <circle cx="60" cy="55" r="4" fill={c("--c-sub")} opacity="0.1" />
      <path d="M25 65 Q40 58 55 65" stroke={c("--c-sub")} strokeWidth="1.5" opacity="0.15" />
    </svg>
  );
}

function CommunitySVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="28" cy="30" r="8" fill={c("--c-main")} opacity="0.15" />
      <circle cx="52" cy="30" r="8" fill={c("--c-sub")} opacity="0.15" />
      <circle cx="40" cy="25" r="8" fill={c("--c-accent")} opacity="0.12" />
      <path d="M15 55 Q28 42 40 55 Q52 42 65 55" fill={c("--c-main")} opacity="0.08" />
      <circle cx="28" cy="28" r="3" fill={c("--c-main")} opacity="0.25" />
      <circle cx="52" cy="28" r="3" fill={c("--c-sub")} opacity="0.25" />
      <circle cx="40" cy="23" r="3" fill={c("--c-accent")} opacity="0.2" />
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
      background: `linear-gradient(135deg, color-mix(in srgb, ${c("--c-main")} 8%, white), color-mix(in srgb, ${c("--c-sub")} 6%, white))`,
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
