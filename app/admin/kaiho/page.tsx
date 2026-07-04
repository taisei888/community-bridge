"use client";

import { useState } from "react";

const issues = [
  { id: 1, title: "7月号", date: "2026年7月1日", status: "下書き" },
  { id: 2, title: "6月号", date: "2026年6月1日", status: "発行済み" },
  { id: 3, title: "5月号", date: "2026年5月1日", status: "発行済み" },
  { id: 4, title: "4月号", date: "2026年4月1日", status: "発行済み" },
];

export default function AdminKaihoPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState("");

  const handleGenerate = () => {
    if (!content.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerated(`【○○老人クラブ 会報 ${title || "7月号"}】

▶ 定例会のご報告
先日行われました定例会には、38名の会員にご参加いただきました。
今月は夏祭りの準備について活発な意見交換が行われました。

▶ 健康体操教室
毎月第1・第3月曜日の健康体操教室、今月も好評でした。
暑い日が続きますが、水分を十分にとってご参加ください。

▶ お知らせ
・夏祭りは8月3日（土）開催予定です
・ボランティアを引き続き募集しています
・熱中症にはくれぐれもお気をつけください

いつもありがとうございます。
皆様のご健康をお祈りいたします。`);
      setGenerating(false);
    }, 2000);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #E5E7EB", fontSize: 15, color: "#111827",
    outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>会報管理</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>AIで会報を簡単に作成できます</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{
            padding: "12px 20px", borderRadius: 12, border: "none",
            background: "#22C55E", color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ＋ 新しい会報
        </button>
      </div>

      {showCreate && (
        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          border: "1px solid #E5E7EB", marginBottom: 24,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 20 }}>
            ✨ AI会報作成
          </div>

          {!generated ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>タイトル</label>
                <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：7月号" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>内容メモ（箇条書きでOK）</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 160, resize: "vertical", lineHeight: 1.8 }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"例：\n・定例会 38名参加\n・夏祭り8月3日決定\n・健康体操 好評\n・ボランティア募集中"}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={!content.trim() || generating}
                style={{
                  width: "100%", padding: 16, borderRadius: 12, border: "none",
                  background: !content.trim() ? "#E5E7EB" : "#22C55E",
                  color: !content.trim() ? "#9CA3AF" : "#fff",
                  fontSize: 16, fontWeight: 700,
                  cursor: !content.trim() ? "default" : "pointer",
                }}
              >
                {generating ? "✨ AI生成中..." : "✨ AIで会報を生成する"}
              </button>
            </>
          ) : (
            <>
              <div style={{
                background: "#F9FAFB", borderRadius: 14, padding: "24px 20px",
                border: "1px solid #E5E7EB", marginBottom: 16,
                whiteSpace: "pre-wrap", fontSize: 15, lineHeight: 2, color: "#374151",
              }}>
                {generated}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setGenerated("")} style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #E5E7EB", background: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#6B7280" }}>
                  ← やり直す
                </button>
                <button onClick={() => { setShowCreate(false); setGenerated(""); setTitle(""); setContent(""); }} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "#22C55E", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  ✅ 保存して公開
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 会報一覧 */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {issues.map((issue, i) => (
          <div key={issue.id} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "18px 20px",
            borderBottom: i < issues.length - 1 ? "1px solid #F3F4F6" : "none",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#DBEAFE",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>
              📰
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{issue.title}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{issue.date}</div>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
              background: issue.status === "発行済み" ? "#DCFCE7" : "#FEF3C7",
              color: issue.status === "発行済み" ? "#166534" : "#92400E",
            }}>
              {issue.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
