"use client";

import { useState, useRef, type CSSProperties } from "react";

/* ===== Types for new JSON structure ===== */
type ActivityItem = { date: string; headline: string; body: string; photoSuggestion?: string; iconSuggestion?: string };
type ScheduleItem = { date: string; event: string; description?: string };
type MemberVoice = { name: string; comment: string };
type KaihoData = {
  title: string;
  subtitle: string;
  issueLabel: string;
  publishDate: string;
  clubName: string;
  themeColor: { main: string; sub: string; accent: string; background: string };
  designDirection: string;
  sections: {
    activityReport: { title: string; items: ActivityItem[] };
    nextSchedule: { title: string; items: ScheduleItem[] };
    notices: { title: string; items: string[] };
    memberVoices: { title: string; items: MemberVoice[] };
    editorNote: { title: string; body: string };
    editor: { title: string; name: string };
  };
};

const INITIAL_FORM = {
  clubName: "", issueDate: "", activityReport: "", nextSchedule: "",
  announcements: "", memberVoice: "", editorName: "",
};

const FIELDS: { key: keyof typeof INITIAL_FORM; label: string; multi?: boolean; placeholder: string; required?: boolean }[] = [
  { key: "clubName", label: "クラブ名", placeholder: "さくら長寿会", required: true },
  { key: "issueDate", label: "発行号", placeholder: "2026年7月号", required: true },
  { key: "activityReport", label: "今月の活動報告", multi: true, placeholder: "7/5 グラウンドゴルフ大会（参加者32名）\n7/12 健康体操教室を開催" },
  { key: "nextSchedule", label: "来月の予定", multi: true, placeholder: "8/3 納涼祭\n8/10 カラオケ大会" },
  { key: "announcements", label: "お知らせ", multi: true, placeholder: "会費の納入期限は8/15です" },
  { key: "memberVoice", label: "会員のひとこと", multi: true, placeholder: '山田さん「孫が遊びに来てうれしかった」' },
  { key: "editorName", label: "編集責任者", placeholder: "田中太郎" },
];

const cardBase: CSSProperties = {
  background: "#fff", borderRadius: "16px",
  border: "1px solid #E2E4E9",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
};

const inputStyle: CSSProperties = {
  width: "100%", border: "1px solid #D5D7DC", borderRadius: "10px",
  padding: "10px 14px", fontSize: "15px", color: "#1a1a1a",
  background: "#FAFBFC", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
};

const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; e.target.style.background = "#fff";
};
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "#D5D7DC"; e.target.style.boxShadow = "none"; e.target.style.background = "#FAFBFC";
};

/* ===== Color palette for newsletter ===== */
const NL = {
  bg: "#FDF8F0",
  cream: "#FAF5EB",
  green: "#7BAE5E",
  greenLight: "#EAF3E1",
  greenDark: "#4D7A35",
  orange: "#E8A849",
  orangeLight: "#FFF3E0",
  blue: "#7EB8D8",
  blueLight: "#E8F4FA",
  pink: "#E8A0B4",
  pinkLight: "#FDE8EF",
  border: "#DDD5C8",
  cardBg: "#FFFFFF",
  text: "#3D3D3D",
  textSub: "#777777",
};

