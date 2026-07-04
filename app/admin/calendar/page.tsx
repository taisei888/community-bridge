"use client";

import { useState } from "react";

const initialEvents = [
  { id: 1, day: 7, title: "健康体操教室", time: "10:00〜11:00", place: "集会所" },
  { id: 2, day: 10, title: "7月定例会", time: "14:00〜", place: "コミュニティセンター" },
  { id: 3, day: 14, title: "囲碁・将棋の会", time: "13:00〜15:00", place: "集会所" },
  { id: 4, day: 21, title: "健康体操教室", time: "10:00〜11:00", place: "集会所" },
  { id: 5, day: 25, title: "花見ウォーキング", time: "9:00〜", place: "○○公園" },
];

export default function AdminCalendarPage() {
  const [events] = useState(initialEvents);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", day: "", time: "", place: "" });

  const handleAdd = () => {
    if (!form.title || !form.day) return;
    setShowAdd(false);
    setForm({ title: "", day: "", time: "", place: "" });
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #E5E7EB", fontSize: 14, color: "#111827",
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>カレンダー管理</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>7月のイベント {events.length}件</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            padding: "12px 20px", borderRadius: 12, border: "none",
            background: "#22C55E", color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ＋ 予定を追加
        </button>
      </div>

      {/* 追加フォーム */}
      {showAdd && (
        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          border: "2px solid #22C55E", marginBottom: 20,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>新しい予定を追加</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>タイトル</label>
              <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：定例会" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>日付</label>
              <input style={inputStyle} type="number" min="1" max="31" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} placeholder="例：10" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>時間</label>
              <input style={inputStyle} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="例：14:00〜" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>場所</label>
              <input style={inputStyle} value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="例：集会所" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setShowAdd(false)} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", fontSize: 14, cursor: "pointer", color: "#6B7280", fontWeight: 600 }}>キャンセル</button>
            <button onClick={handleAdd} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#22C55E", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>追加する</button>
          </div>
        </div>
      )}

      {/* イベントリスト */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {events.map((ev, i) => (
          <div key={ev.id} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "18px 20px",
            borderBottom: i < events.length - 1 ? "1px solid #F3F4F6" : "none",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "#DCFCE7",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280" }}>7月</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#166534" }}>{ev.day}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{ev.title}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 3 }}>
                🕐 {ev.time} · 📍 {ev.place}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", fontSize: 12, cursor: "pointer", color: "#6B7280", fontWeight: 600 }}>編集</button>
              <button style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #FCA5A5", background: "#FEF2F2", fontSize: 12, cursor: "pointer", color: "#EF4444", fontWeight: 600 }}>削除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
