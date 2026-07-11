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
  {
    key: "clubName",
    label: "クラブ名",
    type: "input",
    placeholder: "例：さくら長寿会",
    required: true,
    icon: "🏠",
  },
  {
    key: "issueDate",
    label: "発行月",
    type: "input",
    placeholder: "例：2026年7月号",
    required: true,
    icon: "📅",
  },
  {
    key: "activityReport",
    label: "今月の活動報告",
    type: "textarea",
    placeholder:
      "例：7/5 グラウンドゴルフ大会（参加者32名）\n7/12 健康体操教室を開催",
    icon: "📝",
  },
  {
    key: "nextSchedule",
    label: "来月の予定",
    type: "textarea",
    placeholder: "例：8/3 納涼祭\n8/10 カラオケ大会\n8/20 健康講座",
    icon: "📋",
  },
  {
    key: "announcements",
    label: "お知らせ・連絡事項",
    type: "textarea",
    placeholder: "例：会費の納入期限は8/15です。熱中症にご注意ください。",
    icon: "📢",
  },
  {
    key: "memberVoice",
    label: "会員のひとこと",
    type: "textarea",
    placeholder: '例：山田さん「孫が遊びに来てうれしかった」',
    icon: "💬",
  },
  {
    key: "editorName",
    label: "編集責任者",
    type: "input",
    placeholder: "例：田中太郎",
    icon: "✏️",
  },
];

