import type { TemplateProps } from "./types";
import { SeasonDecoration } from "./SeasonDecorations";

const c = (v: string) => `var(${v})`;

const PhotoOrPlaceholder = ({ photo, index, style }: { photo?: string; index: number; style?: React.CSSProperties }) => (
  <div style={{
    borderRadius: "12px", overflow: "hidden", background: "#f5f5f5",
    display: "flex", alignItems: "center", justifyContent: "center",
    ...style,
  }}>
    {photo ? (
      <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : (
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg, color-mix(in srgb, ${c("--c-main")} 10%, white), color-mix(in srgb, ${c("--c-sub")} 10%, white))`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
          <circle cx="24" cy="16" r="8" fill={c("--c-main")} />
          <path d="M10 42 Q10 30 24 30 Q38 30 38 42" fill={c("--c-main")} opacity="0.5" />
          <circle cx="38" cy="12" r="4" fill={c("--c-sub")} />
        </svg>
      </div>
    )}
  </div>
);

/* ===== Variant 1: メインビジュアル大型 ===== */
function CheerfulVariant1({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "18px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header with large visual */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
        {/* Main visual - large */}
        <PhotoOrPlaceholder photo={photos[0]} index={0} style={{ width: "100%", height: "200px" }} />
        {/* Title overlay on bottom */}
        <div style={{
          position: "absolute", bottom: "0", left: "0", right: "0",
          background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
          borderRadius: "0 0 12px 12px", padding: "30px 18px 14px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#fff", margin: "0 0 2px", letterSpacing: "2px", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                {data.title}
              </h1>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: 0 }}>{data.subtitle}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>{data.issueLabel}</span>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>{data.publishDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity cards with large images */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ fontSize: "14px", fontWeight: 800, color: c("--c-main"), display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "4px", height: "16px", background: c("--c-main"), borderRadius: "2px" }} />
          {sec.activityReport.title}
        </div>
        {sec.activityReport.items.map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: "12px", alignItems: "stretch",
            background: "#fff", borderRadius: "12px", padding: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}>
            <PhotoOrPlaceholder photo={photos[i + 1]} index={i + 1} style={{ width: "140px", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-main"), marginBottom: "3px" }}>{item.date}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: c("--c-text"), marginBottom: "4px" }}>{item.headline}</div>
              <p style={{ fontSize: "11px", lineHeight: 1.7, color: c("--c-text"), margin: 0, opacity: 0.8 }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: schedule + notices in cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
        <div style={{
          background: `color-mix(in srgb, ${c("--c-sub")} 10%, white)`,
          borderRadius: "12px", padding: "10px",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-sub"), marginBottom: "8px" }}>{sec.nextSchedule.title}</div>
          {sec.nextSchedule.items.map((item, i) => (
            <div key={i} style={{ fontSize: "11px", color: c("--c-text"), marginBottom: "6px" }}>
              <span style={{ fontWeight: 700, color: c("--c-sub") }}>{item.date}</span> {item.event}
            </div>
          ))}
        </div>
        <div style={{
          background: `color-mix(in srgb, ${c("--c-accent")} 10%, white)`,
          borderRadius: "12px", padding: "10px",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-accent"), marginBottom: "8px" }}>{sec.notices.title}</div>
          {sec.notices.items.map((item, i) => (
            <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "5px" }}>
              {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
            </div>
          ))}
        </div>
      </div>

      {/* Member voices */}
      {sec.memberVoices.items.length > 0 && (
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          {sec.memberVoices.items.map((v, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", borderRadius: "10px", padding: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: c("--c-accent"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>{v.name.charAt(0)}</span>
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
      <div style={{ marginTop: "auto", paddingTop: "8px", fontSize: "9px", color: c("--c-text"), opacity: 0.5, textAlign: "center" }}>
        {sec.editorNote.body} ／ {sec.editor.title}：{sec.editor.name} ／ {data.clubName}
      </div>
    </div>
  );
}

/* ===== Variant 2: 写真グリッド型 ===== */
function CheerfulVariant2({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "18px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Compact header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", padding: "10px 16px", background: `color-mix(in srgb, ${c("--c-main")} 10%, white)`, borderRadius: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: c("--c-main"), margin: 0, letterSpacing: "2px" }}>{data.title}</h1>
          <p style={{ fontSize: "11px", color: c("--c-text"), opacity: 0.6, margin: "2px 0 0" }}>{data.subtitle}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-main") }}>{data.issueLabel}</div>
          <div style={{ fontSize: "10px", color: c("--c-text"), opacity: 0.5 }}>{data.publishDate}</div>
        </div>
      </div>

      {/* Photo grid + activity text */}
      <div style={{ fontSize: "13px", fontWeight: 800, color: c("--c-main"), marginBottom: "8px" }}>{sec.activityReport.title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
        {sec.activityReport.items.map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "100%", height: "100px", borderRadius: "0" }} />
            <div style={{ padding: "8px 10px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-main") }}>{item.date}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-text"), marginBottom: "3px" }}>{item.headline}</div>
              <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: 0, opacity: 0.8 }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 8%, white)`, borderRadius: "12px", padding: "10px 14px", marginBottom: "10px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-sub"), marginBottom: "6px" }}>{sec.nextSchedule.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {sec.nextSchedule.items.map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "8px", padding: "4px 10px", fontSize: "10px", color: c("--c-text") }}>
              <span style={{ fontWeight: 700, color: c("--c-sub") }}>{item.date}</span> {item.event}
            </div>
          ))}
        </div>
      </div>

      {/* Notices + Extra */}
      <div style={{ display: "grid", gridTemplateColumns: sec.extraBox ? "1fr 1fr" : "1fr", gap: "10px", marginBottom: "10px" }}>
        {sec.notices.items.length > 0 && (
          <div style={{ background: "#fff", borderRadius: "12px", padding: "10px", border: `1.5px solid color-mix(in srgb, ${c("--c-accent")} 20%, white)` }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-accent"), marginBottom: "6px" }}>{sec.notices.title}</div>
            {sec.notices.items.map((item, i) => (
              <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "4px" }}>
                • {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
              </div>
            ))}
          </div>
        )}
        {sec.extraBox && sec.extraBox.title && (
          <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 8%, white)`, borderRadius: "12px", padding: "10px", border: `1.5px dashed ${c("--c-sub")}` }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-sub"), marginBottom: "4px" }}>{sec.extraBox.title}</div>
            <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: 0 }}>{sec.extraBox.body}</p>
          </div>
        )}
      </div>

      {/* Member voices */}
      {sec.memberVoices.items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(sec.memberVoices.items.length, 3)}, 1fr)`, gap: "8px" }}>
          {sec.memberVoices.items.map((v, i) => (
            <div key={i} style={{ background: `color-mix(in srgb, ${c("--c-accent")} 6%, white)`, borderRadius: "10px", padding: "8px", textAlign: "center" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: c("--c-accent"), margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>{v.name.charAt(0)}</span>
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-text") }}>{v.name}</div>
              <div style={{ fontSize: "9px", color: c("--c-text"), opacity: 0.7, marginTop: "2px" }}>「{v.comment}」</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: "8px", fontSize: "9px", color: c("--c-text"), opacity: 0.5, display: "flex", justifyContent: "space-between" }}>
        <span>{sec.editorNote.body}</span>
        <span>{sec.editor.name} / {data.clubName}</span>
      </div>
    </div>
  );
}

/* ===== Variant 3: コラージュ風 ===== */
function CheerfulVariant3({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px", position: "relative" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header - playful angle */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <div style={{ display: "inline-block", background: c("--c-main"), color: "#fff", padding: "4px 20px", borderRadius: "0 0 10px 10px", fontSize: "10px", fontWeight: 700, marginBottom: "6px" }}>
          {data.issueLabel}　{data.publishDate}
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 900, color: c("--c-main"), margin: "4px 0", letterSpacing: "2px" }}>{data.title}</h1>
        <p style={{ fontSize: "11px", color: c("--c-text"), opacity: 0.5, margin: 0 }}>{data.subtitle}</p>
      </div>

      {/* Collage area: scattered cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto auto", gap: "8px" }}>
        {/* Activity cards like scattered photos */}
        {sec.activityReport.items.map((item, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: "10px", padding: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            transform: `rotate(${i % 2 === 0 ? "-1" : "1"}deg)`,
          }}>
            <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "100%", height: "120px", marginBottom: "6px" }} />
            <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-main") }}>{item.date}</div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-text") }}>{item.headline}</div>
            <p style={{ fontSize: "10px", lineHeight: 1.5, color: c("--c-text"), margin: "3px 0 0", opacity: 0.8 }}>{item.body}</p>
          </div>
        ))}

        {/* Schedule card */}
        <div style={{
          background: `color-mix(in srgb, ${c("--c-sub")} 10%, white)`,
          borderRadius: "10px", padding: "10px",
          transform: "rotate(0.5deg)",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-sub"), marginBottom: "6px" }}>{sec.nextSchedule.title}</div>
          {sec.nextSchedule.items.map((item, i) => (
            <div key={i} style={{ fontSize: "10px", color: c("--c-text"), marginBottom: "5px" }}>
              <span style={{ fontWeight: 700, color: c("--c-sub") }}>{item.date}</span> {item.event}
            </div>
          ))}
        </div>

        {/* Notices card */}
        <div style={{
          background: `color-mix(in srgb, ${c("--c-accent")} 10%, white)`,
          borderRadius: "10px", padding: "10px",
          transform: "rotate(-0.5deg)",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-accent"), marginBottom: "6px" }}>{sec.notices.title}</div>
          {sec.notices.items.map((item, i) => (
            <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "4px" }}>
              • {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
            </div>
          ))}
        </div>
      </div>

      {/* Member voices as speech bubbles */}
      {sec.memberVoices.items.length > 0 && (
        <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {sec.memberVoices.items.map((v, i) => (
            <div key={i} style={{
              minWidth: "100px",
              background: "#fff", borderRadius: "12px", padding: "8px 10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)", position: "relative",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-main") }}>{v.name}</div>
              <div style={{ fontSize: "9px", color: c("--c-text"), opacity: 0.8, marginTop: "2px" }}>「{v.comment}」</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: "8px", fontSize: "9px", color: c("--c-text"), opacity: 0.5, textAlign: "center" }}>
        {sec.editorNote.body} ／ {sec.editor.name} ／ {data.clubName}
      </div>
    </div>
  );
}

export function CheerfulTemplate(props: TemplateProps) {
  switch (props.variant) {
    case 2: return <CheerfulVariant2 {...props} />;
    case 3: return <CheerfulVariant3 {...props} />;
    default: return <CheerfulVariant1 {...props} />;
  }
}
