"use client";

import { useState } from "react";

const events = [
  { id: 1, day: 7, title: "健康体操教室", time: "10:00〜11:00", place: "集会所", color: "#22C55E" },
  { id: 2, day: 10, title: "7月定例会", time: "14:00〜", place: "コミュニティセンター", color: "#3B82F6" },
  { id: 3, day: 14, title: "囲碁・将棋の会", time: "13:00〜15:00", place: "集会所", color: "#F59E0B" },
  { id: 4, day: 21, title: "健康体操教室", time: "10:00〜11:00", place: "集会所", color: "#22C55E" },
  { id: 5, day: 25, title: "花見ウォーキング", time: "9:00〜", place: "○○公園", color: "#EC4899" },
];

const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const todayDate = today.getDate();

  // カレンダーグリッド生成
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const eventDays = new Set(events.map((e) => e.day));
  const dayEvents = selectedDay ? events.filter((e) => e.day === selectedDay) : [];

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
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>
          {month + 1}月のカレンダー
        </h1>
      </div>

      <div style={{ padding: "16px" }}>
        {/* カレンダーグリッド */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "20px 12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: 16,
        }}>
          {/* 曜日ヘッダー */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 8 }}>
            {weekLabels.map((w, i) => (
              <div key={w} style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: 700,
                color: i === 0 ? "#EF4444" : i === 6 ? "#3B82F6" : "#9CA3AF",
                padding: "8px 0",
              }}>
                {w}
              </div>
            ))}
          </div>

          {/* 日付 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;

              const hasEvent = eventDays.has(day);
              const isToday = day === todayDate;
              const isSelected = day === selectedDay;
              const dayOfWeek = (firstDayOfWeek + day - 1) % 7;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 14,
                    border: "none",
                    background: isSelected
                      ? "#22C55E"
                      : isToday
                        ? "#DCFCE7"
                        : "transparent",
                    color: isSelected
                      ? "#fff"
                      : dayOfWeek === 0
                        ? "#EF4444"
                        : dayOfWeek === 6
                          ? "#3B82F6"
                          : "#111827",
                    fontSize: 18,
                    fontWeight: isToday || isSelected ? 800 : 500,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    position: "relative",
                    minHeight: 48,
                  }}
                >
                  {day}
                  {hasEvent && (
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isSelected ? "#fff" : "#22C55E",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 選択した日のイベント */}
        {selectedDay && (
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 14 }}>
              {month + 1}月{selectedDay}日の予定
            </div>

            {dayEvents.length === 0 ? (
              <div style={{ fontSize: 16, color: "#9CA3AF", padding: "16px 0", textAlign: "center" }}>
                予定はありません
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      padding: "16px",
                      background: "#F9FAFB",
                      borderRadius: 16,
                      borderLeft: `4px solid ${ev.color}`,
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: 15, color: "#6B7280", display: "flex", flexDirection: "column", gap: 4 }}>
                      <span>🕐 {ev.time}</span>
                      <span>📍 {ev.place}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 今月のイベント一覧 */}
        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 14 }}>
            今月の予定
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedDay(ev.day)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 12px",
                  background: "#F9FAFB",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: ev.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: ev.color }}>
                    {ev.day}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{ev.title}</div>
                  <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
                    {ev.time} · {ev.place}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
