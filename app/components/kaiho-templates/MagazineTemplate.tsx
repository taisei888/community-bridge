import type { TemplateProps } from "./types";
import { SeasonDecoration } from "./SeasonDecorations";

const c = (v: string) => `var(${v})`;

const PhotoOrPlaceholder = ({ photo, index, style }: { photo?: string; index: number; style?: React.CSSProperties }) => (
  <div style={{ borderRadius: "4px", overflow: "hidden", background: "#eee", ...style }}>
    {photo ? (
      <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : (
      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, color-mix(in srgb, ${c("--c-main")} 8%, white), color-mix(in srgb, ${c("--c-sub")} 8%, white))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "10px", color: c("--c-main"), opacity: 0.4 }}>PHOTO</span>
      </div>
    )}
  </div>
);

/* ===== Variant 1: 2段組み新聞風 ===== */
function MagazineVariant1({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px 28px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Newspaper-style header */}
      <div style={{ textAlign: "center", borderBottom: `3px double ${c("--c-main")}`, paddingBottom: "12px", marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", color: c("--c-text"), opacity: 0.5, marginBottom: "4px", letterSpacing: "3px" }}>{data.issueLabel}　{data.publishDate}</div>
        <h1 style={{ fontSize: "32px", fontWeight: 900, color: c("--c-main"), margin: "0 0 4px", letterSpacing: "6px" }}>{data.title}</h1>
        <p style={{ fontSize: "12px", color: c("--c-text"), opacity: 0.6, margin: 0, letterSpacing: "2px" }}>{data.subtitle}</p>
      </div>

      {/* 2-column newspaper layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", minHeight: 0 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", borderRight: `1px solid color-mix(in srgb, ${c("--c-main")} 15%, white)`, paddingRight: "18px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 800, color: c("--c-main"), margin: "0 0 10px", borderBottom: `2px solid ${c("--c-main")}`, paddingBottom: "4px" }}>
            {sec.activityReport.title}
          </h2>
          {sec.activityReport.items.map((item, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: c("--c-text"), marginBottom: "4px" }}>
                <span style={{ color: c("--c-main"), marginRight: "6px" }}>{item.date}</span>{item.headline}
              </div>
              <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "100%", height: "140px", marginBottom: "6px" }} />
              <p style={{ fontSize: "11px", lineHeight: 1.8, color: c("--c-text"), margin: 0, textAlign: "justify" }}>{item.body}</p>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Schedule */}
          <h2 style={{ fontSize: "14px", fontWeight: 800, color: c("--c-sub"), margin: "0 0 8px", borderBottom: `2px solid ${c("--c-sub")}`, paddingBottom: "4px" }}>
            {sec.nextSchedule.title}
          </h2>
          {sec.nextSchedule.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "11px", color: c("--c-text") }}>
              <span style={{ fontWeight: 700, color: c("--c-sub"), whiteSpace: "nowrap" }}>{item.date}</span>
              <span>{item.event}</span>
            </div>
          ))}

          {/* Divider */}
          <div style={{ borderTop: `1px solid color-mix(in srgb, ${c("--c-main")} 15%, white)`, margin: "10px 0" }} />

          {/* Notices */}
          {sec.notices.items.length > 0 && (
            <>
              <h2 style={{ fontSize: "14px", fontWeight: 800, color: c("--c-accent"), margin: "0 0 8px", borderBottom: `2px solid ${c("--c-accent")}`, paddingBottom: "4px" }}>
                {sec.notices.title}
              </h2>
              {sec.notices.items.map((item, i) => (
                <div key={i} style={{ fontSize: "11px", lineHeight: 1.7, color: c("--c-text"), marginBottom: "6px" }}>
                  {item.headline && <span style={{ fontWeight: 700 }}>■ {item.headline}　</span>}{item.body}
                </div>
              ))}
            </>
          )}

          {/* Divider */}
          <div style={{ borderTop: `1px solid color-mix(in srgb, ${c("--c-main")} 15%, white)`, margin: "10px 0" }} />

          {/* Member voices */}
          {sec.memberVoices.items.length > 0 && (
            <>
              <h2 style={{ fontSize: "13px", fontWeight: 800, color: c("--c-main"), margin: "0 0 8px" }}>{sec.memberVoices.title}</h2>
              {sec.memberVoices.items.map((v, i) => (
                <div key={i} style={{ fontSize: "11px", color: c("--c-text"), marginBottom: "6px" }}>
                  <span style={{ fontWeight: 700 }}>{v.name}</span>：「{v.comment}」
                </div>
              ))}
            </>
          )}

          {/* Extra box */}
          {sec.extraBox && sec.extraBox.title && (
            <div style={{ marginTop: "auto", background: `color-mix(in srgb, ${c("--c-sub")} 8%, white)`, padding: "10px", borderRadius: "4px", border: `1px solid color-mix(in srgb, ${c("--c-sub")} 20%, white)` }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-sub"), marginBottom: "4px" }}>{sec.extraBox.title}</div>
              <p style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), margin: 0 }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "12px", borderTop: `2px solid ${c("--c-main")}`, paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "9px", color: c("--c-text"), opacity: 0.5 }}>
        <span>{sec.editorNote.body}</span>
        <span>{sec.editor.title}：{sec.editor.name} ／ {data.clubName}</span>
      </div>
    </div>
  );
}

