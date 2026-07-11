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

    // A4 portrait dimensions in inches
    pptx.defineLayout({ name: "A4", width: 7.5, height: 10.63 });
    pptx.layout = "A4";

    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };

    // Title
    slide.addText(kaiho.title, {
      x: 0.4,
      y: 0.3,
      w: 6.7,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: "1a1a1a",
      align: "center",
      fontFace: "Hiragino Kaku Gothic ProN",
    });

    // Subtitle
    slide.addText(kaiho.subtitle, {
      x: 0.4,
      y: 0.9,
      w: 6.7,
      h: 0.4,
      fontSize: 12,
      color: "666666",
      align: "center",
      fontFace: "Hiragino Kaku Gothic ProN",
    });

    // Divider
    slide.addShape(pptx.ShapeType.line, {
      x: 0.4,
      y: 1.4,
      w: 6.7,
      h: 0,
      line: { color: "CCCCCC", width: 1 },
    });

    // Sections
    let yPos = 1.6;
    const sectionHeight = 1.3;

    kaiho.sections.forEach((section, i) => {
      if (yPos + sectionHeight > 9.8) return; // Don't overflow

      // Section heading
      slide.addText(section.heading, {
        x: 0.4,
        y: yPos,
        w: 6.7,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: "2563EB",
        fontFace: "Hiragino Kaku Gothic ProN",
      });

      // Section body
      const bodyText = section.body.replace(/\\n/g, "\n");
      slide.addText(bodyText, {
        x: 0.4,
        y: yPos + 0.35,
        w: 6.7,
        h: 0.85,
        fontSize: 10,
        color: "333333",
        fontFace: "Hiragino Kaku Gothic ProN",
        valign: "top",
        lineSpacingMultiple: 1.3,
      });

      yPos += sectionHeight;

      // Separator line between sections
      if (i < kaiho.sections.length - 1) {
        slide.addShape(pptx.ShapeType.line, {
          x: 0.8,
          y: yPos - 0.05,
          w: 5.9,
          h: 0,
          line: { color: "EEEEEE", width: 0.5 },
        });
        yPos += 0.1;
      }
    });

    // Footer
    slide.addText(kaiho.footer, {
      x: 0.4,
      y: 9.8,
      w: 6.7,
      h: 0.4,
      fontSize: 8,
      color: "999999",
      align: "center",
      fontFace: "Hiragino Kaku Gothic ProN",
    });

    await pptx.writeFile({ fileName: `${kaiho.title}.pptx` });
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${kaiho?.title || "会報"}.pdf`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-6">
        <h2 className="text-lg font-bold mb-4">入力フォーム</h2>

        <div className="space-y-4">
          <Field
            label="クラブ名"
            name="clubName"
            value={form.clubName}
            onChange={handleChange}
            placeholder="例：さくら長寿会"
            required
          />
          <Field
            label="発行月"
            name="issueDate"
            value={form.issueDate}
            onChange={handleChange}
            placeholder="例：2026年7月号"
            required
          />
          <TextArea
            label="今月の活動報告"
            name="activityReport"
            value={form.activityReport}
            onChange={handleChange}
            placeholder="例：7/5 グラウンドゴルフ大会（参加者32名）、7/12 健康体操教室"
          />
          <TextArea
            label="来月の予定"
            name="nextSchedule"
            value={form.nextSchedule}
            onChange={handleChange}
            placeholder="例：8/3 納涼祭、8/10 カラオケ大会、8/20 健康講座"
          />
          <TextArea
            label="お知らせ・連絡事項"
            name="announcements"
            value={form.announcements}
            onChange={handleChange}
            placeholder="例：会費の納入期限は8/15です。熱中症にご注意ください。"
          />
          <TextArea
            label="会員のひとこと"
            name="memberVoice"
            value={form.memberVoice}
            onChange={handleChange}
            placeholder="例：山田さん「孫が遊びに来てうれしかった」"
          />
          <Field
            label="編集責任者"
            name="editorName"
            value={form.editorName}
            onChange={handleChange}
            placeholder="例：田中太郎"
          />
        </div>

        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 w-full bg-[var(--accent)] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "生成中..." : "会報を生成する"}
        </button>
      </div>

      {/* Preview & Download */}
      <div>
        {kaiho ? (
          <>
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleDownloadPptx}
                className="flex-1 bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition text-sm"
              >
                PPTX ダウンロード
              </button>
              <button
                onClick={handleDownloadPdf}
                className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition text-sm"
              >
                PDF ダウンロード
              </button>
            </div>

            {/* A4 Preview */}
            <div
              ref={previewRef}
              className="bg-white shadow-lg border border-gray-200 mx-auto"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "15mm 18mm",
                transformOrigin: "top left",
                transform: "scale(0.48)",
                marginBottom: "-297mm",
              }}
            >
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "6px",
                  color: "#1a1a1a",
                }}
              >
                {kaiho.title}
              </h1>
              <p
                style={{
                  textAlign: "center",
                  color: "#666",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                {kaiho.subtitle}
              </p>
              <hr
                style={{
                  border: "none",
                  borderTop: "2px solid #2563EB",
                  marginBottom: "20px",
                }}
              />

              {kaiho.sections.map((section, i) => (
                <div key={i} style={{ marginBottom: "18px" }}>
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#2563EB",
                      marginBottom: "6px",
                      paddingLeft: "8px",
                      borderLeft: "3px solid #2563EB",
                    }}
                  >
                    {section.heading}
                  </h2>
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: "1.8",
                      color: "#333",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {section.body.replace(/\\n/g, "\n")}
                  </p>
                </div>
              ))}

              <div
                style={{
                  position: "absolute",
                  bottom: "15mm",
                  left: "18mm",
                  right: "18mm",
                  textAlign: "center",
                  fontSize: "10px",
                  color: "#999",
                  borderTop: "1px solid #eee",
                  paddingTop: "8px",
                }}
              >
                {kaiho.footer}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] p-12 text-center text-[var(--text-sub)]">
            <p className="text-4xl mb-4">&#128196;</p>
            <p>左のフォームに情報を入力して</p>
            <p>「会報を生成する」を押してください</p>
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
      />
    </div>
  );
}