export default function KaihoGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [photos, setPhotos] = useState<string[]>([]);
  const [kaiho, setKaiho] = useState<KaihoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos = [...photos];
    Array.from(files).forEach((file) => {
      if (newPhotos.length >= 4) return;
      const reader = new FileReader();
      reader.onload = () => { newPhotos.push(reader.result as string); setPhotos([...newPhotos]); };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => setPhotos(photos.filter((_, i) => i !== idx));

  const generate = async () => {
    if (!form.clubName || !form.issueDate) { setError("クラブ名と発行号は必須です"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "生成失敗"); }
      setKaiho(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "エラー"); }
    finally { setLoading(false); }
  };

  const downloadPptx = async () => {
    if (!kaiho) return;
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: "A4", width: 7.5, height: 10.63 });
    pptx.layout = "A4";
    const slide = pptx.addSlide();
    slide.background = { color: "FDF8F0" };

    // Header
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 0.2, w: 6.9, h: 1.4, fill: { color: "EAF3E1" }, rectRadius: 0.15, line: { color: "C8D4B8", width: 1.5 } });
    slide.addText(kaiho.title, { x: 0.5, y: 0.3, w: 6.5, h: 0.7, fontSize: 26, bold: true, color: "4D7A35", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(kaiho.subtitle, { x: 0.5, y: 0.95, w: 6.5, h: 0.35, fontSize: 11, color: "7BAE5E", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(`${kaiho.issueLabel || ""} ${kaiho.publishDate || ""}`, { x: 0.5, y: 1.25, w: 6.5, h: 0.25, fontSize: 9, color: "777777", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    let y = 1.85;
    // Photos
    if (photos.length > 0) {
      const pw = photos.length <= 2 ? 3.0 : 2.1;
      const ph = pw * 0.6;
      const tw = pw * photos.length + 0.12 * (photos.length - 1);
      let px = (7.5 - tw) / 2;
      photos.forEach((p) => { slide.addImage({ data: p, x: px, y, w: pw, h: ph, rounding: true }); px += pw + 0.12; });
      y += ph + 0.2;
    }

    // Activity Report
    const sec = kaiho.sections;
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 6.7, h: 0.32, fill: { color: "EAF3E1" }, rectRadius: 0.05 });
    slide.addText(sec.activityReport.title, { x: 0.55, y, w: 6.4, h: 0.32, fontSize: 12, bold: true, color: "4D7A35", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
    y += 0.38;
    sec.activityReport.items.forEach((item) => {
      const text = `${item.date} ${item.headline}\n${item.body}`;
      const lines = text.split("\n").length;
      const h = Math.min(Math.max(lines * 0.2, 0.4), 1.2);
      slide.addText(text, { x: 0.55, y, w: 6.4, h, fontSize: 10, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN", valign: "top", lineSpacingMultiple: 1.4 });
      y += h + 0.08;
    });
    y += 0.1;

    // Schedule
    if (y < 8.5) {
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 6.7, h: 0.32, fill: { color: "E8F4FA" }, rectRadius: 0.05 });
      slide.addText(sec.nextSchedule.title, { x: 0.55, y, w: 6.4, h: 0.32, fontSize: 12, bold: true, color: "3A7FA8", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
      y += 0.38;
      sec.nextSchedule.items.forEach((item) => {
        slide.addText(`${item.date}  ${item.event}`, { x: 0.55, y, w: 6.4, h: 0.24, fontSize: 10, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
        y += 0.26;
      });
      y += 0.1;
    }

    // Notices
    if (y < 8.5 && sec.notices.items.length > 0) {
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 6.7, h: 0.32, fill: { color: "FFF3E0" }, rectRadius: 0.05 });
      slide.addText(sec.notices.title, { x: 0.55, y, w: 6.4, h: 0.32, fontSize: 12, bold: true, color: "B8862D", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
      y += 0.38;
      sec.notices.items.forEach((item) => {
        slide.addText(`・${item}`, { x: 0.55, y, w: 6.4, h: 0.24, fontSize: 10, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
        y += 0.26;
      });
      y += 0.1;
    }

    // Footer
    slide.addText(`${sec.editorNote.body}`, { x: 0.5, y: 9.8, w: 5.5, h: 0.35, fontSize: 8, color: "777777", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(`編集: ${sec.editor.name}`, { x: 6.0, y: 9.8, w: 1.2, h: 0.35, fontSize: 8, color: "777777", align: "right", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(`発行: ${kaiho.clubName} / ${kaiho.publishDate}`, { x: 0.5, y: 10.15, w: 6.5, h: 0.25, fontSize: 7, color: "AAAAAA", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    await pptx.writeFile({ fileName: `${kaiho.title}.pptx` });
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: NL.bg });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`${kaiho?.title || "会報"}.pdf`);
  };

  /* ===== Section Card Component ===== */
  const SectionCard = ({ title, color, bgColor, children, style }: {
    title: string; color: string; bgColor: string; children: React.ReactNode; style?: CSSProperties;
  }) => (
    <div style={{
      background: NL.cardBg, borderRadius: "14px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      overflow: "hidden", ...style,
    }}>
      <div style={{
        background: bgColor, padding: "10px 20px",
        display: "flex", alignItems: "center", gap: "10px",
        borderBottom: `1px solid ${bgColor}`,
      }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, flexShrink: 0 }} />
        <h3 style={{ fontSize: "17px", fontWeight: 700, color, margin: 0, letterSpacing: "0.5px" }}>{title}</h3>
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "start" }}>
      {/* ===== Form ===== */}
      <div style={{ ...cardBase, position: "sticky", top: "76px" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F0F1F3" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>会報情報を入力</h2>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>
                {f.label}{f.required && <span style={{ color: "#2563EB", marginLeft: "4px" }}>*</span>}
              </label>
              {f.multi ? (
                <textarea name={f.key} value={form[f.key]} onChange={set} placeholder={f.placeholder} rows={2}
                  style={{ ...inputStyle, resize: "none" }} onFocus={focusIn} onBlur={focusOut} />
              ) : (
                <input type="text" name={f.key} value={form[f.key]} onChange={set} placeholder={f.placeholder}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              )}
            </div>
          ))}
          {/* Photo Upload */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>写真（最大4枚）</label>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: "none" }} />
            <button type="button" onClick={() => fileRef.current?.click()}
              style={{ width: "100%", padding: "12px", border: "2px dashed #D5D7DC", borderRadius: "10px", background: "#FAFBFC", color: "#888", fontSize: "14px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.color = "#2563EB"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#D5D7DC"; e.currentTarget.style.color = "#888"; }}>
              + 写真を追加
            </button>
            {photos.length > 0 && (
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: "relative", width: "76px", height: "76px" }}>
                    <img src={p} alt="" style={{ width: "76px", height: "76px", objectFit: "cover", borderRadius: "8px", border: "1px solid #E2E4E9" }} />
                    <button onClick={() => removePhoto(i)} style={{
                      position: "absolute", top: "-6px", right: "-6px", width: "20px", height: "20px", borderRadius: "50%",
                      background: "#EF4444", color: "#fff", border: "2px solid #fff", fontSize: "11px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
                    }}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "10px 14px", color: "#DC2626", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}
          <button onClick={generate} disabled={loading} style={{
            width: "100%", padding: "12px", border: "none", borderRadius: "10px",
            background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            color: "#fff", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)", transition: "all 0.15s",
          }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{ width: "18px", height: "18px", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
                生成中...
              </span>
            ) : "会報を生成"}
          </button>
        </div>
      </div>

      {/* ===== Preview ===== */}
      <div>
        {kaiho ? (
          <div style={{ animation: "fadeUp 0.4s ease-out" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {[{ label: "PPTX", fn: downloadPptx }, { label: "PDF", fn: downloadPdf }].map((b) => (
                <button key={b.label} onClick={b.fn} style={{
                  flex: 1, padding: "10px", border: "1px solid #D5D7DC", borderRadius: "10px",
                  background: "#fff", color: "#333", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  {b.label}でダウンロード
                </button>
              ))}
            </div>

            {/* ===== A4 Preview ===== */}
            <div style={{ ...cardBase, overflow: "hidden" }}>
              <div
                ref={previewRef}
                style={{
                  width: "210mm", minHeight: "297mm", position: "relative",
                  transformOrigin: "top left", transform: "scale(0.55)",
                  marginBottom: "calc(-297mm * 0.45)", marginRight: "calc(-210mm * 0.45)",
                  background: NL.bg, overflow: "hidden",
                  fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif",
                }}
              >
                {/* Corner decorations */}
                {[
                  { top: "14px", left: "14px", borderTop: `3px solid ${NL.green}`, borderLeft: `3px solid ${NL.green}`, borderRadius: "10px 0 0 0" },
                  { top: "14px", right: "14px", borderTop: `3px solid ${NL.green}`, borderRight: `3px solid ${NL.green}`, borderRadius: "0 10px 0 0" },
                  { bottom: "14px", left: "14px", borderBottom: `3px solid ${NL.green}`, borderLeft: `3px solid ${NL.green}`, borderRadius: "0 0 0 10px" },
                  { bottom: "14px", right: "14px", borderBottom: `3px solid ${NL.green}`, borderRight: `3px solid ${NL.green}`, borderRadius: "0 0 10px 0" },
                ].map((s, i) => (
                  <div key={i} style={{ position: "absolute", width: "45px", height: "45px", opacity: 0.35, ...s } as CSSProperties} />
                ))}

                {/* ===== HEADER ===== */}
                <div style={{ padding: "32px 40px 22px", textAlign: "center", position: "relative" }}>
                  {/* Issue label badge */}
                  <div style={{
                    display: "inline-block", background: NL.green, color: "#fff",
                    borderRadius: "20px", padding: "4px 20px", fontSize: "13px", fontWeight: 600,
                    marginBottom: "12px", letterSpacing: "0.5px",
                  }}>
                    {kaiho.issueLabel || form.issueDate}
                  </div>

                  <h1 style={{
                    fontSize: "38px", fontWeight: 800, color: NL.greenDark,
                    letterSpacing: "6px", marginBottom: "10px", lineHeight: 1.3,
                  }}>
                    {kaiho.title}
                  </h1>

                  <p style={{
                    fontSize: "15px", color: NL.green, letterSpacing: "2px", fontWeight: 500,
                    background: NL.greenLight, display: "inline-block", padding: "4px 24px",
                    borderRadius: "20px",
                  }}>
                    {kaiho.subtitle}
                  </p>

                  {/* Publish date badge */}
                  <div style={{
                    position: "absolute", top: "24px", right: "40px",
                    background: NL.cardBg, border: `1.5px solid ${NL.border}`,
                    borderRadius: "10px", padding: "8px 16px", textAlign: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{ fontSize: "10px", color: NL.textSub, letterSpacing: "1px" }}>発行日</div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: NL.greenDark, marginTop: "2px" }}>
                      {kaiho.publishDate || form.issueDate}
                    </div>
                  </div>
                </div>

                {/* ===== Photos ===== */}
                {photos.length > 0 && (
                  <div style={{
                    padding: "0 36px 16px",
                    display: "grid",
                    gridTemplateColumns: photos.length === 1 ? "1fr" : photos.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr",
                    gap: "10px",
                  }}>
                    {photos.map((p, i) => (
                      <img key={i} src={p} alt="" style={{
                        width: "100%", height: photos.length === 1 ? "200px" : "140px",
                        objectFit: "cover", borderRadius: "12px",
                        border: `2px solid ${NL.border}`,
                      }} />
                    ))}
                  </div>
                )}

                {/* ===== MAIN CONTENT - 2 Column ===== */}
                <div style={{ padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Left Column: Activity Report */}
                  <SectionCard title={kaiho.sections.activityReport.title} color={NL.greenDark} bgColor={NL.greenLight}>
                    {kaiho.sections.activityReport.items.map((item, i) => (
                      <div key={i} style={{
                        marginBottom: i < kaiho.sections.activityReport.items.length - 1 ? "14px" : 0,
                        paddingBottom: i < kaiho.sections.activityReport.items.length - 1 ? "14px" : 0,
                        borderBottom: i < kaiho.sections.activityReport.items.length - 1 ? `1px dashed ${NL.border}` : "none",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          {item.date && (
                            <span style={{
                              background: NL.orangeLight, color: "#B8862D",
                              fontSize: "11px", fontWeight: 600, padding: "2px 10px",
                              borderRadius: "12px", whiteSpace: "nowrap",
                            }}>{item.date}</span>
                          )}
                          <span style={{ fontSize: "15px", fontWeight: 700, color: NL.greenDark }}>{item.headline}</span>
                        </div>
                        <p style={{ fontSize: "14px", lineHeight: 1.9, color: NL.text, margin: 0 }}>{item.body}</p>
                        {item.photoSuggestion && (
                          <div style={{
                            marginTop: "6px", fontSize: "11px", color: NL.blue,
                            background: NL.blueLight, padding: "3px 10px", borderRadius: "8px",
                            display: "inline-block",
                          }}>
                            {item.photoSuggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </SectionCard>

                  {/* Right Column: Schedule + Notices */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Schedule */}
                    <SectionCard title={kaiho.sections.nextSchedule.title} color="#3A7FA8" bgColor={NL.blueLight}>
                      {kaiho.sections.nextSchedule.items.map((item, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "baseline", gap: "10px",
                          marginBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? "10px" : 0,
                          paddingBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? "10px" : 0,
                          borderBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? `1px dotted ${NL.border}` : "none",
                        }}>
                          <span style={{
                            background: NL.blueLight, color: "#3A7FA8",
                            fontSize: "12px", fontWeight: 700, padding: "2px 10px",
                            borderRadius: "10px", whiteSpace: "nowrap", flexShrink: 0,
                          }}>{item.date}</span>
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: NL.text }}>{item.event}</span>
                            {item.description && (
                              <p style={{ fontSize: "12px", color: NL.textSub, margin: "2px 0 0" }}>{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </SectionCard>

                    {/* Notices */}
                    {kaiho.sections.notices.items.length > 0 && (
                      <SectionCard title={kaiho.sections.notices.title} color="#B8862D" bgColor={NL.orangeLight}>
                        {kaiho.sections.notices.items.map((item, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "flex-start", gap: "8px",
                            marginBottom: i < kaiho.sections.notices.items.length - 1 ? "10px" : 0,
                          }}>
                            <span style={{ color: NL.orange, fontSize: "16px", lineHeight: 1.4, flexShrink: 0 }}>●</span>
                            <p style={{ fontSize: "14px", lineHeight: 1.8, color: NL.text, margin: 0 }}>{item}</p>
                          </div>
                        ))}
                      </SectionCard>
                    )}
                  </div>
                </div>

                {/* ===== Member Voices - Full Width ===== */}
                {kaiho.sections.memberVoices.items.length > 0 && (
                  <div style={{ padding: "16px 32px 0" }}>
                    <SectionCard title={kaiho.sections.memberVoices.title} color="#C25A7C" bgColor={NL.pinkLight}>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: kaiho.sections.memberVoices.items.length === 1 ? "1fr" : "1fr 1fr",
                        gap: "12px",
                      }}>
                        {kaiho.sections.memberVoices.items.map((v, i) => (
                          <div key={i} style={{
                            background: "#FFF9FB", borderRadius: "10px",
                            padding: "12px 16px", border: `1px solid ${NL.pinkLight}`,
                          }}>
                            <div style={{
                              fontSize: "13px", fontWeight: 700, color: "#C25A7C",
                              marginBottom: "4px",
                            }}>{v.name}</div>
                            <p style={{
                              fontSize: "14px", lineHeight: 1.8, color: NL.text,
                              margin: 0, fontStyle: "italic",
                            }}>
                              「{v.comment}」
                            </p>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  </div>
                )}

                {/* ===== Footer: Editor Note + Editor ===== */}
                <div style={{ padding: "16px 32px 50px", display: "grid", gridTemplateColumns: "1fr auto", gap: "14px", alignItems: "stretch" }}>
                  {/* Editor Note */}
                  <div style={{
                    background: NL.cream, borderRadius: "12px",
                    border: `1.5px solid ${NL.border}`, padding: "16px 20px",
                  }}>
                    <div style={{
                      fontSize: "14px", fontWeight: 700, color: NL.greenDark,
                      marginBottom: "8px", borderBottom: `2px solid ${NL.greenLight}`,
                      paddingBottom: "6px", display: "inline-block", letterSpacing: "2px",
                    }}>
                      {kaiho.sections.editorNote.title}
                    </div>
                    <p style={{ fontSize: "13px", lineHeight: 2, color: NL.text, margin: 0 }}>
                      {kaiho.sections.editorNote.body}
                    </p>
                  </div>
                  {/* Editor Name */}
                  <div style={{
                    background: NL.cardBg, borderRadius: "12px",
                    border: `1.5px solid ${NL.border}`, padding: "16px 28px",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    minWidth: "150px",
                  }}>
                    <div style={{ fontSize: "11px", color: NL.textSub, letterSpacing: "2px", marginBottom: "6px" }}>
                      {kaiho.sections.editor.title}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: NL.greenDark }}>
                      {kaiho.sections.editor.name}
                    </div>
                  </div>
                </div>

                {/* Club info footer line */}
                <div style={{
                  position: "absolute", bottom: "20px", left: 0, right: 0,
                  textAlign: "center", fontSize: "11px", color: NL.textSub, letterSpacing: "1px",
                }}>
                  発行：{kaiho.clubName} / {kaiho.publishDate}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ ...cardBase, padding: "80px 40px", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#F0F1F3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#555", marginBottom: "4px" }}>プレビュー</p>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>左のフォームに情報を入力して「会報を生成」を押してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
