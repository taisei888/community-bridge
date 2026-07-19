import type { TemplateProps } from "./types";
import { SeasonDecoration } from "./SeasonDecorations";
import { IllustrationPlaceholder } from "./IllustrationPlaceholder";

const c = (v: string) => `var(${v})`;

const PhotoOrPlaceholder = ({ photo, hint, style }: { photo?: string; hint?: string; index: number; style?: React.CSSProperties }) => {
  if (photo) {
    return (
      <div style={{ borderRadius: "10px", overflow: "hidden", ...style }}>
        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
  }
  return <IllustrationPlaceholder hint={hint} style={style} />;
};

/* ===== Variant 1: ポスター風 ===== */
function EventVariant1({ data, photos }: TemplateProps) {
  const sec = data.sections;
  const mainEvent = sec.nextSchedule.items[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "18px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Big event header - poster style */}
      <div style={{
        background: `linear-gradient(135deg, ${c("--c-main")}, color-mix(in srgb, ${c("--c-main")} 70%, ${c("--c-sub")}))`,
        borderRadius: "16px", padding: "24px", marginBottom: "14px",
        color: "#fff", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-20px", left: "20px", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ fontSize: "10px", opacity: 0.8, marginBottom: "4px" }}>{data.issueLabel}</div>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 4px", letterSpacing: "3px" }}>{data.title}</h1>
        <p style={{ fontSize: "11px", opacity: 0.8, margin: "0 0 12px" }}>{data.subtitle}</p>

        {mainEvent && (
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 18px", display: "inline-block" }}>
            <div style={{ fontSize: "20px", fontWeight: 900 }}>{mainEvent.date}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, marginTop: "2px" }}>{mainEvent.event}</div>
            {mainEvent.description && <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px" }}>{mainEvent.description}</div>}
          </div>
        )}
      </div>

      {/* Schedule list - prominent */}
      <div style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 800, color: c("--c-main"), margin: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="11" rx="2" stroke={c("--c-main")} strokeWidth="1.5" fill="none" />
            <line x1="2" y1="6.5" x2="14" y2="6.5" stroke={c("--c-main")} strokeWidth="1" />
          </svg>
          {sec.nextSchedule.title}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {sec.nextSchedule.items.slice(1).map((item, i) => (
            <div key={i} style={{
              background: `color-mix(in srgb, ${c("--c-main")} 8%, white)`,
              borderRadius: "10px", padding: "10px 12px",
              borderLeft: `4px solid ${c("--c-main")}`,
            }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: c("--c-main") }}>{item.date}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: c("--c-text"), marginTop: "2px" }}>{item.event}</div>
              {item.description && <div style={{ fontSize: "10px", color: c("--c-text"), opacity: 0.7, marginTop: "2px" }}>{item.description}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Activity report - compact */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", minHeight: 0 }}>
        <div>
          <h3 style={{ fontSize: "12px", fontWeight: 700, color: c("--c-sub"), margin: "0 0 6px" }}>{sec.activityReport.title}</h3>
          {sec.activityReport.items.map((item, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <PhotoOrPlaceholder photo={photos[i]} hint={item.headline} index={i} style={{ width: "100%", height: "110px", marginBottom: "4px" }} />
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-text") }}>{item.date} {item.headline}</div>
              <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: "2px 0 0", opacity: 0.8 }}>{item.body}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Notices */}
          {sec.notices.items.length > 0 && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-accent")} 8%, white)`, borderRadius: "10px", padding: "10px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 700, color: c("--c-accent"), margin: "0 0 6px" }}>{sec.notices.title}</h3>
              {sec.notices.items.map((item, i) => (
                <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "4px" }}>
                  {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
                </div>
              ))}
            </div>
          )}

          {/* Member voices */}
          {sec.memberVoices.items.length > 0 && (
            <div style={{ background: "#fff", borderRadius: "10px", padding: "10px", border: `1px solid color-mix(in srgb, ${c("--c-main")} 15%, white)` }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: c("--c-main"), margin: "0 0 6px" }}>{sec.memberVoices.title}</h3>
              {sec.memberVoices.items.map((v, i) => (
                <div key={i} style={{ fontSize: "10px", color: c("--c-text"), marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700 }}>{v.name}</span>「{v.comment}」
                </div>
              ))}
            </div>
          )}

          {sec.extraBox && sec.extraBox.title && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 8%, white)`, borderRadius: "10px", padding: "8px", border: `1.5px dashed ${c("--c-sub")}` }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-sub") }}>{sec.extraBox.title}</div>
              <p style={{ fontSize: "9px", lineHeight: 1.5, color: c("--c-text"), margin: "3px 0 0" }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "10px", fontSize: "9px", color: c("--c-text"), opacity: 0.5, textAlign: "center" }}>
        {sec.editorNote.body} ／ {sec.editor.name} ／ {data.clubName} ／ {data.publishDate}
      </div>
    </div>
  );
}

/* ===== Variant 2: カレンダー風 ===== */
function EventVariant2({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "18px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", padding: "10px 16px", borderBottom: `2px solid ${c("--c-main")}` }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: c("--c-main"), margin: 0 }}>{data.title}</h1>
          <p style={{ fontSize: "11px", color: c("--c-text"), opacity: 0.5, margin: "2px 0 0" }}>{data.subtitle}</p>
        </div>
        <div style={{ background: c("--c-main"), color: "#fff", borderRadius: "10px", padding: "8px 14px", textAlign: "center" }}>
          <div style={{ fontSize: "9px", opacity: 0.8 }}>{data.issueLabel}</div>
          <div style={{ fontSize: "12px", fontWeight: 700 }}>{data.publishDate}</div>
        </div>
      </div>

      {/* Calendar-style schedule grid */}
      <div style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 800, color: c("--c-main"), margin: "0 0 8px" }}>{sec.nextSchedule.title}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {sec.nextSchedule.items.map((item, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: "10px", overflow: "hidden",
              border: `1.5px solid color-mix(in srgb, ${c("--c-main")} 20%, white)`,
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}>
              <div style={{ background: c("--c-main"), color: "#fff", padding: "4px 8px", fontSize: "11px", fontWeight: 700, textAlign: "center" }}>
                {item.date}
              </div>
              <div style={{ padding: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: c("--c-text") }}>{item.event}</div>
                {item.description && <div style={{ fontSize: "9px", color: c("--c-text"), opacity: 0.6, marginTop: "2px" }}>{item.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities - horizontal cards */}
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ fontSize: "12px", fontWeight: 800, color: c("--c-sub"), margin: "0 0 6px" }}>{sec.activityReport.title}</h3>
        <div style={{ display: "flex", gap: "10px", overflow: "hidden" }}>
          {sec.activityReport.items.map((item, i) => (
            <div key={i} style={{ flex: 1, background: "#fff", borderRadius: "10px", padding: "8px", border: `1px solid color-mix(in srgb, ${c("--c-sub")} 15%, white)` }}>
              <PhotoOrPlaceholder photo={photos[i]} hint={item.headline} index={i} style={{ width: "100%", height: "100px", marginBottom: "4px" }} />
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-sub") }}>{item.date}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-text") }}>{item.headline}</div>
              <p style={{ fontSize: "9px", lineHeight: 1.5, color: c("--c-text"), margin: "2px 0 0" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Notices + Voices */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", minHeight: 0 }}>
        {sec.notices.items.length > 0 && (
          <div style={{ background: `color-mix(in srgb, ${c("--c-accent")} 6%, white)`, borderRadius: "10px", padding: "10px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: 700, color: c("--c-accent"), margin: "0 0 6px" }}>{sec.notices.title}</h3>
            {sec.notices.items.map((item, i) => (
              <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "4px" }}>
                • {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
              </div>
            ))}
          </div>
        )}
        <div>
          {sec.memberVoices.items.length > 0 && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-main")} 5%, white)`, borderRadius: "10px", padding: "10px", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: c("--c-main"), margin: "0 0 6px" }}>{sec.memberVoices.title}</h3>
              {sec.memberVoices.items.map((v, i) => (
                <div key={i} style={{ fontSize: "10px", color: c("--c-text"), marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700 }}>{v.name}</span>「{v.comment}」
                </div>
              ))}
            </div>
          )}
          {sec.extraBox && sec.extraBox.title && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 6%, white)`, borderRadius: "8px", padding: "8px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-sub") }}>{sec.extraBox.title}</div>
              <p style={{ fontSize: "9px", lineHeight: 1.5, color: c("--c-text"), margin: "2px 0 0" }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "8px", fontSize: "9px", color: c("--c-text"), opacity: 0.5, textAlign: "center", borderTop: `1px solid color-mix(in srgb, ${c("--c-main")} 15%, white)`, paddingTop: "6px" }}>
        {sec.editorNote.body} ／ {sec.editor.name} ／ {data.clubName}
      </div>
    </div>
  );
}

/* ===== Variant 3: タイムライン風 ===== */
function EventVariant3({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "18px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 900, color: c("--c-main"), margin: "0 0 4px", letterSpacing: "2px" }}>{data.title}</h1>
        <p style={{ fontSize: "11px", color: c("--c-text"), opacity: 0.5, margin: 0 }}>{data.subtitle} ／ {data.issueLabel} ／ {data.publishDate}</p>
      </div>

      {/* Timeline layout */}
      <div style={{ display: "flex", gap: "0", minHeight: 0 }}>
        {/* Timeline line */}
        <div style={{ width: "30px", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <div style={{ width: "2px", flex: 1, background: `linear-gradient(to bottom, ${c("--c-main")}, ${c("--c-sub")}, ${c("--c-accent")})` }} />
        </div>

        {/* Timeline content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Schedule events on timeline */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "-22px", top: "8px", width: "12px", height: "12px", borderRadius: "50%", background: c("--c-main"), border: "2px solid #fff", boxShadow: `0 0 0 2px ${c("--c-main")}` }} />
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: c("--c-main"), margin: "0 0 6px" }}>{sec.nextSchedule.title}</h3>
            {sec.nextSchedule.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "center" }}>
                <span style={{ background: c("--c-main"), color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>{item.date}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: c("--c-text") }}>{item.event}</span>
              </div>
            ))}
          </div>

          {/* Activities on timeline */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "-22px", top: "8px", width: "12px", height: "12px", borderRadius: "50%", background: c("--c-sub"), border: "2px solid #fff", boxShadow: `0 0 0 2px ${c("--c-sub")}` }} />
            <h3 style={{ fontSize: "13px", fontWeight: 800, color: c("--c-sub"), margin: "0 0 6px" }}>{sec.activityReport.title}</h3>
            {sec.activityReport.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <PhotoOrPlaceholder photo={photos[i]} hint={item.headline} index={i} style={{ width: "80px", height: "60px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-sub") }}>{item.date} {item.headline}</div>
                  <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: "2px 0 0" }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notices on timeline */}
          {sec.notices.items.length > 0 && (
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "-22px", top: "8px", width: "12px", height: "12px", borderRadius: "50%", background: c("--c-accent"), border: "2px solid #fff", boxShadow: `0 0 0 2px ${c("--c-accent")}` }} />
              <h3 style={{ fontSize: "12px", fontWeight: 800, color: c("--c-accent"), margin: "0 0 6px" }}>{sec.notices.title}</h3>
              {sec.notices.items.map((item, i) => (
                <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "4px" }}>
                  {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
                </div>
              ))}
            </div>
          )}

          {/* Member voices */}
          {sec.memberVoices.items.length > 0 && (
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "-22px", top: "8px", width: "12px", height: "12px", borderRadius: "50%", background: c("--c-main"), border: "2px solid #fff", opacity: 0.6 }} />
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: c("--c-main"), margin: "0 0 4px" }}>{sec.memberVoices.title}</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {sec.memberVoices.items.map((v, i) => (
                  <span key={i} style={{ fontSize: "10px", color: c("--c-text"), background: `color-mix(in srgb, ${c("--c-main")} 6%, white)`, padding: "3px 8px", borderRadius: "6px" }}>
                    {v.name}「{v.comment}」
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "10px", fontSize: "9px", color: c("--c-text"), opacity: 0.5, textAlign: "center", borderTop: `1px solid color-mix(in srgb, ${c("--c-main")} 15%, white)`, paddingTop: "6px" }}>
        {sec.editorNote.body} ／ {sec.editor.name} ／ {data.clubName}
      </div>
    </div>
  );
}

export function EventTemplate(props: TemplateProps) {
  switch (props.variant) {
    case 2: return <EventVariant2 {...props} />;
    case 3: return <EventVariant3 {...props} />;
    default: return <EventVariant1 {...props} />;
  }
}
