export default function GenkiPage() {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;

  const reported = [
    { name: "田中 一郎", time: "8:02" },
    { name: "鈴木 花子", time: "8:15" },
    { name: "伊藤 健一", time: "8:30" },
    { name: "中村 文子", time: "9:05" },
    { name: "高橋 誠", time: "9:12" },
    { name: "山田 みよ", time: "9:45" },
  ];

  const notReported = [
    { name: "佐藤 次郎", lastReport: "昨日" },
    { name: "渡辺 幸子", lastReport: "3日前" },
  ];

  const weekData = [
    { day: "月", count: 35, total: 42 },
    { day: "火", count: 38, total: 42 },
    { day: "水", count: 32, total: 42 },
    { day: "木", count: 36, total: 42 },
    { day: "金", count: 28, total: 42 },
    { day: "土", count: 25, total: 42 },
    { day: "日", count: 22, total: 42 },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>今日も元気 集計</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>{dateStr}の報告状況</p>
      </div>

      {/* サマリー */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>報告済み</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#22C55E" }}>{reported.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>未報告</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#F59E0B" }}>{notReported.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>報告率</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#3B82F6" }}>{Math.round((reported.length / (reported.length + notReported.length)) * 100)}%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* 報告済み */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#22C55E", marginBottom: 14 }}>💚 報告済み</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {reported.map((m) => (
              <div key={m.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: "#F0FDF4", borderRadius: 10,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.name}</span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{m.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 未報告 */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#F59E0B", marginBottom: 14 }}>⚠️ 未報告</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notReported.map((m) => (
              <div key={m.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: "#FEF3C7", borderRadius: 10,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.name}</span>
                <span style={{ fontSize: 13, color: "#92400E" }}>最終: {m.lastReport}</span>
              </div>
            ))}
          </div>
          {notReported.some((m) => m.lastReport === "3日前") && (
            <div style={{
              marginTop: 12, padding: "12px 14px", background: "#FEF2F2",
              borderRadius: 10, border: "1px solid #FECACA",
              fontSize: 13, color: "#DC2626", fontWeight: 600,
            }}>
              ⚠ 渡辺 幸子さんが3日間未報告です
            </div>
          )}
        </div>
      </div>

      {/* 週間推移 */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 16 }}>📊 今週の報告推移</div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
          {weekData.map((d) => {
            const pct = (d.count / d.total) * 100;
            return (
              <div key={d.day} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 4 }}>{d.count}</div>
                <div style={{
                  height: `${pct}%`, background: "#22C55E", borderRadius: "6px 6px 0 0",
                  minHeight: 8, transition: "height 0.3s",
                }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF", marginTop: 6 }}>{d.day}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
