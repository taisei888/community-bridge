import type { TemplateProps } from "./types";
import { SeasonDecoration } from "./SeasonDecorations";

const c = (v: string) => `var(${v})`;

const PhotoOrPlaceholder = ({ photo, index, style }: { photo?: string; index: number; style?: React.CSSProperties }) => (
  <div style={{ borderRadius: "12px", overflow: "hidden", background: "#f5f5f5", ...style }}>
    {photo ? (
      <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : (
      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, color-mix(in srgb, ${c("--c-main")} 8%, white), color-mix(in srgb, ${c("--c-sub")} 6%, white))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.25">
          <circle cx="16" cy="12" r="6" fill={c("--c-main")} />
          <path d="M6 28 Q6 22 16 22 Q26 22 26 28" fill={c("--c-main")} opacity="0.4" />
        </svg>
      </div>
    )}
  </div>
);

/* ===== Variant 1: ゆったりカード型 ===== */
function SimplePopVariant1({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Simple clean header */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <span style={{ fontSize: "10px", color: c("--c-main"), fontWeight: 600, letterSpacing: "2px" }}>{data.issueLabel}　{data.publishDate}</span>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: c("--c-main"), margin: "6px 0 4px", letterSpacing: "3px" }}>{data.title}</h1>
        <p style={{ fontSize: "12px", color: c("--c-text"), opacity: 0.5, margin: 0 }}>{data.subtitle}</p>
        <div style={{ width: "40px", height: "3px", background: c("--c-main"), margin: "10px auto 0", borderRadius: "2px" }} />
      </div>

      {/* Activities - large, easy to read */}
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 800, color: c("--c-main"), margin: "0 0 12px" }}>{sec.activityReport.title}</h2>
        {sec.activityReport.items.map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: "14px", marginBottom: "14px",
            padding: "12px", background: "#fff", borderRadius: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "110px", height: "80px", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ background: c("--c-main"), color: "#fff", fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "8px" }}>{item.date}</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: c("--c-text") }}>{item.headline}</span>
              </div>
              <p style={{ fontSize: "12px", lineHeight: 1.8, color: c("--c-text"), margin: 0 }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule - simple list */}
      <div style={{ marginBottom: "14px", padding: "14px 16px", background: `color-mix(in srgb, ${c("--c-sub")} 8%, white)`, borderRadius: "14px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 800, color: c("--c-sub"), margin: "0 0 10px" }}>{sec.nextSchedule.title}</h2>
        {sec.nextSchedule.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", fontSize: "13px", color: c("--c-text") }}>
            <span style={{ fontWeight: 700, color: c("--c-sub"), minWidth: "60px" }}>{item.date}</span>
            <span style={{ fontWeight: 600 }}>{item.event}</span>
          </div>
        ))}
      </div>

      {/* Notices - if any */}
      {sec.notices.items.length > 0 && (
        <div style={{ marginBottom: "14px", padding: "12px 16px", background: `color-mix(in srgb, ${c("--c-accent")} 6%, white)`, borderRadius: "14px", borderLeft: `4px solid ${c("--c-accent")}` }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: c("--c-accent"), margin: "0 0 8px" }}>{sec.notices.title}</h3>
          {sec.notices.items.map((item, i) => (
            <p key={i} style={{ fontSize: "12px", lineHeight: 1.7, color: c("--c-text"), margin: "0 0 6px" }}>
              {item.headline && <span style={{ fontWeight: 700 }}>{item.headline}　</span>}{item.body}
            </p>
          ))}
        </div>
      )}

      {/* Member voices */}
      {sec.memberVoices.items.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, color: c("--c-main"), margin: "0 0 8px" }}>{sec.memberVoices.title}</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            {sec.memberVoices.items.map((v, i) => (
              <div key={i} style={{ flex: 1, padding: "10px", background: "#fff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: c("--c-main"), marginBottom: "4px" }}>{v.name}</div>
                <div style={{ fontSize: "12px", lineHeight: 1.6, color: c("--c-text") }}>「{v.comment}」</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extra */}
      {sec.extraBox && sec.extraBox.title && (
        <div style={{ marginBottom: "12px", padding: "10px 14px", background: `color-mix(in srgb, ${c("--c-sub")} 6%, white)`, borderRadius: "12px", border: `1.5px dashed ${c("--c-sub")}` }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: c("--c-sub"), marginBottom: "4px" }}>{sec.extraBox.title}</div>
          <p style={{ fontSize: "12px", lineHeight: 1.7, color: c("--c-text"), margin: 0 }}>{sec.extraBox.body}</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: "10px", borderTop: `1.5px solid color-mix(in srgb, ${c("--c-main")} 12%, white)`, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <p style={{ fontSize: "10px", lineHeight: 1.5, color: c("--c-text"), opacity: 0.5, margin: 0, maxWidth: "60%" }}>{sec.editorNote.body}</p>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: c("--c-text"), opacity: 0.4 }}>{sec.editor.title}</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: c("--c-main") }}>{sec.editor.name}</div>
        </div>
      </div>
    </div>
  );
}

