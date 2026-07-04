"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { path: "/admin", label: "ホーム", icon: "📊" },
  { path: "/admin/members", label: "名簿", icon: "👥" },
  { path: "/admin/genki", label: "元気集計", icon: "💚" },
  { path: "/admin/oshirase", label: "送信", icon: "📢" },
  { path: "/admin/calendar", label: "カレンダー", icon: "📅" },
  { path: "/admin/kaiho", label: "会報", icon: "📰" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F9FAFB" }}>
      {/* サイドバー */}
      <aside style={{
        width: 220,
        background: "#fff",
        borderRight: "1px solid #E5E7EB",
        padding: "20px 10px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        <div style={{ padding: "8px 12px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#22C55E",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 18, fontWeight: 900, flexShrink: 0,
            }}>
              つ
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>つながり</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>管理画面</div>
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {menu.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: active ? "#DCFCE7" : "transparent",
                  color: active ? "#166534" : "#6B7280",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 14px",
            borderRadius: 12,
            fontSize: 13,
            color: "#9CA3AF",
            marginTop: 12,
          }}
        >
          📱 メンバー画面へ
        </Link>
      </aside>

      {/* メイン */}
      <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
