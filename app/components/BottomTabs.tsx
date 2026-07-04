"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { path: "/home", label: "ホーム", icon: "🏠" },
  { path: "/oshirase", label: "お知らせ", icon: "📢" },
  { path: "/calendar", label: "カレンダー", icon: "📅" },
];

export default function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 72,
      background: "#fff",
      borderTop: "1px solid #E5E7EB",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {tabs.map((tab) => {
        const active = pathname === tab.path || pathname.startsWith(tab.path + "/");
        return (
          <Link
            key={tab.path}
            href={tab.path}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flex: 1,
              height: "100%",
              color: active ? "#22C55E" : "#9CA3AF",
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: 26 }}>{tab.icon}</span>
            <span style={{ fontSize: 12, fontWeight: active ? 800 : 500 }}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