/* ===== Variant 2: 3段組みニュースレター風 ===== */
function MagazineVariant2({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px 24px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Header - horizontal rule style */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <div style={{ borderTop: `2px solid ${c("--c-main")}`, borderBottom: `2px solid ${c("--c-main")}`, padding: "10px 0", margin: "0 40px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: c("--c-main"), margin: 0, letterSpacing: "4px" }}>{data.title}</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "6px", fontSize: "10px", color: c("--c-text"), opacity: 0.5 }}>
          <span>{data.issueLabel}</span>
          <span>{data.publishDate}</span>
          <span>{data.clubName}</span>
        </div>
      </div>

      {/* 3-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", minHeight: 0 }}>
        {/* Col 1: First activity + photo */}
        <div style={{ borderRight: `1px solid color-mix(in srgb, ${c("--c-main")} 12%, white)`, paddingRight: "12px" }}>
          <h3 style={{ fontSize: "12px", fontWeight: 800, color: c("--c-main"), margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "1px" }}>{sec.activityReport.title}</h3>
          {sec.activityReport.items.slice(0, 2).map((item, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <PhotoOrPlaceholder photo={photos[i]} index={i} style={{ width: "100%", height: "120px", marginBottom: "6px" }} />
              <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-text"), marginBottom: "2px" }}>
                {item.date} {item.headline}
              </div>
              <p style={{ fontSize: "10px", lineHeight: 1.7, color: c("--c-text"), margin: 0, textAlign: "justify" }}>{item.body}</p>
            </div>
          ))}
        </div>

        {/* Col 2: More activities + Schedule */}
        <div style={{ borderRight: `1px solid color-mix(in srgb, ${c("--c-main")} 12%, white)`, paddingRight: "12px" }}>
          {sec.activityReport.items.slice(2).map((item, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-text"), marginBottom: "2px" }}>
                {item.date} {item.headline}
              </div>
              <p style={{ fontSize: "10px", lineHeight: 1.7, color: c("--c-text"), margin: 0 }}>{item.body}</p>
            </div>
          ))}
          <div style={{ borderTop: `1px solid color-mix(in srgb, ${c("--c-sub")} 20%, white)`, paddingTop: "8px", marginTop: "8px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 800, color: c("--c-sub"), margin: "0 0 6px" }}>{sec.nextSchedule.title}</h3>
            {sec.nextSchedule.items.map((item, i) => (
              <div key={i} style={{ fontSize: "10px", color: c("--c-text"), marginBottom: "5px" }}>
                <span style={{ fontWeight: 700, color: c("--c-sub") }}>{item.date}</span> {item.event}
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Notices + Voices + Extra */}
        <div>
          {sec.notices.items.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <h3 style={{ fontSize: "12px", fontWeight: 800, color: c("--c-accent"), margin: "0 0 6px" }}>{sec.notices.title}</h3>
              {sec.notices.items.map((item, i) => (
                <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "5px" }}>
                  {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
                </div>
              ))}
            </div>
          )}
          <div style={{ borderTop: `1px solid color-mix(in srgb, ${c("--c-main")} 12%, white)`, paddingTop: "8px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 800, color: c("--c-main"), margin: "0 0 6px" }}>{sec.memberVoices.title}</h3>
            {sec.memberVoices.items.map((v, i) => (
              <div key={i} style={{ fontSize: "10px", color: c("--c-text"), marginBottom: "6px" }}>
                <span style={{ fontWeight: 700 }}>{v.name}</span>「{v.comment}」
              </div>
            ))}
          </div>
          {sec.extraBox && sec.extraBox.title && (
            <div style={{ marginTop: "10px", padding: "8px", background: `color-mix(in srgb, ${c("--c-sub")} 6%, white)`, borderRadius: "4px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-sub") }}>{sec.extraBox.title}</div>
              <p style={{ fontSize: "9px", lineHeight: 1.6, color: c("--c-text"), margin: "3px 0 0" }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "10px", borderTop: `1px solid ${c("--c-main")}`, paddingTop: "6px", fontSize: "9px", color: c("--c-text"), opacity: 0.5, textAlign: "center" }}>
        {sec.editorNote.body} ／ {sec.editor.title}：{sec.editor.name}
      </div>
    </div>
  );
}

/* ===== Variant 3: 雑誌見開き風 ===== */
function MagazineVariant3({ data, photos }: TemplateProps) {
  const sec = data.sections;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px" }}>
      <SeasonDecoration season={data.seasonTheme} />

      {/* Magazine-style header with large feature */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "14px", marginBottom: "14px" }}>
        {/* Featured article */}
        <div style={{ position: "relative" }}>
          <PhotoOrPlaceholder photo={photos[0]} index={0} style={{ width: "100%", height: "180px" }} />
          <div style={{ position: "absolute", bottom: "8px", left: "8px", background: c("--c-main"), color: "#fff", padding: "3px 10px", borderRadius: "3px", fontSize: "10px", fontWeight: 700 }}>
            {sec.activityReport.items[0]?.headline || data.title}
          </div>
        </div>
        {/* Title + meta */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "10px", color: c("--c-main"), fontWeight: 700, marginBottom: "4px" }}>{data.issueLabel}</div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: c("--c-main"), margin: "0 0 6px", lineHeight: 1.2 }}>{data.title}</h1>
          <p style={{ fontSize: "11px", color: c("--c-text"), opacity: 0.6, margin: "0 0 8px" }}>{data.subtitle}</p>
          <div style={{ fontSize: "10px", color: c("--c-text"), opacity: 0.4 }}>{data.publishDate} / {data.clubName}</div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "14px", minHeight: 0 }}>
        {/* Left: articles */}
        <div>
          <h2 style={{ fontSize: "13px", fontWeight: 800, color: c("--c-main"), margin: "0 0 8px", borderLeft: `4px solid ${c("--c-main")}`, paddingLeft: "8px" }}>{sec.activityReport.title}</h2>
          {sec.activityReport.items.map((item, i) => (
            <div key={i} style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: `1px solid color-mix(in srgb, ${c("--c-main")} 10%, white)` }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {photos[i + 1] && <PhotoOrPlaceholder photo={photos[i + 1]} index={i + 1} style={{ width: "80px", height: "60px", flexShrink: 0 }} />}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: c("--c-text") }}>{item.date} {item.headline}</div>
                  <p style={{ fontSize: "10px", lineHeight: 1.7, color: c("--c-text"), margin: "3px 0 0" }}>{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Schedule box */}
          <div style={{ background: `color-mix(in srgb, ${c("--c-sub")} 8%, white)`, padding: "10px", borderRadius: "6px", borderLeft: `3px solid ${c("--c-sub")}` }}>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: c("--c-sub"), margin: "0 0 6px" }}>{sec.nextSchedule.title}</h3>
            {sec.nextSchedule.items.map((item, i) => (
              <div key={i} style={{ fontSize: "10px", color: c("--c-text"), marginBottom: "4px" }}>
                <span style={{ fontWeight: 700 }}>{item.date}</span> {item.event}
              </div>
            ))}
          </div>

          {/* Notices */}
          {sec.notices.items.length > 0 && (
            <div style={{ background: `color-mix(in srgb, ${c("--c-accent")} 8%, white)`, padding: "10px", borderRadius: "6px", borderLeft: `3px solid ${c("--c-accent")}` }}>
              <h3 style={{ fontSize: "12px", fontWeight: 700, color: c("--c-accent"), margin: "0 0 6px" }}>{sec.notices.title}</h3>
              {sec.notices.items.map((item, i) => (
                <div key={i} style={{ fontSize: "10px", lineHeight: 1.6, color: c("--c-text"), marginBottom: "4px" }}>
                  {item.headline && <span style={{ fontWeight: 700 }}>{item.headline} </span>}{item.body}
                </div>
              ))}
            </div>
          )}

          {/* Voices */}
          {sec.memberVoices.items.length > 0 && (
            <div style={{ padding: "10px", borderRadius: "6px", border: `1px solid color-mix(in srgb, ${c("--c-main")} 15%, white)` }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: c("--c-main"), margin: "0 0 6px" }}>{sec.memberVoices.title}</h3>
              {sec.memberVoices.items.map((v, i) => (
                <div key={i} style={{ fontSize: "10px", color: c("--c-text"), marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700 }}>{v.name}</span>「{v.comment}」
                </div>
              ))}
            </div>
          )}

          {sec.extraBox && sec.extraBox.title && (
            <div style={{ padding: "8px", background: `color-mix(in srgb, ${c("--c-sub")} 6%, white)`, borderRadius: "6px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c("--c-sub") }}>{sec.extraBox.title}</div>
              <p style={{ fontSize: "9px", lineHeight: 1.5, color: c("--c-text"), margin: "3px 0 0" }}>{sec.extraBox.body}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "10px", paddingTop: "6px", borderTop: `1px solid color-mix(in srgb, ${c("--c-main")} 20%, white)`, fontSize: "9px", color: c("--c-text"), opacity: 0.5, display: "flex", justifyContent: "space-between" }}>
        <span>{sec.editorNote.body}</span>
        <span>{sec.editor.name}</span>
      </div>
    </div>
  );
}

export function MagazineTemplate(props: TemplateProps) {
  switch (props.variant) {
    case 2: return <MagazineVariant2 {...props} />;
    case 3: return <MagazineVariant3 {...props} />;
    default: return <MagazineVariant1 {...props} />;
  }
}