export default function KaihoGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [kaiho, setKaiho] = useState<KaihoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!form.clubName || !form.issueDate) {
      setError("クラブ名と発行月は必須です");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成に失敗しました");
      }
      const data: KaihoData = await res.json();
      setKaiho(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPptx = async () => {
    if (!kaiho) return;
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();

    pptx.defineLayout({ name: "A4", width: 7.5, height: 10.63 });
    pptx.layout = "A4";

    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };

    slide.addText(kaiho.title, {
      x: 0.4, y: 0.3, w: 6.7, h: 0.6,
      fontSize: 24, bold: true, color: "1a1a1a", align: "center",
      fontFace: "Hiragino Kaku Gothic ProN",
    });

    slide.addText(kaiho.subtitle, {
      x: 0.4, y: 0.9, w: 6.7, h: 0.4,
      fontSize: 12, color: "666666", align: "center",
      fontFace: "Hiragino Kaku Gothic ProN",
    });

    slide.addShape(pptx.ShapeType.line, {
      x: 0.4, y: 1.4, w: 6.7, h: 0,
      line: { color: "3B82F6", width: 2 },
    });

    let yPos = 1.6;
    const sectionHeight = 1.3;

    kaiho.sections.forEach((section, i) => {
      if (yPos + sectionHeight > 9.8) return;

      slide.addText(section.heading, {
        x: 0.4, y: yPos, w: 6.7, h: 0.35,
        fontSize: 13, bold: true, color: "3B82F6",
        fontFace: "Hiragino Kaku Gothic ProN",
      });

      const bodyText = section.body.replace(/\\n/g, "\n");
      slide.addText(bodyText, {
        x: 0.4, y: yPos + 0.35, w: 6.7, h: 0.85,
        fontSize: 10, color: "333333",
        fontFace: "Hiragino Kaku Gothic ProN",
        valign: "top", lineSpacingMultiple: 1.3,
      });

      yPos += sectionHeight;

      if (i < kaiho.sections.length - 1) {
        slide.addShape(pptx.ShapeType.line, {
          x: 0.8, y: yPos - 0.05, w: 5.9, h: 0,
          line: { color: "E5E7EB", width: 0.5 },
        });
        yPos += 0.1;
      }
    });

    slide.addText(kaiho.footer, {
      x: 0.4, y: 9.8, w: 6.7, h: 0.4,
      fontSize: 8, color: "999999", align: "center",
      fontFace: "Hiragino Kaku Gothic ProN",
    });

    await pptx.writeFile({ fileName: `${kaiho.title}.pptx` });
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(previewRef.current, {
      scale: 2, useCORS: true, backgroundColor: "#ffffff",
    });

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
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg">
            📄
          </div>
          <div>
            <h2 className="text-lg font-bold">入力フォーム</h2>
            <p className="text-xs text-gray-400">会報に載せたい情報を入力</p>
          </div>
        </div>

        <div className="space-y-5">
          {FORM_FIELDS.map((field) =>
            field.type === "input" ? (
              <Field
                key={field.key}
                label={field.label}
                name={field.key}
                value={form[field.key]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                icon={field.icon}
              />
            ) : (
              <TextArea
                key={field.key}
                label={field.label}
                name={field.key}
                value={form[field.key]}
                onChange={handleChange}
                placeholder={field.placeholder}
                icon={field.icon}
              />
            )
          )}
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" />
              生成中...
            </span>
          ) : (
            "会報を生成する"
          )}
        </button>
      </div>

      {/* Preview & Download */}
      <div className="lg:sticky lg:top-8">
        {kaiho ? (
          <>
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleDownloadPptx}
                className="flex-1 bg-white border-2 border-orange-400 text-orange-600 font-bold py-2.5 px-4 rounded-xl hover:bg-orange-50 transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PPTX
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex-1 bg-white border-2 border-red-400 text-red-600 font-bold py-2.5 px-4 rounded-xl hover:bg-red-50 transition-all text-sm flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PDF
              </button>
            </div>

            {/* A4 Preview */}
            <div className="overflow-hidden rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
              <div
                ref={previewRef}
                className="bg-white mx-auto"
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  padding: "18mm 20mm",
                  position: "relative",
                  transformOrigin: "top left",
                  transform: "scale(0.48)",
                  marginBottom: "calc(-297mm * 0.52)",
                  marginRight: "calc(-210mm * 0.52)",
                }}
              >
                <h1
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "8px",
                    color: "#1a1a1a",
                    letterSpacing: "1px",
                  }}
                >
                  {kaiho.title}
                </h1>
                <p
                  style={{
                    textAlign: "center",
                    color: "#6B7280",
                    fontSize: "14px",
                    marginBottom: "18px",
                  }}
                >
                  {kaiho.subtitle}
                </p>
                <div
                  style={{
                    height: "3px",
                    background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)",
                    borderRadius: "2px",
                    marginBottom: "24px",
                  }}
                />

                {kaiho.sections.map((section, i) => (
                  <div key={i} style={{ marginBottom: "22px" }}>
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#3B82F6",
                        marginBottom: "8px",
                        paddingLeft: "12px",
                        borderLeft: "4px solid #3B82F6",
                        lineHeight: "1.4",
                      }}
                    >
                      {section.heading}
                    </h2>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "2",
                        color: "#374151",
                        whiteSpace: "pre-wrap",
                        paddingLeft: "4px",
                      }}
                    >
                      {section.body.replace(/\\n/g, "\n")}
                    </p>
                  </div>
                ))}

                <div
                  style={{
                    position: "absolute",
                    bottom: "18mm",
                    left: "20mm",
                    right: "20mm",
                    textAlign: "center",
                    fontSize: "10px",
                    color: "#9CA3AF",
                    borderTop: "1px solid #E5E7EB",
                    paddingTop: "10px",
                  }}
                >
                  {kaiho.footer}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-16 text-center">
            <div className="float-anim inline-block mb-6">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">プレビューエリア</p>
            <p className="text-gray-400 text-sm">
              左のフォームに情報を入力して
              <br />
              「会報を生成する」を押してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
        {icon && <span className="text-base">{icon}</span>}
        {label}
        {required && <span className="text-red-400 text-xs">*必須</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all placeholder:text-gray-300"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  icon?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
        {icon && <span className="text-base">{icon}</span>}
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all resize-none placeholder:text-gray-300"
      />
    </div>
  );
}
