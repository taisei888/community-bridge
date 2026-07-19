"use client";

import { useState, useRef, type CSSProperties } from "react";

/* ===== Types ===== */
type PhotoSlot = { type: string; useUploadedPhoto?: boolean; illustrationPrompt?: string; altText?: string };
type ActivityItem = { date: string; headline: string; body: string; photoSlot?: PhotoSlot; photoSuggestion?: string; iconSuggestion?: string };
type ScheduleItem = { date: string; event: string; description?: string; iconPrompt?: string };
type NoticeItem = { headline: string; body: string; iconPrompt?: string };
type MemberVoice = { name: string; comment: string; avatarPrompt?: string };
type ExtraBox = { title: string; body: string; iconPrompt?: string } | null;
type KaihoData = {
  title: string;
  subtitle: string;
  issueLabel: string;
  publishDate: string;
  clubName: string;
  layoutPattern?: string;
  layoutVariant?: string | number;
  seasonTheme?: string;
  themeColor: { main: string; sub: string; accent: string; background: string; text?: string };
  fontDirection?: { titleFont?: string; headingFont?: string; bodyFont?: string; accentFont?: string };
  designDirection: string;
  mainVisual?: { type?: string; position?: string; imagePrompt?: string; altText?: string };
  illustrationDirection?: { mainIllustration?: string; smallDecorations?: string[]; sectionIcons?: Record<string, string> };
  sections: {
    activityReport: { title: string; summaryLead?: string; items: ActivityItem[] };
    nextSchedule: { title: string; items: ScheduleItem[] };
    notices: { title: string; items: NoticeItem[] };
    memberVoices: { title: string; items: MemberVoice[] };
    extraBox?: ExtraBox;
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

/* ===== Activity Illustration SVGs (placeholder when no photo) ===== */
const ActivityIllustration = ({ index }: { index: number }) => {
  const illustrations = [
    // People doing group activity
    <svg key="0" width="100%" height="100%" viewBox="0 0 200 100" fill="none" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="100" fill="#E8F0E0" rx="6" />
      <circle cx="50" cy="40" r="12" fill={NL.green} opacity="0.3" />
      <circle cx="50" cy="60" r="6" fill={NL.green} opacity="0.2" />
      <rect x="44" y="66" width="12" height="18" rx="3" fill={NL.green} opacity="0.2" />
      <circle cx="100" cy="38" r="12" fill={NL.greenDark} opacity="0.25" />
      <circle cx="100" cy="58" r="6" fill={NL.greenDark} opacity="0.2" />
      <rect x="94" y="64" width="12" height="18" rx="3" fill={NL.greenDark} opacity="0.2" />
      <circle cx="150" cy="42" r="12" fill={NL.orange} opacity="0.25" />
      <circle cx="150" cy="62" r="6" fill={NL.orange} opacity="0.2" />
      <rect x="144" y="68" width="12" height="18" rx="3" fill={NL.orange} opacity="0.2" />
      <path d="M20 90 Q60 75 100 85 Q140 95 180 80" stroke={NL.green} strokeWidth="2" opacity="0.2" fill="none" />
      <circle cx="30" cy="20" r="4" fill={NL.orange} opacity="0.15" />
      <circle cx="170" cy="15" r="3" fill={NL.green} opacity="0.15" />
    </svg>,
    // Nature/outdoor scene
    <svg key="1" width="100%" height="100%" viewBox="0 0 200 100" fill="none" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="100" fill="#EAF3E1" rx="6" />
      <path d="M0 85 Q30 60 60 75 Q90 90 120 70 Q150 50 180 65 Q200 75 200 85 V100 H0 Z" fill={NL.green} opacity="0.15" />
      <path d="M60 75 L75 40 L90 75 Z" fill={NL.green} opacity="0.25" />
      <path d="M75 60 L85 35 L95 60 Z" fill={NL.greenDark} opacity="0.2" />
      <path d="M130 70 L150 30 L170 70 Z" fill={NL.green} opacity="0.3" />
      <path d="M140 55 L155 25 L170 55 Z" fill={NL.greenDark} opacity="0.2" />
      <circle cx="45" cy="25" r="15" fill={NL.orange} opacity="0.2" />
      <path d="M20 80 Q25 65 35 80 Q28 72 20 80 Z" fill={NL.green} opacity="0.3" />
      <circle cx="160" cy="20" r="3" fill={NL.orange} opacity="0.15" />
    </svg>,
    // Exercise/health
    <svg key="2" width="100%" height="100%" viewBox="0 0 200 100" fill="none" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="100" fill="#E8F4FA" rx="6" />
      <circle cx="70" cy="35" r="10" fill={NL.blue} opacity="0.25" />
      <path d="M70 45 L70 70" stroke={NL.blue} strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      <path d="M55 55 L70 50 L85 45" stroke={NL.blue} strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      <path d="M60 80 L70 70 L80 80" stroke={NL.blue} strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      <circle cx="130" cy="35" r="10" fill={NL.green} opacity="0.25" />
      <path d="M130 45 L130 70" stroke={NL.green} strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      <path d="M115 50 L130 55 L145 50" stroke={NL.green} strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      <path d="M120 80 L130 70 L140 80" stroke={NL.green} strokeWidth="3" opacity="0.25" strokeLinecap="round" />
      <circle cx="30" cy="20" r="5" fill={NL.pink} opacity="0.2" />
      <circle cx="170" cy="25" r="4" fill={NL.orange} opacity="0.15" />
    </svg>,
  ];
  return illustrations[index % illustrations.length];
};

/* ===== Member Avatar Colors ===== */
const AVATAR_COLORS = ["#7BAE5E", "#E8A849", "#7EB8D8", "#E8A0B4", "#9B8EC5", "#5EAEB4"];

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
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, hasUploadedPhotos: photos.length > 0, uploadedPhotoDescriptions: photos.length > 0 ? `${photos.length}枚の写真がアップロードされています` : "なし" }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "生成失敗"); }
      const data = await res.json();
      const sec = data.sections || {};
      // Normalize notices: handle both string[] and {headline, body, iconPrompt}[] formats
      const normalizeNotices = (items: unknown[]): NoticeItem[] => {
        return items.map((item: unknown) => {
          if (typeof item === "string") return { headline: "", body: item, iconPrompt: "" };
          const obj = item as Record<string, string>;
          return { headline: obj?.headline || "", body: obj?.body || obj?.text || String(item), iconPrompt: obj?.iconPrompt || "" };
        });
      };
      data.sections = {
        activityReport: { title: sec.activityReport?.title || "今月の活動報告", summaryLead: sec.activityReport?.summaryLead || "", items: Array.isArray(sec.activityReport?.items) ? sec.activityReport.items : [] },
        nextSchedule: { title: sec.nextSchedule?.title || "来月の予定", items: Array.isArray(sec.nextSchedule?.items) ? sec.nextSchedule.items : [] },
        notices: { title: sec.notices?.title || "お知らせ・連絡事項", items: Array.isArray(sec.notices?.items) ? normalizeNotices(sec.notices.items) : [] },
        memberVoices: { title: sec.memberVoices?.title || "会員のひとこと", items: Array.isArray(sec.memberVoices?.items) ? sec.memberVoices.items : [] },
        extraBox: sec.extraBox || null,
        editorNote: { title: sec.editorNote?.title || "編集後記", body: sec.editorNote?.body || "" },
        editor: { title: sec.editor?.title || "編集責任者", name: sec.editor?.name || "" },
      };
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

    slide.addShape(pptx.ShapeType.roundRect, { x: 0.3, y: 0.2, w: 6.9, h: 1.2, fill: { color: "EAF3E1" }, rectRadius: 0.15, line: { color: "C8D4B8", width: 1 } });
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.45, y: 0.25, w: 1.5, h: 0.25, fill: { color: "7BAE5E" }, rectRadius: 0.12 });
    slide.addText(kaiho.issueLabel || form.issueDate, { x: 0.5, y: 0.25, w: 1.4, h: 0.25, fontSize: 8, color: "FFFFFF", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(kaiho.title, { x: 0.5, y: 0.55, w: 6.5, h: 0.55, fontSize: 24, bold: true, color: "4D7A35", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(kaiho.subtitle, { x: 0.5, y: 1.05, w: 6.5, h: 0.25, fontSize: 10, color: "7BAE5E", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    let y = 1.65;
    const sec = kaiho.sections;

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

    slide.addShape(pptx.ShapeType.roundRect, { x: 3.85, y, w: 3.25, h: 0.3, fill: { color: "E8F4FA" }, rectRadius: 0.05 });
    slide.addText(sec.nextSchedule.title, { x: 4.0, y, w: 3, h: 0.3, fontSize: 11, bold: true, color: "3A7FA8", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
    let sy = y + 0.36;
    sec.nextSchedule.items.forEach((item) => {
      if (sy > 4.5) return;
      slide.addText(`${item.date}  ${item.event}`, { x: 4.0, y: sy, w: 3, h: 0.2, fontSize: 8, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
      sy += 0.24;
    });

    if (sec.notices.items.length > 0) {
      sy += 0.15;
      slide.addShape(pptx.ShapeType.roundRect, { x: 3.85, y: sy, w: 3.25, h: 0.3, fill: { color: "FFF3E0" }, rectRadius: 0.05 });
      slide.addText(sec.notices.title, { x: 4.0, y: sy, w: 3, h: 0.3, fontSize: 11, bold: true, color: "B8862D", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
      sy += 0.36;
      sec.notices.items.forEach((item) => {
        if (sy > 6.5) return;
        const noticeText = item.headline ? `\u30FB${item.headline}：${item.body}` : `\u30FB${item.body}`;
        slide.addText(noticeText, { x: 4.0, y: sy, w: 3, h: 0.2, fontSize: 8, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
        sy += 0.24;
      });
    }

    const vy = Math.max(ay, sy) + 0.15;
    if (vy < 8.5) {
      slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: vy, w: 6.7, h: 0.3, fill: { color: "FDE8EF" }, rectRadius: 0.05 });
      slide.addText(sec.memberVoices.title, { x: 0.55, y: vy, w: 6.4, h: 0.3, fontSize: 11, bold: true, color: "C25A7C", fontFace: "Hiragino Kaku Gothic ProN", valign: "middle" });
      let my = vy + 0.36;
      sec.memberVoices.items.forEach((v) => {
        if (my > 9) return;
        slide.addText(`${v.name}\uFF1A\u300C${v.comment}\u300D`, { x: 0.55, y: my, w: 6.4, h: 0.22, fontSize: 8, color: "3D3D3D", fontFace: "Hiragino Kaku Gothic ProN" });
        my += 0.26;
      });
    }

    slide.addText(sec.editorNote.body, { x: 0.5, y: 9.6, w: 5.5, h: 0.4, fontSize: 7, color: "777777", fontFace: "Hiragino Kaku Gothic ProN", valign: "top", lineSpacingMultiple: 1.3 });
    slide.addText(`\u7DE8\u96C6: ${sec.editor.name}`, { x: 6.0, y: 9.7, w: 1.2, h: 0.25, fontSize: 8, color: "4D7A35", align: "right", bold: true, fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(`\u767A\u884C: ${kaiho.clubName} / ${kaiho.publishDate}`, { x: 0.5, y: 10.15, w: 6.5, h: 0.2, fontSize: 7, color: "AAAAAA", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

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
            <div style={{
              background: "#D1D5DB", borderRadius: "12px", padding: "24px",
              display: "flex", justifyContent: "center", alignItems: "flex-start",
              minHeight: `${A4_H * SCALE + 48}px`,
            }}>
              <div style={{
                width: `${A4_W * SCALE}px`,
                height: `${A4_H * SCALE}px`,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 1px 6px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                flexShrink: 0,
              }}>
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
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* ===== HEADER ===== */}
                  <div style={{
                    margin: "18px 24px 0",
                    background: NL.greenLight,
                    borderRadius: "14px",
                    border: `1.5px solid #C8D4B8`,
                    padding: "14px 24px 12px",
                    position: "relative",
                    textAlign: "center",
                    flexShrink: 0,
                  }}>
                    {/* Leaf decorations on header corners */}
                    <svg width="50" height="40" viewBox="0 0 50 40" style={{ position: "absolute", top: "-5px", left: "-5px", opacity: 0.4 }} fill="none">
                      <path d="M10 35 Q15 10 40 5 Q25 18 18 35Z" fill={NL.green} />
                      <path d="M5 30 Q8 15 25 8 Q15 18 10 30Z" fill={NL.greenDark} opacity="0.6" />
                    </svg>
                    <svg width="50" height="40" viewBox="0 0 50 40" style={{ position: "absolute", top: "-5px", right: "-5px", opacity: 0.4, transform: "scaleX(-1)" }} fill="none">
                      <path d="M10 35 Q15 10 40 5 Q25 18 18 35Z" fill={NL.green} />
                      <path d="M5 30 Q8 15 25 8 Q15 18 10 30Z" fill={NL.greenDark} opacity="0.6" />
                    </svg>

                    {/* Issue label */}
                    <div style={{
                      position: "absolute", top: "10px", left: "16px",
                      background: NL.green, color: "#fff",
                      borderRadius: "12px", padding: "3px 14px",
                      fontSize: "12px", fontWeight: 700,
                    }}>
                      {kaiho.issueLabel || form.issueDate}
                    </div>

                    {/* Publish date */}
                    <div style={{
                      position: "absolute", top: "10px", right: "16px",
                      fontSize: "12px", color: NL.greenDark, fontWeight: 600,
                    }}>
                      {kaiho.publishDate || form.issueDate}
                    </div>

                    {/* Title */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "6px" }}>
                      <svg width="28" height="24" viewBox="0 0 28 24" fill="none">
                        <path d="M24 20 Q18 4 4 2 Q10 10 14 20Z" fill={NL.green} opacity="0.4" />
                        <path d="M20 22 Q15 8 5 5 Q12 12 16 22Z" fill={NL.greenDark} opacity="0.25" />
                      </svg>
                      <h1 style={{
                        fontSize: "32px", fontWeight: 800, color: NL.greenDark,
                        letterSpacing: "5px", margin: 0, lineHeight: 1.2,
                      }}>
                        {kaiho.title}
                      </h1>
                      <svg width="28" height="24" viewBox="0 0 28 24" fill="none" style={{ transform: "scaleX(-1)" }}>
                        <path d="M24 20 Q18 4 4 2 Q10 10 14 20Z" fill={NL.green} opacity="0.4" />
                        <path d="M20 22 Q15 8 5 5 Q12 12 16 22Z" fill={NL.greenDark} opacity="0.25" />
                      </svg>
                    </div>
                    <p style={{ fontSize: "13px", color: NL.green, letterSpacing: "2px", fontWeight: 500, margin: "4px 0 0" }}>
                      {kaiho.subtitle}
                    </p>
                  </div>

                  {/* ===== MAIN CONTENT - fills remaining space ===== */}
                  <div style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "1.15fr 0.85fr",
                    gap: "14px",
                    padding: "12px 24px 0",
                    minHeight: 0,
                  }}>
                    {/* ===== LEFT: Activity Report ===== */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{
                        background: NL.greenLight, borderRadius: "10px 10px 0 0",
                        padding: "7px 14px", display: "flex", alignItems: "center", gap: "8px",
                        borderBottom: `2px solid ${NL.green}`, flexShrink: 0,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 13 Q5 4 13 2 Q9 7 7 13Z" fill={NL.green} opacity="0.6" />
                          <circle cx="12" cy="4" r="2" fill={NL.orange} opacity="0.5" />
                        </svg>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: NL.greenDark, margin: 0 }}>
                          {kaiho.sections.activityReport.title}
                        </h3>
                      </div>
                      <div style={{
                        flex: 1,
                        background: NL.cardBg, borderRadius: "0 0 10px 10px",
                        border: `1px solid ${NL.border}`, borderTop: "none",
                        padding: "10px 12px",
                        display: "flex", flexDirection: "column",
                      }}>
                        {kaiho.sections.activityReport.items.map((item, i) => (
                          <div key={i} style={{
                            flex: 1,
                            marginBottom: i < kaiho.sections.activityReport.items.length - 1 ? "8px" : 0,
                            paddingBottom: i < kaiho.sections.activityReport.items.length - 1 ? "8px" : 0,
                            borderBottom: i < kaiho.sections.activityReport.items.length - 1 ? `1.5px dashed ${NL.border}` : "none",
                            display: "flex", flexDirection: "column",
                          }}>
                            {/* Date badge + Headline */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexShrink: 0 }}>
                              <span style={{
                                background: NL.green, color: "#fff",
                                fontSize: "11px", fontWeight: 700, padding: "2px 10px",
                                borderRadius: "10px", whiteSpace: "nowrap",
                              }}>{item.date}</span>
                              <span style={{ fontSize: "14px", fontWeight: 700, color: NL.greenDark }}>{item.headline}</span>
                            </div>

                            {/* Photo or Illustration */}
                            <div style={{
                              flex: 1, minHeight: "80px", maxHeight: "130px",
                              borderRadius: "8px", overflow: "hidden",
                              border: photos[i] ? `1.5px solid ${NL.border}` : "none",
                              marginBottom: "6px",
                            }}>
                              {photos[i] ? (
                                <img src={photos[i]} alt="" style={{
                                  width: "100%", height: "100%", objectFit: "cover", display: "block",
                                }} />
                              ) : (
                                <ActivityIllustration index={i} />
                              )}
                            </div>

                            {/* Body */}
                            <p style={{ fontSize: "12px", lineHeight: 1.7, color: NL.text, margin: 0, flexShrink: 0 }}>{item.body}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ===== RIGHT: Schedule + Notices ===== */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {/* Schedule */}
                      <div style={{ flexShrink: 0 }}>
                        <div style={{
                          background: NL.blueLight, borderRadius: "10px 10px 0 0",
                          padding: "7px 14px", display: "flex", alignItems: "center", gap: "8px",
                          borderBottom: `2px solid ${NL.blue}`,
                        }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke={NL.blue} strokeWidth="1.3" />
                            <line x1="4.5" y1="1" x2="4.5" y2="4.5" stroke={NL.blue} strokeWidth="1.3" strokeLinecap="round" />
                            <line x1="9.5" y1="1" x2="9.5" y2="4.5" stroke={NL.blue} strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#3A7FA8", margin: 0 }}>
                            {kaiho.sections.nextSchedule.title}
                          </h3>
                        </div>
                        <div style={{
                          background: NL.cardBg, borderRadius: "0 0 10px 10px",
                          border: `1px solid ${NL.border}`, borderTop: "none",
                          padding: "10px 12px",
                        }}>
                          {kaiho.sections.nextSchedule.items.map((item, i) => (
                            <div key={i} style={{
                              display: "flex", alignItems: "center", gap: "8px",
                              marginBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? "10px" : 0,
                              paddingBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? "10px" : 0,
                              borderBottom: i < kaiho.sections.nextSchedule.items.length - 1 ? `1px dotted ${NL.border}` : "none",
                            }}>
                              <span style={{
                                background: NL.blueLight, color: "#3A7FA8",
                                fontSize: "12px", fontWeight: 700, padding: "3px 10px",
                                borderRadius: "8px", whiteSpace: "nowrap", flexShrink: 0,
                              }}>{item.date}</span>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: NL.text }}>{item.event}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notices */}
                      {kaiho.sections.notices.items.length > 0 && (
                        <div style={{ flex: 1 }}>
                          <div style={{
                            background: NL.orangeLight, borderRadius: "10px 10px 0 0",
                            padding: "7px 14px", display: "flex", alignItems: "center", gap: "8px",
                            borderBottom: `2px solid ${NL.orange}`,
                          }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M7 1.5 L13 11.5 H1 Z" stroke="#B8862D" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
                              <line x1="7" y1="5.5" x2="7" y2="8" stroke="#B8862D" strokeWidth="1.3" strokeLinecap="round" />
                              <circle cx="7" cy="9.5" r="0.7" fill="#B8862D" />
                            </svg>
                            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#B8862D", margin: 0 }}>
                              {kaiho.sections.notices.title}
                            </h3>
                          </div>
                          <div style={{
                            background: NL.cardBg, borderRadius: "0 0 10px 10px",
                            border: `1px solid ${NL.border}`, borderTop: "none",
                            padding: "10px 12px",
                          }}>
                            {kaiho.sections.notices.items.map((item, i) => (
                              <div key={i} style={{
                                display: "flex", alignItems: "flex-start", gap: "6px",
                                marginBottom: i < kaiho.sections.notices.items.length - 1 ? "10px" : 0,
                              }}>
                                <span style={{ color: NL.orange, fontSize: "11px", lineHeight: 1.8, flexShrink: 0 }}>●</span>
                                <div style={{ margin: 0 }}>
                                  {item.headline && <span style={{ fontSize: "12px", fontWeight: 700, color: NL.text, lineHeight: 1.8 }}>{item.headline}　</span>}
                                  <span style={{ fontSize: "12px", lineHeight: 1.8, color: NL.text }}>{item.body}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ===== MEMBER VOICES ===== */}
                  {kaiho.sections.memberVoices.items.length > 0 && (
                    <div style={{ padding: "12px 24px 0", flexShrink: 0 }}>
                      <div style={{
                        background: NL.pinkLight, borderRadius: "10px 10px 0 0",
                        padding: "7px 14px", display: "flex", alignItems: "center", gap: "8px",
                        borderBottom: `2px solid ${NL.pink}`,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="4.5" r="3" stroke="#C25A7C" strokeWidth="1.2" fill="none" />
                          <path d="M2 12.5 Q2 9 7 9 Q12 9 12 12.5" stroke="#C25A7C" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        </svg>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#C25A7C", margin: 0 }}>
                          {kaiho.sections.memberVoices.title}
                        </h3>
                      </div>
                      <div style={{
                        background: NL.cardBg, borderRadius: "0 0 10px 10px",
                        border: `1px solid ${NL.border}`, borderTop: "none",
                        padding: "16px 14px",
                      }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${Math.min(kaiho.sections.memberVoices.items.length, 4)}, 1fr)`,
                          gap: "14px",
                        }}>
                          {kaiho.sections.memberVoices.items.map((v, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                              {/* Large Avatar */}
                              <div style={{
                                width: "68px", height: "68px", borderRadius: "50%",
                                background: `linear-gradient(135deg, ${AVATAR_COLORS[i % AVATAR_COLORS.length]}, ${AVATAR_COLORS[i % AVATAR_COLORS.length]}CC)`,
                                margin: "0 auto 8px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: `3px solid #fff`,
                                boxShadow: `0 0 0 2px ${AVATAR_COLORS[i % AVATAR_COLORS.length]}50, 0 3px 8px rgba(0,0,0,0.12)`,
                              }}>
                                <span style={{ fontSize: "26px", fontWeight: 700, color: "#fff" }}>
                                  {v.name.charAt(0)}
                                </span>
                              </div>
                              <div style={{ fontSize: "14px", fontWeight: 700, color: NL.text, marginBottom: "6px" }}>
                                {v.name}
                              </div>
                              {/* Speech bubble */}
                              <div style={{
                                position: "relative",
                                background: "#FFF9FB", borderRadius: "10px",
                                padding: "10px 12px", border: "1px solid #F5DCE5",
                                fontSize: "12px", lineHeight: 1.7, color: NL.text, textAlign: "left",
                              }}>
                                {/* Bubble arrow */}
                                <div style={{
                                  position: "absolute", top: "-6px", left: "50%", transform: "translateX(-50%)",
                                  width: 0, height: 0,
                                  borderLeft: "6px solid transparent",
                                  borderRight: "6px solid transparent",
                                  borderBottom: "6px solid #FFF9FB",
                                }} />
                                <div style={{
                                  position: "absolute", top: "-7px", left: "50%", transform: "translateX(-50%)",
                                  width: 0, height: 0,
                                  borderLeft: "7px solid transparent",
                                  borderRight: "7px solid transparent",
                                  borderBottom: "7px solid #F5DCE5",
                                  zIndex: -1,
                                }} />
                                「{v.comment}」
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== EXTRA BOX ===== */}
                  {kaiho.sections.extraBox && kaiho.sections.extraBox.title && (
                    <div style={{ padding: "8px 24px 0", flexShrink: 0 }}>
                      <div style={{
                        background: `linear-gradient(135deg, ${NL.orangeLight}, ${NL.cream})`,
                        borderRadius: "10px",
                        border: `1.5px dashed ${NL.orange}`,
                        padding: "12px 16px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="5.5" stroke={NL.orange} strokeWidth="1.2" fill="none" />
                            <path d="M7 4.5V7.5M7 9V9.5" stroke={NL.orange} strokeWidth="1.2" strokeLinecap="round" />
                          </svg>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#B8862D" }}>{kaiho.sections.extraBox.title}</span>
                        </div>
                        <p style={{ fontSize: "12px", lineHeight: 1.7, color: NL.text, margin: 0 }}>{kaiho.sections.extraBox.body}</p>
                      </div>
                    </div>
                  )}

                  {/* ===== FOOTER ===== */}
                  <div style={{
                    padding: "10px 24px 16px",
                    flexShrink: 0,
                    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                    gap: "16px",
                  }}>
                    <p style={{
                      fontSize: "11px", lineHeight: 1.7, color: NL.textSub, margin: 0,
                      flex: 1,
                    }}>
                      {kaiho.sections.editorNote.body}
                    </p>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "10px", color: NL.textSub, letterSpacing: "1px" }}>
                        {kaiho.sections.editor.title}
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: NL.greenDark }}>
                        {kaiho.sections.editor.name}
                      </div>
                    </div>
                  </div>

                  {/* Club info bar */}
                  <div style={{
                    textAlign: "center", fontSize: "10px", color: NL.textSub,
                    letterSpacing: "1px", padding: "6px 24px",
                    borderTop: `1px solid ${NL.border}`, flexShrink: 0,
                    background: `${NL.greenLight}66`,
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