/* ===== Variant 2: リスト強調型 ===== */
function SimplePopVariant2({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "22px 26px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header with colored bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px", padding: "12px 18px", background: `linear-gradient(90deg, ${c("--c-main")}, color-mix(in srgb, ${c("--c-main")} 70%, ${c("--c-sub")}))`, borderRadius: "12px", color: "#fff" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0, letterSpacing: "2px" }}>{data.title}</h1>
          <p style={{ fontSize: "11px", opacity: 0.8, margin: "2px 0 0" }}>{data.subtitle}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: "10px", opacity: 0.8 }}>
          <div>{data.issueLabel}</div>
          <div>{data.publishDate}</div>
        </div>
      </div>

      {/* Main content - list style with clear separators */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: 0 }}>
        {/* Activity report */}
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 800, color: c("--c-main"), margin: "0 0 8px", paddingLeft: "10px", borderLeft: `4px solid ${c("--c-main")}` }}>{sec.activityReport.title}</h2>
          {sec.activityReport.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 14px", marginBottom: "6px",
              background: i % 2 === 0 ? `color-mix(in srgb, ${c("--c-main")} 4%, white)` : "#fff",
              borderRadius: "10px",
            }}>
              <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "70px", height: "50px", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: c("--c-text"), marginBottom: "2px" }}>
                  <span style={{ color: c("--c-main"), marginRight: "6px" }}>{item.date}</span>{item.headline}
                </div>
                <p style={{ fontSize: "11px", lineHeight: 1.7, color: c("--c-text"), margin: 0, opacity: 0.8 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 800, color: c("--c-sub"), margin: "0 0 8px", paddingLeft: "10px", borderLeft: `4px solid ${c("--c-sub")}` }}>{sec.nextSchedule.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {sec.nextSchedule.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 14px",
                background: i % 2 === 0 ? `color-mix(in srgb, ${c("--c-sub")} 4%, white)` : "#fff",
                borderRadius: "8px", fontSize: "12px", color: c("--c-text"),
              }}>
                <span style={{ fontWeight: 700, color: c("--c-sub"), minWidth: "70px" }}>{item.date}</span>
                <span style={{ fontWeight: 600 }}>{item.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        {sec.notices.items.length > 0 && (
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 800, color: c("--c-accent"), margin: "0 0 8px", paddingLeft: "10px", borderLeft: `4px solid ${c("--c-accent")}` }}>{sec.notices.title}</h2>
            {sec.notices.items.map((item, i) => (
              <div key={i} style={{ padding: "6px 14px", fontSize: "12px", lineHeight: 1.7, color: c("--c-text") }}>
                {item.headline && <span style={{ fontWeight: 700 }}>{item.headline}　</span>}{item.body}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member voices - inline */}
      {sec.memberVoices.items.length > 0 && (
        <div style={{ marginTop: "10px", padding: "10px 14px", background: `color-mix(in srgb, ${c("--c-accent")} 5%, white)`, borderRadius: "10px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, color: c("--c-accent"), margin: "0 0 6px" }}>{sec.memberVoices.title}</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {sec.memberVoices.items.map((v, i) => (
              <span key={i} style={{ fontSize: "11px", color: c("--c-text") }}>
                <span style={{ fontWeight: 700 }}>{v.name}</span>「{v.comment}」
              </span>
            ))}
          </div>
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

/* ===== Variant 3: ブロック分割型 ===== */
function SimplePopVariant3({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header - centered with decorative line */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "6px" }}>
          <div style={{ flex: 1, maxWidth: "60px", height: "2px", background: c("--c-main"), opacity: 0.3 }} />
          <span style={{ fontSize: "10px", color: c("--c-main"), fontWeight: 600 }}>{data.issueLabel}</span>
          <div style={{ flex: 1, maxWidth: "60px", height: "2px", background: c("--c-main"), opacity: 0.3 }} />
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 900, color: c("--c-main"), margin: "0 0 4px", letterSpacing: "3px" }}>{data.title}</h1>
        <p style={{ fontSize: "11px", color: c("--c-text"), opacity: 0.5, margin: 0 }}>{data.subtitle}　{data.publishDate}</p>
      </div>

      {/* Block layout - clear sections with backgrounds */}
      <div style={{ display: "grid", gridTemplateRows: "auto auto 1fr", gap: "12px", minHeight: 0 }}>
        {/* Activities block */}
        <div style={{ background: `color-mix(in srgb, ${c("--c-main")} 5%, white)`, borderRadius: "14px", padding: "14px 16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 800, color: c("--c-main"), margin: "0 0 10px" }}>{sec.activityReport.title}</h2>
          <div style={{ display: "flex", gap: "12px" }}>
            {sec.activityReport.items.map((item, i) => (
              <div key={i} style={{ flex: 1 }}>
                <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "100%", height: "110px", marginBottom: "6px" }} />
                <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-main"), marginBottom: "2px" }}>{item.date}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-text"), marginBottom: "3px" }}>{item.headline}</div>
                <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule + Notices block */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 6%, white)`, borderRadius: "14px", padding: "12px 14px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: c("--c-sub"), margin: "0 0 8px" }}>{sec.nextSchedule.title}</h3>
            {sec.nextSchedule.items.map((item, i) => (
              <div key={i} style={{ fontSize: "12px", color: c("--c-text"), marginBottom: "6px" }}>
                <span style={{ fontWeight: 700, color: c("--c-sub") }}>{item.date}</span>　{item.event}
              </div>
            ))}
          </div>
          <div style={{ background: `color-mix(in srgb, ${c("--c-accent")} 6%, white)`, borderRadius: "14px", padding: "12px 14px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: c("--c-accent"), margin: "0 0 8px" }}>{sec.notices.title}</h3>
            {sec.notices.items.map((item, i) => (
              <div key={i} style={{ fontSize: "11px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "6px" }}>
                {item.headline && <span style={{ fontWeight: 700 }}>{item.headline}　</span>}{item.body}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: voices + extra */}
        <div style={{ display: "grid", gridTemplateColumns: sec.extraBox ? "1.5fr 1fr" : "1fr", gap: "12px" }}>
          {sec.memberVoices.items.length > 0 && (
            <div style={{ background: "#fff", borderRadius: "14px", padding: "12px 14px", border: `1.5px solid color-mix(in srgb, ${c("--c-main")} 12%, white)` }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: c("--c-main"), margin: "0 0 8px" }}>{sec.memberVoices.title}</h3>
              {sec.memberVoices.items.map((v, i) => (
                <div key={i} style={{ fontSize: "12px", color: c("--c-text"), marginBottom: "6px" }}>
                  <span style={{ fontWeight: 700, color: c("--c-main") }}>{v.name}</span>「{v.comment}」
                </div>
              ))}
            </div>
          )}
          {sec.extraBox && sec.extraBox.title && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 5%, white)`, borderRadius: "14px", padding: "12px 14px", border: `1.5px dashed ${c("--c-sub")}` }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-sub"), marginBottom: "4px" }}>{sec.extraBox.title}</div>
              <p style={{ fontSize: "11px", lineHeight: 1.6, color: c("--c-text"), margin: 0 }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: `1px solid color-mix(in srgb, ${c("--c-main")} 10%, white)`, fontSize: "9px", color: c("--c-text"), opacity: 0.5, display: "flex", justifyContent: "space-between" }}>
        <span>{sec.editorNote.body}</span>
        <span>{sec.editor.name} / {data.clubName}</span>
      </div>
    </div>
  );
}

export function SimplePopTemplate(props: TemplateProps) {
  switch (props.variant) {
    case 2: return <SimplePopVariant2 {...props} />;
    case 3: return <SimplePopVariant3 {...props} />;
    default: return <SimplePopVariant1 {...props} />;
  }
}
