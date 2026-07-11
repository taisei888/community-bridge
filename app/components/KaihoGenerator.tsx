"use client";

import { useState, useRef } from "react";

type KaihoSection = {
  heading: string;
  body: string;
};

type KaihoData = {
  title: string;
  subtitle: string;
  sections: KaihoSection[];
  footer: string;
};

const INITIAL_FORM = {
  clubName: "",
  issueDate: "",
  activityReport: "",
  nextSchedule: "",
  announcements: "",
  memberVoice: "",
  editorName: "",
};

const FORM_FIELDS: {
  key: keyof typeof INITIAL_FORM;
  label: string;
  type: "input" | "textarea";
  placeholder: string;
  required?: boolean;
  icon: string;
}[] = [
  { key: "clubName", label: "クラブ名", type: "input", placeholder: "例：さくら長寿会", required: true, icon: "🏠" },
  { key: "issueDate", label: "発行月", type: "input", placeholder: "例：2026年7月号", required: true, icon: "📅" },
  { key: "activityReport", label: "今月の活動報告", type: "textarea", placeholder: "例：7/5 グラウンドゴルフ大会（参加者32名）\n7/12 健康体操教室を開催", icon: "📝" },
  { key: "nextSchedule", label: "来月の予定", type: "textarea", placeholder: "例：8/3 納涼祭\n8/10 カラオケ大会\n8/20 健康講座", icon: "📋" },
  { key: "announcements", label: "お知らせ・連絡事項", type: "textarea", placeholder: "例：会費の納入期限は8/15です。熱中症にご注意ください。", icon: "📢" },
  { key: "memberVoice", label: "会員のひとこと", type: "textarea", placeholder: '例：山田さん「孫が遊びに来てうれしかった」', icon: "💬" },
  { key: "editorName", label: "編集責任者", type: "input", placeholder: "例：田中太郎", icon: "✏️" },
];

