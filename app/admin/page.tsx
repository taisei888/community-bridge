import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "会員数", value: "42名", icon: "👥", bg: "#DCFCE7", color: "#166534" },
    { label: "今日の元気報告", value: "28名", icon: "💚", bg: "#DBEAFE", color: "#1D4ED8" },
    { label: "今月のイベント", value: "5件", icon: "📅", bg: "#FEF3C7", color: "#92400E" },
    { label: "未読のお知らせ反応", value: "3件", icon: "📢", bg: "#FCE7F3", color: "#9D174D" },
  ];

  const quickActions = [
    { label: "お知らせを送る", href: "/admin/oshirase", icon: "📢", bg: "#22C55E", color: "#fff" },
    { label: "名簿を見る", href: "/admin/members", icon: "👥", bg: "#3B82F6", color: "#fff" },
    { label: "元気集計を確認", href: "/admin/genki", icon: "💚", bg: "#F59E0B", color: "#fff" },
    { label: "カレンダー管理", href: "/admin/calendar", icon: "📅", bg: "#8B5CF6", color: "#fff" },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>管理画面</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>○○老人クラブ</p>
      </div>

      {/* 統計 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: "#fff", borderRadius: 16, padding: "20px",
            border: "1px solid #E5E7EB",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>{s.value}</div>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* クイックアクション */}
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 14 }}>クイック操作</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {quickActions.map((a) => (
          <Link key={a.label} href={a.href} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "18px 20px", borderRadius: 16,
            background: a.bg, color: a.color,
            fontSize: 16, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.15s",
          }}>
            <span style={{ fontSize: 24 }}>{a.icon}</span>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
