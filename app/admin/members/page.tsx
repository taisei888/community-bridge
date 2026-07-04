"use client";

import { useState } from "react";

const initialMembers = [
  { id: 1, name: "田中 一郎", role: "会長", phone: "090-1234-5678", address: "○○市△△町1-2-3" },
  { id: 2, name: "鈴木 花子", role: "副会長", phone: "090-2345-6789", address: "○○市△△町2-3-4" },
  { id: 3, name: "佐藤 次郎", role: "会計", phone: "090-3456-7890", address: "○○市△△町3-4-5" },
  { id: 4, name: "山田 みよ", role: "会員", phone: "090-4567-8901", address: "○○市□□町1-1" },
  { id: 5, name: "伊藤 健一", role: "会員", phone: "090-5678-9012", address: "○○市□□町2-2" },
  { id: 6, name: "渡辺 幸子", role: "会員", phone: "090-6789-0123", address: "○○市□□町3-3" },
  { id: 7, name: "高橋 誠", role: "会員", phone: "090-7890-1234", address: "○○市○○町1-5" },
  { id: 8, name: "中村 文子", role: "会員", phone: "090-8901-2345", address: "○○市○○町2-6" },
];

export default function MembersPage() {
  const [members] = useState(initialMembers);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", role: "会員", phone: "", address: "" });

  const handleAdd = () => {
    if (!form.name) return;
    setShowAdd(false);
    setForm({ name: "", role: "会員", phone: "", address: "" });
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>名簿管理</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>{members.length}名の会員</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            padding: "12px 20px", borderRadius: 12, border: "none",
            background: "#22C55E", color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ＋ 会員追加
        </button>
      </div>

      {/* 追加フォーム */}
      {showAdd && (
        <div style={{
          background: "#fff", borderRadius: 16, padding: 24,
          border: "2px solid #22C55E", marginBottom: 20,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 }}>新しい会員を追加</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>名前</label>
              <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="山田 太郎" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>役職</label>
              <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option>会員</option><option>会長</option><option>副会長</option><option>会計</option><option>役員</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>電話番号</label>
              <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="090-0000-0000" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>住所</label>
              <input style={inputStyle} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="○○市△△町1-2-3" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setShowAdd(false)} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", fontSize: 14, cursor: "pointer", color: "#6B7280", fontWeight: 600 }}>キャンセル</button>
            <button onClick={handleAdd} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#22C55E", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>追加する</button>
          </div>
        </div>
      )}

      {/* 名簿リスト */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {members.map((m, i) => (
          <div key={m.id} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 20px",
            borderBottom: i < members.length - 1 ? "1px solid #F3F4F6" : "none",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: m.role === "会長" ? "#22C55E" : m.role === "副会長" ? "#3B82F6" : m.role === "会計" ? "#F59E0B" : "#E5E7EB",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: m.role === "会員" ? "#6B7280" : "#fff",
              fontWeight: 800, fontSize: 16, flexShrink: 0,
            }}>
              {m.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{m.name}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{m.phone} · {m.address}</div>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
              background: m.role === "会員" ? "#F3F4F6" : "#DCFCE7",
              color: m.role === "会員" ? "#6B7280" : "#166534",
            }}>
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