export default function KaihoGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [kaiho, setKaiho] = useState<KaihoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!form.clubName || !form.issueDate) { setError("クラブ名と発行月は必須です"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "生成に失敗しました"); }
      const data: KaihoData = await res.json();
      setKaiho(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally { setLoading(false); }
  };

  const handleDownloadPptx = async () => {
    if (!kaiho) return;
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: "A4", width: 7.5, height: 10.63 });
    pptx.layout = "A4";
    const slide = pptx.addSlide();

    // Header background
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 7.5, h: 1.8, fill: { color: "1E3A5F" } });
    // Title
    slide.addText(kaiho.title, { x: 0.5, y: 0.25, w: 6.5, h: 0.8, fontSize: 30, bold: true, color: "FFFFFF", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });
    // Subtitle
    slide.addText(kaiho.subtitle, { x: 0.5, y: 1.05, w: 6.5, h: 0.5, fontSize: 13, color: "B0C4DE", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    // Content sections
    let yPos = 2.1;
    const colors = ["3B82F6", "059669", "D97706", "DB2777", "7C3AED", "0891B2"];
    kaiho.sections.forEach((section, i) => {
      if (yPos > 9.2) return;
      const c = colors[i % colors.length];

      // Heading bar
      slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: yPos, w: 0.12, h: 0.35, fill: { color: c } });
      slide.addText(section.heading, { x: 0.75, y: yPos, w: 6.25, h: 0.35, fontSize: 14, bold: true, color: "1F2937", fontFace: "Hiragino Kaku Gothic ProN" });

      const bodyText = section.body.replace(/\\n/g, "\n");
      const lines = bodyText.split("\n").length;
      const bodyH = Math.min(Math.max(lines * 0.22, 0.5), 1.2);
      slide.addText(bodyText, { x: 0.75, y: yPos + 0.4, w: 6.25, h: bodyH, fontSize: 11, color: "374151", fontFace: "Hiragino Kaku Gothic ProN", valign: "top", lineSpacingMultiple: 1.5 });

      yPos += 0.45 + bodyH + 0.15;
    });

    // Footer
    slide.addText(kaiho.footer, { x: 0.5, y: 10.0, w: 6.5, h: 0.35, fontSize: 9, color: "9CA3AF", align: "center", fontFace: "Hiragino Kaku Gothic ProN" });

    await pptx.writeFile({ fileName: `${kaiho.title}.pptx` });
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${kaiho?.title || "会報"}.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">📄</div>
          <div>
            <h2 className="text-xl font-bold">入力フォーム</h2>
            <p className="text-sm text-gray-400">会報に載せたい情報を入力</p>
          </div>
        </div>

        <div className="space-y-5">
          {FORM_FIELDS.map((field) =>
            field.type === "input" ? (
              <Field key={field.key} label={field.label} name={field.key} value={form[field.key]} onChange={handleChange} placeholder={field.placeholder} required={field.required} icon={field.icon} />
            ) : (
              <TextArea key={field.key} label={field.label} name={field.key} value={form[field.key]} onChange={handleChange} placeholder={field.placeholder} icon={field.icon} />
            )
          )}
        </div>

        {error && <div className="mt-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>}

        <button onClick={handleGenerate} disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-xl text-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
          {loading ? (<span className="flex items-center justify-center gap-3"><span className="spinner" />AIが会報を作成中...</span>) : "会報を生成する"}
        </button>
      </div>

      {/* Preview & Download */}
      <div className="lg:sticky lg:top-8">
        {kaiho ? (
          <>
            <div className="flex gap-3 mb-4">
              <button onClick={handleDownloadPptx} className="flex-1 bg-white border-2 border-orange-400 text-orange-600 font-bold py-3 px-4 rounded-xl hover:bg-orange-50 transition-all text-base flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PPTX
              </button>
              <button onClick={handleDownloadPdf} className="flex-1 bg-white border-2 border-red-400 text-red-600 font-bold py-3 px-4 rounded-xl hover:bg-red-50 transition-all text-base flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PDF
              </button>
            </div>

            {/* A4 Preview */}
            <div className="overflow-hidden rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
              <div
                ref={previewRef}
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  position: "relative",
                  transformOrigin: "top left",
                  transform: "scale(0.48)",
                  marginBottom: "calc(-297mm * 0.52)",
                  marginRight: "calc(-210mm * 0.52)",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                {/* ===== HEADER ===== */}
                <div style={{
                  background: "linear-gradient(135deg, #1E3A5F 0%, #2D5A8E 100%)",
                  padding: "32px 40px 28px",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Decorative circles */}
                  <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ position: "absolute", bottom: "-20px", left: "40px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

                  <h1 style={{
                    fontSize: "38px", fontWeight: "800", color: "#FFFFFF", textAlign: "center",
                    letterSpacing: "3px", marginBottom: "8px", position: "relative",
                  }}>
                    {kaiho.title}
                  </h1>
                  <p style={{
                    fontSize: "16px", color: "rgba(176,196,222,0.9)", textAlign: "center",
                    letterSpacing: "1px", position: "relative",
                  }}>
                    {kaiho.subtitle}
                  </p>
                </div>

                {/* ===== CONTENT ===== */}
                <div style={{ padding: "28px 36px 60px" }}>
                  {/* 2-column grid for first 4 sections, then full-width */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: kaiho.sections.length >= 4 ? "1fr 1fr" : "1fr",
                    gap: "20px",
                  }}>
                    {kaiho.sections.map((section, i) => {
                      const colors = [
                        { accent: "#3B82F6", bg: "#F0F6FF", iconBg: "#DBEAFE" },
                        { accent: "#059669", bg: "#F0FDF4", iconBg: "#D1FAE5" },
                        { accent: "#D97706", bg: "#FFFBEB", iconBg: "#FEF3C7" },
                        { accent: "#DB2777", bg: "#FDF2F8", iconBg: "#FCE7F3" },
                        { accent: "#7C3AED", bg: "#F5F3FF", iconBg: "#EDE9FE" },
                        { accent: "#0891B2", bg: "#ECFEFF", iconBg: "#CFFAFE" },
                      ];
                      const c = colors[i % colors.length];
                      // Last section or odd section at end: full width
                      const isFullWidth = kaiho.sections.length < 4 || (kaiho.sections.length % 2 === 1 && i === kaiho.sections.length - 1);

                      return (
                        <div
                          key={i}
                          style={{
                            background: c.bg,
                            borderRadius: "14px",
                            padding: "20px 22px",
                            gridColumn: isFullWidth ? "1 / -1" : undefined,
                            border: `1px solid ${c.accent}20`,
                          }}
                        >
                          <div style={{
                            display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px",
                          }}>
                            <div style={{
                              width: "6px", height: "28px", borderRadius: "3px",
                              background: c.accent, flexShrink: 0,
                            }} />
                            <h2 style={{
                              fontSize: "20px", fontWeight: "700", color: "#1F2937",
                              lineHeight: "1.3", margin: 0,
                            }}>
                              {section.heading}
                            </h2>
                          </div>
                          <p style={{
                            fontSize: "15px", lineHeight: "1.9", color: "#374151",
                            whiteSpace: "pre-wrap", margin: 0,
                          }}>
                            {section.body.replace(/\\n/g, "\n")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "#F9FAFB", borderTop: "1px solid #E5E7EB",
                  padding: "14px 36px", textAlign: "center",
                  fontSize: "12px", color: "#9CA3AF",
                }}>
                  {kaiho.footer}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-16 text-center">
            <div className="float-anim inline-block mb-6">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="text-gray-500 font-bold text-lg mb-2">プレビューエリア</p>
            <p className="text-gray-400 text-base">左のフォームに情報を入力して<br />「会報を生成する」を押してください</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, required, icon }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; icon?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
        {icon && <span className="text-lg">{icon}</span>}{label}
        {required && <span className="text-red-400 text-xs font-normal bg-red-50 px-1.5 py-0.5 rounded">必須</span>}
      </label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-300" />
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, icon }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; icon?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-2">
        {icon && <span className="text-lg">{icon}</span>}{label}
      </label>
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all resize-none placeholder:text-gray-300" />
    </div>
  );
}
