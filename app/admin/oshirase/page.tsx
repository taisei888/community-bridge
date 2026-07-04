"use client";

import { useState } from "react";

const pastMessages = [
  { id: 1, title: "7月の定例会は7月10日（木）です", date: "7月2日", target: "全員(42名)" },
  { id: 2, title: "健康体操教室のご案内", date: "7月1日", target: "全員(42名)" },
  { id: 3, title: "夏祭りのボランティア募集", date: "6月28日", target: "全員(42名)" },
];

export default function AdminOshirasePage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle("");
      setBody("");
    }, 2500);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #E5E7EB", fontSize: 15, color: "#111827",
    outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>お知らせ送信</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>会員全員にお知らせを配信します</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* 送信フォーム */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #E5E7EB" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>タイトル</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：7月の定例会のご案内"
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>本文</label>
            <textarea
              style={{ ...inputStyle, minHeight: 200, resize: "vertical", lineHeight: 1.8 }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={"例：\n○○老人クラブの皆様\n\n7月の定例会を下記のとおり開催いたします。\n\n日時：7月10日（木）午後2時〜\n場所：コミュニティセンター 2階\n\n皆様のご参加をお待ちしております。"}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!title.trim() || !body.trim() || sent}
            style={{
              width: "100%", padding: 16, borderRadius: 12, border: "none",
              background: sent ? "#22C55E" : (!title.trim() || !body.trim()) ? "#E5E7EB" : "#22C55E",
              color: (!title.trim() || !body.trim()) ? "#9CA3AF" : "#fff",
              fontSize: 16, fontWeight: 700,
              cursor: (!title.trim() || !body.trim()) ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {sent ? "✅ 送信しました！" : "📢 全員に送信する"}
          </button>
        </div>

        {/* 送信履歴 */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB", alignSelf: "start" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 16 }}>送信履歴</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pastMessages.map((m) => (
              <div key={m.id} style={{
                padding: "12px 14px", background: "#F9FAFB", borderRadius: 12,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{m.title}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{m.date} · {m.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
