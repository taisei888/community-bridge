"use client";

import { useState } from "react";

const allNews = [
  {
    id: 1,
    title: "7月の定例会は7月10日（木）です",
    body: "7月の定例会を下記のとおり開催いたします。\n\n日時：7月10日（木）午後2時〜\n場所：コミュニティセンター 2階\n\n議題：\n・夏祭りについて\n・8月のイベント計画\n・その他連絡事項\n\n皆様のご参加をお待ちしております。",
    date: "7月2日",
    icon: "📢",
    from: "会長 田中一郎",
  },
  {
    id: 2,
    title: "健康体操教室のご案内",
    body: "毎月第1・第3月曜日に健康体操教室を開催しています。\n\n日時：7月7日（月）午前10時〜11時\n場所：集会所\n持ち物：タオル、飲み物\n\n初めての方も大歓迎です。\nお気軽にご参加ください。",
    date: "7月1日",
    icon: "🏃",
    from: "副会長 鈴木花子",
  },
  {
    id: 3,
    title: "夏祭りのボランティア募集",
    body: "8月3日（土）に開催予定の夏祭りのお手伝いをしてくださる方を募集しています。\n\n・受付係\n・模擬店係\n・会場設営\n\nお手伝いいただける方は、7月15日までに役員にお声がけください。",
    date: "6月28日",
    icon: "🎆",
    from: "会長 田中一郎",
  },
  {
    id: 4,
    title: "6月の会報ができました",
    body: "6月号の会報が完成しましたので、お知らせいたします。\n\n次回の定例会で配布いたしますが、先にお読みになりたい方は集会所にて配布しております。",
    date: "6月25日",
    icon: "📰",
    from: "事務局",
  },
  {
    id: 5,
    title: "熱中症にご注意ください",
    body: "これから暑い日が続きます。\n\n・こまめに水分をとりましょう\n・外出時は帽子をかぶりましょう\n・無理をせず、涼しい場所で過ごしましょう\n・体調が悪いときは早めに休みましょう\n\n何かございましたら役員にご連絡ください。",
    date: "6月20日",
    icon: "☀️",
    from: "副会長 鈴木花子",
  },
];

export default function OshirasePage() {
  const [openId, setOpenId] = useState<number | null>(null);

  if (openId !== null) {
    const news = allNews.find((n) => n.id === openId);
    if (!news) return null;

    return (
      <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
        {/* ヘッダー */}
        <div style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <button
            onClick={() => setOpenId(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: 28,
              color: "#22C55E",
              cursor: "pointer",
              padding: "0 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>お知らせ</span>
        </div>

        {/* 記事詳細 */}
        <div style={{ padding: "20px 16px" }}>
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: "24px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{news.icon}</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.5, marginBottom: 12 }}>
              {news.title}
            </h1>
            <div style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 20, display: "flex", gap: 12 }}>
              <span>{news.date}</span>
              <span>{news.from}</span>
            </div>
            <div style={{
              fontSize: 17,
              color: "#374151",
              lineHeight: 2,
              whiteSpace: "pre-wrap",
            }}>
              {news.body}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        padding: "18px 20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>お知らせ</h1>
      </div>

      {/* 一覧 */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {allNews.map((news) => (
            <button
              key={news.id}
              onClick={() => setOpenId(news.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "18px 16px",
                background: "#fff",
                borderRadius: 18,
                border: "1px solid #F3F4F6",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 32, flexShrink: 0 }}>{news.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {news.title}
                </div>
                <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6, display: "flex", gap: 8 }}>
                  <span>{news.date}</span>
                  <span>·</span>
                  <span>{news.from}</span>
                </div>
              </div>
              <span style={{ fontSize: 20, color: "#D1D5DB", flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
