"use client";

import { useState, useRef, type CSSProperties } from "react";

/* ===== Types ===== */
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

/* ===== A4 Constants ===== */
const A4_W = 794;
const A4_H = 1123;
const SCALE = 0.52;

/* ===== Newsletter Colors ===== */
const NL = {
  bg: "#FBF7EC",
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
      const data = await res.json();
      // Normalize notices.items: API may return {body:string}[] instead of string[]
      if (data.sections?.notices?.items) {
        data.sections.notices.items = data.sections.notices.items.map(
          (item: string | { body?: string; text?: string }) =>
            typeof item === "string" ? item : (item.body || item.text || JSON.stringify(item))
        );
      }
      setKaiho(data);
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
    slide.background = { color: "FBF7EC" };

    // Header
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 0.2, w: 6.9, h: 1.2, fill: { color: "EAF3E1" }, rectRadius: 0.15, line: { color: "C8D4B8", width: 1 } });
    slide.addText(kaiho.issueLabel || form.issueDate, { x: 0.5, y: 0.28, w: 2, h: 0.25, fontSize: 9, color: "FFFFFF", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 0.25, w: 1.5, h: 0.25, fill: { color: "7BAE5E" }, rectRadius: 0.12 });
    slide.addText(kaiho.issueLabel || form.issueDate, { x: 0.5, y: 0.25, w: 1.4, h: 0.25, fontSize: 8, color: "FFFFFF", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(kaiho.title, { x: 0.5, y: 0.55, w: 6.5, h: 0.55, fontSize: 24, bold: true, color: "4D7A35", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(kaiho.subtitle, { x: 0.5, y: 1.05, w: 6.5, h: 0.25, fontSize: 10, color: "7BAE5E", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    let y = 1.65;
    const sec = kaiho.sections;

    // Activity Report
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y, w: 3.2, h: 0.3, fill: { color: "EAF3E1" }, rectRadius: 0.05 });
    slide.addText(sec.activityReport.title, { x: 0.55, y, w: 3, h: 0.3, fontSize: 11, bold: true, color: "4D7A35", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
    let ay = y + 0.36;
    sec.activityReport.items.forEach((item) => {
      if (ay > 6.5) return;
      slide.addText(`${item.date} ${item.headline}`, { x: 0.5, y: ay, w: 3, h: 0.22, fontSize: 9, bold: true, color: "4D7A35", fontFace: "Hiragino Kaku Gothic ProN" });
      ay += 0.24;
      const lines = item.body.length > 60 ? 3 : 2;
      const h = lines * 0.17;
      slide.addText(item.body, { x: 0.5, y: ay, w: 3, h, fontSize: 8, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN", valign: "top", lineSpacingMultiple: 1.3 });
      ay += h + 0.1;
    });

    // Schedule (right column)
    slide.addShape(pptx.ShapeType.roundRect, { x: 3.85, y, w: 3.25, h: 0.3, fill: { color: "E8F4FA" }, rectRadius: 0.05 });
    slide.addText(sec.nextSchedule.title, { x: 4.0, y, w: 3, h: 0.3, fontSize: 11, bold: true, color: "3A7FA8", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
    let sy = y + 0.36;
    sec.nextSchedule.items.forEach((item) => {
      if (sy > 4.5) return;
      slide.addText(`${item.date}  ${item.event}`, { x: 4.0, y: sy, w: 3, h: 0.2, fontSize: 8, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
      sy += 0.24;
    });

    // Notices (right column below schedule)
    if (sec.notices.items.length > 0) {
      sy += 0.15;
      slide.addShape(pptx.ShapeType.roundRect, { x: 3.85, y: sy, w: 3.25, h: 0.3, fill: { color: "FFF3E0" }, rectRadius: 0.05 });
      slide.addText(sec.notices.title, { x: 4.0, y: sy, w: 3, h: 0.3, fontSize: 11, bold: true, color: "B8862D", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
      sy += 0.36;
      sec.notices.items.forEach((item) => {
        if (sy > 6.5) return;
        slide.addText(`・${item}`, { x: 4.0, y: sy, w: 3, h: 0.2, fontSize: 8, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
        sy += 0.24;
      });
    }

    // Member Voices
    const vy = Math.max(ay, sy) + 0.15;
    if (vy < 8.5) {
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: vy, w: 6.7, h: 0.3, fill: { color: "FDE8EF" }, rectRadius: 0.05 });
      slide.addText(sec.memberVoices.title, { x: 0.55, y: vy, w: 6.4, h: 0.3, fontSize: 11, bold: true, color: "C25A7C", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
      let my = vy + 0.36;
      sec.memberVoices.items.forEach((v) => {
        if (my > 9) return;
        slide.addText(`${v.name}：「${v.comment}」`, { x: 0.55, y: my, w: 6.4, h: 0.22, fontSize: 8, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
        my += 0.26;
      });
    }

    // Footer
    slide.addText(`${sec.editorNote.body}`, { x: 0.5, y: 9.6, w: 5.5, h: 0.4, fontSize: 7, color: "777777", fontFace: "Hiragino Kaku Gothic ProN", valign: "top", lineSpacingMultiple: 1.3 });
    slide.addText(`編集: ${sec.editor.name}`, { x: 6.0, y: 9.7, w: 1.2, h: 0.25, fontSize: 8, color: "4D7A35", align: "right", bold: true, fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(`発行: ${kaiho.clubName} / ${kaiho.publishDate}`, { x: 0.5, y: 10.15, w: 6.5, h: 0.2, fontSize: 7, color: "AAAAAA", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    await pptx.writeFile({ fileName: `${kaiho.title}.pptx` });
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: NL.bg });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
    pdf.save(`${kaiho?.title || "会報"}.pdf`);
  };

  /* ===== Section Card ===== */
  const SectionCard = ({ title, color, bgColor, children, maxH }: {
    title: string; color: string; bgColor: string; children: React.ReactNode; maxH?: number;
  }) => (
    <div style={{
      background: NL.cardBg, borderRadius: "10px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      overflow: "hidden",
    }}>
      <div style={{
        background: bgColor, padding: "7px 14px",
        display: "flex", alignItems: "center", gap: "7px",
      }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, flexShrink: 0 }} />
        <h3 style={{ fontSize: "15px", fontWeight: 700, color, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: "10px 14px", maxHeight: maxH ? `${maxH}px` : undefined, overflow: "hidden" }}>
        {children}
      </div>
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
            {/* Download buttons */}
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

            {/* ===== A4 Preview Container ===== */}
            <div style={{
              background: "#D1D5DB", borderRadius: "12px", padding: "24px",
              display: "flex", justifyContent: "center", alignItems: "flex-start",
              minHeight: `${A4_H * SCALE + 48}px`,
            }}>
              {/* A4 Wrapper - scaled */}
              <div style={{
                width: `${A4_W * SCALE}px`,
                height: `${A4_H * SCALE}px`,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 1px 6px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                flexShrink: 0,
              }}>
                {/* A4 Paper - actual size, scaled down via transform */}
                <div
                  ref={previewRef}
                  style={{
                    width: `${A4_W}px`,
                    height: `${A4_H}px`,
                    background: NL.bg,
                    overflow: "hidden",
                    boxSizing: "border-box",
                    transform: `scale(${SCALE})`,
                    transformOrigin: "top left",
                    fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif",
                    position: "relative",
                  }}
                >
                  {/* Corner decorations */}
                  {[
                    { top: 10, left: 10, bT: `2.5px solid ${NL.green}`, bL: `2.5px solid ${NL.green}`, br: "8px 0 0 0" },
                    { top: 10, right: 10, bT: `2.5px solid ${NL.green}`, bR: `2.5px solid ${NL.green}`, br: "0 8px 0 0" },
                    { bottom: 10, left: 10, bB: `2.5px solid ${NL.green}`, bL: `2.5px solid ${NL.green}`, br: "0 0 0 8px" },
                    { bottom: 10, right: 10, bB: `2.5px solid ${NL.green}`, bR: `2.5px solid ${NL.green}`, br: "0 0 8px 0" },
                  ].map((c, i) => (
                    <div key={i} style={{
                      position: "absolute", width: "36px", height: "36px", opacity: 0.3,
                      top: c.top, left: c.left, right: c.right, bottom: c.bottom,
                      borderTop: c.bT, borderLeft: c.bL, borderRight: c.bR, borderBottom: c.bB,
                      borderRadius: c.br,
                    } as CSSProperties} />
                  ))}

                  {/* ===== HEADER ===== */}
                  <div style={{ padding: "24px 32px 16px", textAlign: "center", position: "relative" }}>
                    {/* Issue label - top left */}
                    <div style={{
                      position: "absolute", top: "24px", left: "32px",
                      background: NL.green, color: "#fff",
                      borderRadius: "14px", padding: "3px 14px",
                      fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px",
                    }}>
                      {kaiho.issueLabel || form.issueDate}
                    </div>

                    {/* Publish date - top right */}
                    <div style={{
                      position: "absolute", top: "20px", right: "32px",
                      background: NL.cardBg, border: `1px solid ${NL.border}`,
                      borderRadius: "8px", padding: "5px 12px", textAlign: "center",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}>
                      <div style={{ fontSize: "9px", color: NL.textSub, letterSpacing: "1px" }}>発行日</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: NL.greenDark }}>{kaiho.publishDate || form.issueDate}</div>
                    </div>

                    {/* Title */}
                    <h1 style={{
                      fontSize: "32px", fontWeight: 800, color: NL.greenDark,
                      letterSpacing: "4px", margin: "8px 0 6px", lineHeight: 1.3,
                    }}>
                      {kaiho.title}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                      fontSize: "13px", color: NL.green, letterSpacing: "2px", fontWeight: 500,
                      margin: 0,
                    }}>
                      {kaiho.subtitle}
                    </p>

                    {/* Decorative line */}
                    <div style={{
                      width: "60%", height: "1px", margin: "12px auto 0",
                      background: `linear-gradient(90deg, transparent, ${NL.border}, transparent)`,
                    }} />
                  </div>

                  {/* ===== MAIN CONTENT - 2 Column ===== */}
                  <div style={{ padding: "8px 28px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {/* Left Column: Activity Report */}
                    <SectionCard title={kaiho.sections.activityReport.title} color={NL.greenDark} bgColor={NL.greenLight} maxH={480}>
                      {kaiho.sections.activityReport.items.map((item, i) => (
                        <div key={i} style={{
                          marginBottom: i < kaiho.sections.activityReport.items.length - 1 ? "10px" : 0,
                          paddingBottom: i < kaiho.sections.activityReport.items.length - 1 ? "10px" : 0,
                          borderBottom: i < kaiho.sections.activityReport.items.length - 1 ? `1px dashed ${NL.border}` : "none",
                          display: "flex", gap: "10px",
                        }}>
                          {/* Photo next to activity if available */}
                          {photos[i] && (
                            <img src={photos[i]} alt="" style={{
                              width: "80px", height: "60px", objectFit: "cover",
                              borderRadius: "6px", border: `1px solid ${NL.border}`, flexShrink: 0,
                            }} />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                              {item.date && (
                                <span style={{
                                  background: NL.orangeLight, color: "#B8862D",
                                  fontSize: "10px", fontWeight: 600, padding: "1px 8px",
                                  borderRadius: "10px", whiteSpace: "nowrap",
                                }}>{item.date}</span>
                              )}
                              <span style={{ fontSize: "13px", fontWeight: 700, color: NL.greenDark }}>{item.headline}</span>
                            </div>
                            <p style={{ fontSize: "11.5px", lineHeight: 1.8, color: NL.text, margin: 0 }}>{item.body}</p>
                          </div>
                        </div>
                      ))}
                    </SectionCard>

                    {/* Right Column: Schedule + Notices */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {/* Schedule */}
                      <SectionCard title={kaiho.sections.nextSchedule.title} color="#3A7FA8" bgColor={NL.blueLight} maxH={220}>
                        {kaiho.sections.nextSchedule.items.map((item, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "baseline", gap: "8px",
                            marginBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? "7px" : 0,
                            paddingBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? "7px" : 0,
                            borderBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? `1px dotted ${NL.border}` : "none",
                          }}>
                            <span style={{
                              background: NL.blueLight, color: "#3A7FA8",
                              fontSize: "10px", fontWeight: 700, padding: "1px 8px",
                              borderRadius: "8px", whiteSpace: "nowrap", flexShrink: 0,
                            }}>{item.date}</span>
                            <div>
                              <span style={{ fontSize: "12px", fontWeight: 600, color: NL.text }}>{item.event}</span>
                              {item.description && (
                                <p style={{ fontSize: "10px", color: NL.textSub, margin: "1px 0 0" }}>{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </SectionCard>

                      {/* Notices */}
                      {kaiho.sections.notices.items.length > 0 && (
                        <SectionCard title={kaiho.sections.notices.title} color="#B8862D" bgColor={NL.orangeLight} maxH={200}>
                          {kaiho.sections.notices.items.map((item, i) => (
                            <div key={i} style={{
                              display: "flex", alignItems: "flex-start", gap: "6px",
                              marginBottom: i < kaiho.sections.notices.items.length - 1 ? "6px" : 0,
                            }}>
                              <span style={{ color: NL.orange, fontSize: "10px", lineHeight: 1.6, flexShrink: 0 }}>●</span>
                              <p style={{ fontSize: "12px", lineHeight: 1.7, color: NL.text, margin: 0 }}>{item}</p>
                            </div>
                          ))}
                        </SectionCard>
                      )}
                    </div>
                  </div>

                  {/* ===== BOTTOM AREA ===== */}
                  <div style={{ padding: "12px 28px 0" }}>
                    {/* Member Voices */}
                    {kaiho.sections.memberVoices.items.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <SectionCard title={kaiho.sections.memberVoices.title} color="#C25A7C" bgColor={NL.pinkLight} maxH={130}>
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: kaiho.sections.memberVoices.items.length === 1 ? "1fr" : "1fr 1fr",
                            gap: "8px",
                          }}>
                            {kaiho.sections.memberVoices.items.map((v, i) => (
                              <div key={i} style={{
                                background: "#FFF9FB", borderRadius: "8px",
                                padding: "8px 12px", border: `1px solid #F5DCE5`,
                              }}>
                                <span style={{ fontSize: "11px", fontWeight: 700, color: "#C25A7C" }}>{v.name}</span>
                                <p style={{ fontSize: "11px", lineHeight: 1.7, color: NL.text, margin: "2px 0 0" }}>
                                  「{v.comment}」
                                </p>
                              </div>
                            ))}
                          </div>
                        </SectionCard>
                      </div>
                    )}

                    {/* Editor Note + Editor Name */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "stretch" }}>
                      <div style={{
                        background: NL.cream, borderRadius: "10px",
                        border: `1px solid ${NL.border}`, padding: "10px 14px",
                      }}>
                        <div style={{
                          fontSize: "12px", fontWeight: 700, color: NL.greenDark,
                          marginBottom: "5px", borderBottom: `2px solid ${NL.greenLight}`,
                          paddingBottom: "3px", display: "inline-block", letterSpacing: "2px",
                        }}>
                          {kaiho.sections.editorNote.title}
                        </div>
                        <p style={{
                          fontSize: "11px", lineHeight: 1.8, color: NL.text, margin: 0,
                          maxHeight: "54px", overflow: "hidden",
                        }}>
                          {kaiho.sections.editorNote.body}
                        </p>
                      </div>
                      <div style={{
                        background: NL.cardBg, borderRadius: "10px",
                        border: `1px solid ${NL.border}`, padding: "10px 20px",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        minWidth: "120px",
                      }}>
                        <div style={{ fontSize: "9px", color: NL.textSub, letterSpacing: "2px", marginBottom: "4px" }}>
                          {kaiho.sections.editor.title}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: NL.greenDark }}>
                          {kaiho.sections.editor.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Club info footer */}
                  <div style={{
                    position: "absolute", bottom: "16px", left: 0, right: 0,
                    textAlign: "center", fontSize: "9px", color: NL.textSub, letterSpacing: "1px",
                  }}>
                    発行：{kaiho.clubName} / {kaiho.publishDate}
                  </div>
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
