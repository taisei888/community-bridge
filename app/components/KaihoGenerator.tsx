"use client";

import { useState, useRef } from "react";

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

export default function KaihoGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [kaiho, setKaiho] = useState<KaihoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    kaiho.sections.forEach((s) => {
      if (y > 9.3) return;
      slide.addShape(pptx.ShapeType.rect, { x: 0.5, y, w: 0.1, h: 0.3, fill: { color: "3B82F6" } });
      slide.addText(s.heading, { x: 0.75, y, w: 6.25, h: 0.3, fontSize: 13, bold: true, color: "111827", fontFace: "Hiragino Kaku Gothic ProN" });
      const body = s.body.replace(/\\n/g, "\n");
      const h = Math.min(Math.max(body.split("\n").length * 0.22, 0.4), 1.2);
      slide.addText(body, { x: 0.75, y: y + 0.35, w: 6.25, h, fontSize: 10.5, color: "4B5563", fontFace: "Hiragino Kaku Gothic ProN", valign: "top", lineSpacingMultiple: 1.5 });
      y += 0.4 + h + 0.2;
    });
    slide.addShape(pptx.ShapeType.line, { x: 1, y: 10.05, w: 5.5, h: 0, line: { color: "E5E7EB", width: 0.5 } });
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      {/* ===== Form ===== */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">入力</h2>
          <p className="text-xs text-gray-400 mt-0.5">必要な項目を入力してください</p>
        </div>
        <div className="px-6 py-5 space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {f.label}{f.required && <span className="text-blue-500 ml-1">*</span>}
              </label>
              {f.multi ? (
                <textarea name={f.key} value={form[f.key]} onChange={set} placeholder={f.placeholder} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[15px] text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder:text-gray-300 resize-none" />
              ) : (
                <input type="text" name={f.key} value={form[f.key]} onChange={set} placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[15px] text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition placeholder:text-gray-300" />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button onClick={generate} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="spinner" />生成中...</span> : "会報を生成"}
          </button>
        </div>
      </div>

      {/* ===== Preview ===== */}
      <div className="lg:col-span-3 lg:sticky lg:top-6">
        {kaiho ? (
          <div className="fade-up">
            <div className="flex gap-2 mb-3">
              <button onClick={downloadPptx}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2">
                <DownloadIcon /> PPTX
              </button>
              <button onClick={downloadPdf}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition text-sm flex items-center justify-center gap-2">
                <DownloadIcon /> PDF
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
              <div
                ref={previewRef}
                style={{
                  width: "210mm", minHeight: "297mm", position: "relative",
                  transformOrigin: "top left", transform: "scale(0.52)",
                  marginBottom: "calc(-297mm * 0.48)", marginRight: "calc(-210mm * 0.48)",
                  background: "#fff", overflow: "hidden",
                }}
              >
                {/* Header */}
                <div style={{ background: "#111827", padding: "36px 44px 30px" }}>
                  <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#fff", textAlign: "center", letterSpacing: "2px", marginBottom: "8px" }}>
                    {kaiho.title}
                  </h1>
                  <p style={{ fontSize: "15px", color: "#9CA3AF", textAlign: "center", letterSpacing: "0.5px" }}>
                    {kaiho.subtitle}
                  </p>
                </div>

                {/* Body */}
                <div style={{ padding: "30px 40px 70px" }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: kaiho.sections.length >= 4 ? "1fr 1fr" : "1fr",
                    gap: "18px",
                  }}>
                    {kaiho.sections.map((section, i) => {
                      const isLast = kaiho.sections.length >= 4 && kaiho.sections.length % 2 === 1 && i === kaiho.sections.length - 1;
                      return (
                        <div key={i} style={{
                          background: "#FAFBFC", borderRadius: "10px", padding: "20px 22px",
                          border: "1px solid #E5E7EB", gridColumn: isLast ? "1 / -1" : undefined,
                        }}>
                          <h2 style={{
                            fontSize: "18px", fontWeight: "700", color: "#111827",
                            marginBottom: "10px", paddingBottom: "8px", borderBottom: "2px solid #E5E7EB",
                          }}>
                            {section.heading}
                          </h2>
                          <p style={{
                            fontSize: "14.5px", lineHeight: "1.9", color: "#4B5563",
                            whiteSpace: "pre-wrap", margin: 0,
                          }}>
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
                  borderTop: "1px solid #E5E7EB", padding: "12px 40px",
                  textAlign: "center", fontSize: "11px", color: "#9CA3AF", background: "#FAFBFC",
                }}>
                  {kaiho.footer}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="text-gray-500 font-semibold mb-1">プレビュー</p>
            <p className="text-gray-400 text-sm">
              フォームに情報を入力して<br />「会報を生成」を押してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
