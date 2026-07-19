"use client";

import { useState, useRef, type CSSProperties } from "react";
import { KaihoPreview } from "./kaiho-templates";

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

  const capturePreview = async (): Promise<string> => {
    if (!previewRef.current) throw new Error("プレビューが見つかりません");
    const { toPng } = await import("html-to-image");
    return toPng(previewRef.current, { quality: 1, pixelRatio: 2, cacheBust: true });
  };

  const downloadPptx = async () => {
    if (!kaiho || !previewRef.current) return;
    try {
      const [dataUrl, PptxGenJS] = await Promise.all([
        capturePreview(),
        import("pptxgenjs").then(m => m.default),
      ]);
      const pptx = new PptxGenJS();
      pptx.defineLayout({ name: "A4", width: 7.5, height: 10.63 });
      pptx.layout = "A4";
      const slide = pptx.addSlide();
      slide.addImage({ data: dataUrl, x: 0, y: 0, w: 7.5, h: 10.63 });
      await pptx.writeFile({ fileName: `${kaiho.title}.pptx` });
    } catch (err) {
      setError(`PPTX生成エラー: ${err instanceof Error ? err.message : "不明"}`);
    }
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    try {
      const [dataUrl, { jsPDF }] = await Promise.all([
        capturePreview(),
        import("jspdf"),
      ]);
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
      pdf.save(`${kaiho?.title || "会報"}.pdf`);
    } catch (err) {
      setError(`PDF生成エラー: ${err instanceof Error ? err.message : "不明"}`);
    }
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
                <div style={{
                  transform: `scale(${SCALE})`,
                  transformOrigin: "top left",
                }}>
                  <KaihoPreview ref={previewRef} data={kaiho} photos={photos} />
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

