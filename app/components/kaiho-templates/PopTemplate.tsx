import type { CSSProperties } from "react";
import type { TemplateProps } from "./types";
import { SeasonDecoration } from "./SeasonDecorations";

const c = (v: string) => `var(${v})`;

/* ===== Shared helpers ===== */
const SectionHeader = ({ title, bg, color, icon }: { title: string; bg: string; color: string; icon?: React.ReactNode }) => (
  <div style={{
    background: bg, borderRadius: "20px", padding: "5px 16px",
    display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "8px",
  }}>
    {icon}
    <span style={{ fontSize: "14px", fontWeight: 800, color }}>{title}</span>
  </div>
);

const DateBadge = ({ date }: { date: string }) => (
  <span style={{
    background: c("--c-main"), color: "#fff",
    fontSize: "11px", fontWeight: 700, padding: "2px 10px",
    borderRadius: "10px", whiteSpace: "nowrap",
  }}>{date}</span>
);

const PhotoOrPlaceholder = ({ photo, index, style }: { photo?: string; index: number; style?: CSSProperties }) => (
  <div style={{
    borderRadius: "10px", overflow: "hidden", background: "#f0f0f0",
    display: "flex", alignItems: "center", justifyContent: "center",
    ...style,
  }}>
    {photo ? (
      <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : (
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg, color-mix(in srgb, ${c("--c-main")} 15%, white), color-mix(in srgb, ${c("--c-sub")} 15%, white))`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.4">
          <rect x="5" y="8" width="30" height="24" rx="3" stroke={c("--c-main")} strokeWidth="2" fill="none" />
          <circle cx="14" cy="17" r="3" fill={c("--c-main")} opacity="0.5" />
          <path d="M8 28 L16 20 L22 26 L28 18 L32 24 V28 H8Z" fill={c("--c-main")} opacity="0.3" />
        </svg>
      </div>
    )}
  </div>
);

/* ===== Variant 1: カード並列型 ===== */
function PopVariant1({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${c("--c-main")} 12%, white), color-mix(in srgb, ${c("--c-sub")} 10%, white))`,
        borderRadius: "16px", padding: "16px 24px", marginBottom: "14px",
        border: `2px solid color-mix(in srgb, ${c("--c-main")} 25%, white)`,
        textAlign: "center", position: "relative",
      }}>
        <div style={{ position: "absolute", top: "10px", left: "16px", background: c("--c-main"), color: "#fff", borderRadius: "12px", padding: "3px 14px", fontSize: "11px", fontWeight: 700 }}>
          {data.issueLabel}
        </div>
        <div style={{ position: "absolute", top: "12px", right: "16px", fontSize: "11px", color: c("--c-text"), opacity: 0.6 }}>
          {data.publishDate}
        </div>
        <h1 style={{ fontSize: "30px", fontWeight: 900, color: c("--c-main"), margin: "8px 0 4px", letterSpacing: "3px" }}>
          {data.title}
        </h1>
        <p style={{ fontSize: "12px", color: c("--c-text"), opacity: 0.6, margin: 0 }}>{data.subtitle}</p>
      </div>

      {/* Main content: 2 columns */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "14px", minHeight: 0 }}>
        {/* Left: Activities */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <SectionHeader title={sec.activityReport.title} bg={`color-mix(in srgb, ${c("--c-main")} 12%, white)`} color={c("--c-main")} />
          {sec.activityReport.items.map((item, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: "12px", padding: "10px 12px",
              border: `1.5px solid color-mix(in srgb, ${c("--c-main")} 20%, white)`,
              flex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <DateBadge date={item.date} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: c("--c-text") }}>{item.headline}</span>
              </div>
              <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ height: "90px", marginBottom: "6px" }} />
              <p style={{ fontSize: "11px", lineHeight: 1.7, color: c("--c-text"), margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>

        {/* Right: Schedule + Notices + Extra */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Schedule */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", border: `1.5px solid color-mix(in srgb, ${c("--c-sub")} 25%, white)` }}>
            <SectionHeader title={sec.nextSchedule.title} bg={`color-mix(in srgb, ${c("--c-sub")} 12%, white)`} color={c("--c-sub")} />
            {sec.nextSchedule.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ background: `color-mix(in srgb, ${c("--c-sub")} 12%, white)`, color: c("--c-sub"), fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "8px", whiteSpace: "nowrap" }}>{item.date}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: c("--c-text") }}>{item.event}</span>
              </div>
            ))}
          </div>

          {/* Notices */}
          {sec.notices.items.length > 0 && (
            <div style={{ background: "#fff", borderRadius: "12px", padding: "10px 12px", border: `1.5px solid color-mix(in srgb, ${c("--c-accent")} 25%, white)` }}>
              <SectionHeader title={sec.notices.title} bg={`color-mix(in srgb, ${c("--c-accent")} 12%, white)`} color={c("--c-accent")} />
              {sec.notices.items.map((item, i) => (
                <div key={i} style={{ marginBottom: "6px", paddingLeft: "12px", borderLeft: `3px solid ${c("--c-accent")}`, fontSize: "11px", lineHeight: 1.7, color: c("--c-text") }}>
                  {item.headline && <span style={{ fontWeight: 700 }}>{item.headline}　</span>}
                  {item.body}
                </div>
              ))}
            </div>
          )}

          {/* Extra box */}
          {sec.extraBox && sec.extraBox.title && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 8%, white)`, borderRadius: "12px", padding: "10px 12px", border: `1.5px dashed ${c("--c-sub")}` }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: c("--c-sub") }}>{sec.extraBox.title}</span>
              <p style={{ fontSize: "11px", lineHeight: 1.7, color: c("--c-text"), margin: "4px 0 0" }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Member voices */}
      {sec.memberVoices.items.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <SectionHeader title={sec.memberVoices.title} bg={`color-mix(in srgb, ${c("--c-accent")} 12%, white)`} color={c("--c-accent")} />
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(sec.memberVoices.items.length, 4)}, 1fr)`, gap: "10px" }}>
            {sec.memberVoices.items.map((v, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: "12px", padding: "10px",
                border: `1.5px solid color-mix(in srgb, ${c("--c-accent")} 20%, white)`,
                textAlign: "center",
              }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: c("--c-accent"), margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>{v.name.charAt(0)}</span>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-text"), marginBottom: "4px" }}>{v.name}</div>
                <div style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), opacity: 0.8 }}>「{v.comment}」</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1.5px solid color-mix(in srgb, ${c("--c-main")} 15%, white)` }}>
        <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), opacity: 0.6, margin: 0, maxWidth: "65%" }}>{sec.editorNote.body}</p>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: c("--c-text"), opacity: 0.5 }}>{sec.editor.title}</div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: c("--c-main") }}>{sec.editor.name}</div>
        </div>
      </div>
    </div>
  );
}

/* ===== Variant 2: ジグザグ型 ===== */
function PopVariant2({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header - ribbon style */}
      <div style={{ textAlign: "center", marginBottom: "14px", position: "relative" }}>
        <div style={{
          background: c("--c-main"), color: "#fff", display: "inline-block",
          padding: "8px 32px", borderRadius: "0", fontSize: "11px", fontWeight: 700,
          position: "relative",
          clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)",
        }}>
          {data.issueLabel}　{data.publishDate}
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: c("--c-main"), margin: "10px 0 2px", letterSpacing: "2px" }}>
          {data.title}
        </h1>
        <p style={{ fontSize: "12px", color: c("--c-text"), opacity: 0.5, margin: 0 }}>{data.subtitle}</p>
      </div>

      {/* Activities - zigzag layout */}
      <SectionHeader title={sec.activityReport.title} bg={`color-mix(in srgb, ${c("--c-main")} 12%, white)`} color={c("--c-main")} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        {sec.activityReport.items.map((item, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse",
            gap: "12px", background: "#fff", borderRadius: "12px", padding: "10px",
            border: `1.5px solid color-mix(in srgb, ${c("--c-main")} 15%, white)`,
          }}>
            <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "120px", height: "80px", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <DateBadge date={item.date} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: c("--c-text") }}>{item.headline}</span>
              </div>
              <p style={{ fontSize: "11px", lineHeight: 1.7, color: c("--c-text"), margin: 0 }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row: Schedule + Notices side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "10px", border: `1.5px solid color-mix(in srgb, ${c("--c-sub")} 20%, white)` }}>
          <SectionHeader title={sec.nextSchedule.title} bg={`color-mix(in srgb, ${c("--c-sub")} 12%, white)`} color={c("--c-sub")} />
          {sec.nextSchedule.items.map((item, i) => (
            <div key={i} style={{ fontSize: "11px", color: c("--c-text"), marginBottom: "6px", display: "flex", gap: "6px" }}>
              <span style={{ fontWeight: 700, color: c("--c-sub"), whiteSpace: "nowrap" }}>{item.date}</span>
              <span>{item.event}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "10px", border: `1.5px solid color-mix(in srgb, ${c("--c-accent")} 20%, white)` }}>
          <SectionHeader title={sec.notices.title} bg={`color-mix(in srgb, ${c("--c-accent")} 12%, white)`} color={c("--c-accent")} />
          {sec.notices.items.map((item, i) => (
            <div key={i} style={{ fontSize: "11px", color: c("--c-text"), marginBottom: "6px", lineHeight: 1.6 }}>
              {item.headline && <span style={{ fontWeight: 700 }}>{item.headline}　</span>}{item.body}
            </div>
          ))}
        </div>
      </div>

      {/* Member voices - horizontal strip */}
      {sec.memberVoices.items.length > 0 && (
        <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {sec.memberVoices.items.map((v, i) => (
            <div key={i} style={{
              flex: 1, minWidth: "120px",
              background: `color-mix(in srgb, ${c("--c-accent")} 8%, white)`,
              borderRadius: "10px", padding: "8px", display: "flex", alignItems: "center", gap: "8px",
              border: `1px solid color-mix(in srgb, ${c("--c-accent")} 15%, white)`,
            }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: c("--c-accent"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>{v.name.charAt(0)}</span>
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-text") }}>{v.name}</div>
                <div style={{ fontSize: "9px", color: c("--c-text"), opacity: 0.7 }}>「{v.comment}」</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: "8px", fontSize: "10px", color: c("--c-text"), opacity: 0.5, display: "flex", justifyContent: "space-between" }}>
        <span>{sec.editorNote.body}</span>
        <span>{sec.editor.name} / {data.clubName}</span>
      </div>
    </div>
  );
}

/* ===== Variant 3: 全面カラフル型 ===== */
function PopVariant3({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "18px", background: `linear-gradient(180deg, ${c("--c-bg")}, color-mix(in srgb, ${c("--c-main")} 5%, white))` }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header - big bold */}
      <div style={{
        background: c("--c-main"), borderRadius: "16px", padding: "18px 24px",
        marginBottom: "12px", color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: "-10px", left: "30px", width: "50px", height: "50px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", opacity: 0.8, background: "rgba(255,255,255,0.2)", borderRadius: "8px", padding: "2px 10px" }}>{data.issueLabel}</span>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>{data.publishDate}</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 2px", letterSpacing: "2px" }}>{data.title}</h1>
        <p style={{ fontSize: "11px", opacity: 0.8, margin: 0 }}>{data.subtitle}</p>
      </div>

      {/* 3-column colorful cards */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", minHeight: 0 }}>
        {/* Col 1: Activities */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: c("--c-main"), color: "#fff", borderRadius: "10px", padding: "6px 10px", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>
            {sec.activityReport.title}
          </div>
          {sec.activityReport.items.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "10px", padding: "8px", flex: 1, border: `1.5px solid color-mix(in srgb, ${c("--c-main")} 20%, white)` }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-main"), marginBottom: "3px" }}>{item.date}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-text"), marginBottom: "4px" }}>{item.headline}</div>
              <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ height: "60px", marginBottom: "4px" }} />
              <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>

        {/* Col 2: Schedule + Notices */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: c("--c-sub"), color: "#fff", borderRadius: "10px", padding: "6px 10px", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>
            {sec.nextSchedule.title}
          </div>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "8px", border: `1.5px solid color-mix(in srgb, ${c("--c-sub")} 20%, white)` }}>
            {sec.nextSchedule.items.map((item, i) => (
              <div key={i} style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: i < sec.nextSchedule.items.length - 1 ? `1px dashed color-mix(in srgb, ${c("--c-sub")} 20%, white)` : "none" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-sub") }}>{item.date}</div>
                <div style={{ fontSize: "11px", color: c("--c-text") }}>{item.event}</div>
              </div>
            ))}
          </div>
          <div style={{ background: c("--c-accent"), color: "#fff", borderRadius: "10px", padding: "6px 10px", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>
            {sec.notices.title}
          </div>
          <div style={{ background: "#fff", borderRadius: "10px", padding: "8px", flex: 1, border: `1.5px solid color-mix(in srgb, ${c("--c-accent")} 20%, white)` }}>
            {sec.notices.items.map((item, i) => (
              <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "6px" }}>
                {item.headline && <span style={{ fontWeight: 700 }}>{item.headline}　</span>}{item.body}
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Member voices + Extra */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: `color-mix(in srgb, ${c("--c-accent")} 80%, ${c("--c-main")})`, color: "#fff", borderRadius: "10px", padding: "6px 10px", fontSize: "12px", fontWeight: 700, textAlign: "center" }}>
            {sec.memberVoices.title}
          </div>
          {sec.memberVoices.items.map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "10px", padding: "8px", border: `1.5px solid color-mix(in srgb, ${c("--c-accent")} 15%, white)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: c("--c-accent"), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>{v.name.charAt(0)}</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: c("--c-text") }}>{v.name}</span>
              </div>
              <div style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), opacity: 0.8 }}>「{v.comment}」</div>
            </div>
          ))}
          {sec.extraBox && sec.extraBox.title && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 10%, white)`, borderRadius: "10px", padding: "8px", border: `1.5px dashed ${c("--c-sub")}`, flex: 1 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-sub"), marginBottom: "4px" }}>{sec.extraBox.title}</div>
              <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: 0 }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "10px", padding: "8px 12px", background: `color-mix(in srgb, ${c("--c-main")} 8%, white)`, borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "9px", lineHeight: 1.5, color: c("--c-text"), opacity: 0.6, margin: 0, maxWidth: "70%" }}>{sec.editorNote.body}</p>
        <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-main") }}>{sec.editor.name}</div>
      </div>
    </div>
  );
}

export function PopTemplate(props: TemplateProps) {
  switch (props.variant) {
    case 2: return <PopVariant2 {...props} />;
    case 3: return <PopVariant3 {...props} />;
    default: return <PopVariant1 {...props} />;
  }
}
