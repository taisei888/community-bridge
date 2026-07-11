"use client";

import { useState, useRef, type CSSProperties } from "react";

type KaihoSection = { heading: string; body: string };
type KaihoData = { title: string; subtitle: string; sections: KaihoSection[]; footer: string };

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

const card: CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  border: "1px solid #E2E4E9",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #D5D7DC",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "15px",
  color: "#1a1a1a",
  background: "#FAFBFC",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "#2563EB";
  e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
  e.target.style.background = "#fff";
};
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "#D5D7DC";
  e.target.style.boxShadow = "none";
  e.target.style.background = "#FAFBFC";
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
      reader.onload = () => {
        newPhotos.push(reader.result as string);
        setPhotos([...newPhotos]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

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
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 7.5, h: 1.6, fill: { color: "111827" } });
    slide.addText(kaiho.title, { x: 0.5, y: 0.2, w: 6.5, h: 0.7, fontSize: 28, bold: true, color: "FFFFFF", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    slide.addText(kaiho.subtitle, { x: 0.5, y: 0.9, w: 6.5, h: 0.45, fontSize: 12, color: "9CA3AF", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    let y = 1.85;

    // Photos in PPTX
    if (photos.length > 0) {
      const photoW = photos.length <= 2 ? 3.0 : 2.1;
      const photoH = photoW * 0.65;
      const totalW = photoW * photos.length + 0.15 * (photos.length - 1);
      let px = (7.5 - totalW) / 2;
      photos.forEach((p) => {
        slide.addImage({ data: p, x: px, y, w: photoW, h: photoH, rounding: true });
        px += photoW + 0.15;
      });
      y += photoH + 0.25;
    }

    kaiho.sections.forEach((s) => {
      if (y > 9.3) return;
      slide.addShape(pptx.ShapeType.rect, { x: 0.5, y, w: 0.1, h: 0.3, fill: { color: "2563EB" } });
      slide.addText(s.heading, { x: 0.75, y, w: 6.25, h: 0.3, fontSize: 13, bold: true, color: "111827", fontFace: "Hiragino Kaku Gothic ProN" });
      const body = s.body.replace(/\\n/g, "\n");
      const h = Math.min(Math.max(body.split("\n").length * 0.22, 0.4), 1.2);
      slide.addText(body, { x: 0.75, y: y + 0.35, w: 6.25, h, fontSize: 10.5, color: "4B5563", fontFace: "Hiragino Kaku Gothic ProN", valign: "top", lineSpacingMultiple: 1.5 });
      y += 0.4 + h + 0.2;
    });
    slide.addText(kaiho.footer, { x: 0.5, y: 10.1, w: 6.5, h: 0.3, fontSize: 8, color: "9CA3AF", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    await pptx.writeFile({ fileName: `${kaiho.title}.pptx` });
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#fff" });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`${kaiho?.title || "会報"}.pdf`);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "start" }}>
      {/* ===== Form ===== */}
      <div style={{ ...card, position: "sticky", top: "76px" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F0F1F3" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>会報情報を入力</h2>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>
                {f.label}
                {f.required && <span style={{ color: "#2563EB", marginLeft: "4px" }}>*</span>}
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
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>
              写真（最大4枚）
            </label>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotos}
              style={{ display: "none" }} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%", padding: "12px", border: "2px dashed #D5D7DC", borderRadius: "10px",
                background: "#FAFBFC", color: "#888", fontSize: "14px", cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.color = "#2563EB"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#D5D7DC"; e.currentTarget.style.color = "#888"; }}
            >
              + 写真を追加
            </button>
            {photos.length > 0 && (
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: "relative", width: "76px", height: "76px" }}>
                    <img src={p} alt="" style={{
                      width: "76px", height: "76px", objectFit: "cover",
                      borderRadius: "8px", border: "1px solid #E2E4E9",
                    }} />
                    <button
                      onClick={() => removePhoto(i)}
                      style={{
                        position: "absolute", top: "-6px", right: "-6px",
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "#EF4444", color: "#fff", border: "2px solid #fff",
                        fontSize: "11px", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", lineHeight: 1,
                      }}
                    >x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "10px 14px", color: "#DC2626", fontSize: "13px", marginBottom: "12px" }}>
              {error}
            </div>
          )}
          <button
            onClick={generate} disabled={loading}
            style={{
              width: "100%", padding: "12px", border: "none", borderRadius: "10px",
              background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              color: "#fff", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)", transition: "all 0.15s",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{
                  width: "18px", height: "18px", border: "2.5px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  animation: "spin 0.6s linear infinite", display: "inline-block",
                }} />
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
              {[
                { label: "PPTX", fn: downloadPptx },
                { label: "PDF", fn: downloadPdf },
              ].map((b) => (
                <button key={b.label} onClick={b.fn} style={{
                  flex: 1, padding: "10px", border: "1px solid #D5D7DC", borderRadius: "10px",
                  background: "#fff", color: "#333", fontSize: "14px", fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {b.label}でダウンロード
                </button>
              ))}
            </div>

            {/* A4 Preview */}
            <div style={{ ...card, overflow: "hidden" }}>
              <div
                ref={previewRef}
                style={{
                  width: "210mm", minHeight: "297mm", position: "relative",
                  transformOrigin: "top left", transform: "scale(0.55)",
                  marginBottom: "calc(-297mm * 0.45)", marginRight: "calc(-210mm * 0.45)",
                  background: "#fff", overflow: "hidden",
                }}
              >
                {/* Header */}
                <div style={{ background: "#111827", padding: "40px 48px 34px" }}>
                  <h1 style={{ fontSize: "38px", fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: "2px", marginBottom: "8px" }}>
                    {kaiho.title}
                  </h1>
                  <p style={{ fontSize: "15px", color: "#9CA3AF", textAlign: "center" }}>
                    {kaiho.subtitle}
                  </p>
                </div>

                {/* Photos */}
                {photos.length > 0 && (
                  <div style={{
                    padding: "24px 44px 0",
                    display: "grid",
                    gridTemplateColumns: photos.length === 1 ? "1fr" : photos.length === 2 ? "1fr 1fr" : photos.length === 3 ? "1fr 1fr 1fr" : "1fr 1fr",
                    gap: "12px",
                  }}>
                    {photos.map((p, i) => (
                      <img key={i} src={p} alt="" style={{
                        width: "100%", height: photos.length <= 2 ? "180px" : "140px",
                        objectFit: "cover", borderRadius: "10px",
                        border: "1px solid #E2E4E9",
                      }} />
                    ))}
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: `${photos.length > 0 ? 20 : 32}px 44px 80px` }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: kaiho.sections.length >= 4 ? "1fr 1fr" : "1fr",
                    gap: "18px",
                  }}>
                    {kaiho.sections.map((section, i) => {
                      const isLast = kaiho.sections.length >= 4 && kaiho.sections.length % 2 === 1 && i === kaiho.sections.length - 1;
                      return (
                        <div key={i} style={{
                          background: "#F8F9FA", borderRadius: "12px", padding: "22px 24px",
                          border: "1px solid #ECEEF1",
                          gridColumn: isLast ? "1 / -1" : undefined,
                        }}>
                          <h2 style={{
                            fontSize: "19px", fontWeight: 700, color: "#111827",
                            marginBottom: "10px", paddingBottom: "8px", borderBottom: "2px solid #E2E4E9",
                          }}>
                            {section.heading}
                          </h2>
                          <p style={{ fontSize: "15px", lineHeight: 1.9, color: "#4B5563", whiteSpace: "pre-wrap", margin: 0 }}>
                            {section.body.replace(/\\n/g, "\n")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  borderTop: "1px solid #E2E4E9", padding: "14px 44px",
                  textAlign: "center", fontSize: "11px", color: "#9CA3AF", background: "#F8F9FA",
                }}>
                  {kaiho.footer}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ ...card, padding: "80px 40px", textAlign: "center" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "14px", background: "#F0F1F3",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#555", marginBottom: "4px" }}>プレビュー</p>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
              左のフォームに情報を入力して「会報を生成」を押してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
