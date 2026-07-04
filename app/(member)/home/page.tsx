"use client";

import { useState } from "react";

const recentNews = [
  { id: 1, title: "7月の定例会は7月10日（木）です", date: "7月2日", icon: "📢" },
  { id: 2, title: "健康体操教室のご案内", date: "7月1日", icon: "🏃" },
  { id: 3, title: "夏祭りのボランティア募集", date: "6月28日", icon: "🎆" },
];

export default function HomePage() {
  const [genki, setGenki] = useState(false);
  const [pressing, setPressing] = useState(false);

  const handleGenki = () => {
    setGenki(true);
  };

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][today.getDay()];

  return (
    <div style={{ background: "#F9FAFB" }}>
      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #22C55E, #16A34A)",
        padding: "24px 20px 32px",
        borderRadius: "0 0 28px 28px",
        color: "#fff",
      }}>
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>○○老人クラブ</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>
          {month}月{day}日（{weekday}）
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* 今日も元気ボタン */}
        <div style={{
          background: "#fff",
          borderRadius: 24,
          padding: "32px 20px",
          textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: 20,
        }}>
          {!genki ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                今日の調子はいかがですか？
              </div>
              <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
                ボタンを押して元気を伝えましょう
              </div>
              <button
                onClick={handleGenki}
                onPointerDown={() => setPressing(true)}
                onPointerUp={() => setPressing(false)}
                onPointerLeave={() => setPressing(false)}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  border: "none",
                  background: pressing
                    ? "linear-gradient(135deg, #16A34A, #15803D)"
                    : "linear-gradient(135deg, #22C55E, #16A34A)",
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: pressing
                    ? "0 4px 16px rgba(34,197,94,0.3)"
                    : "0 8px 32px rgba(34,197,94,0.35)",
                  transform: pressing ? "scale(0.95)" : "scale(1)",
                  transition: "all 0.15s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  margin: "0 auto",
                }}
              >
                <span style={{ fontSize: 40 }}>😊</span>
                今日も元気！
              </button>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#22C55E", marginBottom: 8 }}>
                ありがとうございます！
              </div>
              <div style={{ fontSize: 16, color: "#6B7280" }}>
                今日も元気で何よりです
              </div>
            </div>
          )}
        </div>

        {/* 最新のお知らせ */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            📢 お知らせ
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentNews.map((news) => (
              <a
                key={news.id}
                href={`/oshirase#${news.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px",
                  background: "#F9FAFB",
                  borderRadius: 16,
                  border: "1px solid #F3F4F6",
                  minHeight: 48,
                }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{news.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
                    {news.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
                    {news.date}
                  </div>
                </div>
                <span style={{ fontSize: 18, color: "#D1D5DB", flexShrink: 0 }}>›</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
