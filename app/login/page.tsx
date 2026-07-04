"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"select" | "member" | "admin">("select");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #F0FDF4 0%, #DCFCE7 40%, #F9FAFB 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* ロゴ */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "#22C55E",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 12,
          }}>
            <span style={{ color: "#fff", fontSize: 32, fontWeight: 900 }}>つ</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#111827" }}>つながり</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>老人クラブをもっと身近に</div>
        </div>

        {mode === "select" && <SelectMode onSelect={setMode} />}
        {mode === "member" && <MemberLogin onBack={() => setMode("select")} onLogin={() => router.push("/home")} />}
        {mode === "admin" && <AdminLogin onBack={() => setMode("select")} onLogin={() => router.push("/admin")} />}
      </div>
    </div>
  );
}

// --- ログイン方法選択 ---
function SelectMode({ onSelect }: { onSelect: (m: "member" | "admin") => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button
        onClick={() => onSelect("member")}
        style={{
          background: "#fff", border: "2px solid #E5E7EB", borderRadius: 20,
          padding: "28px 24px", cursor: "pointer", textAlign: "left",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: 16,
        }}
      >
        <span style={{ fontSize: 40 }}>👤</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>会員としてログイン</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>クラブコードで参加</div>
        </div>
      </button>

      <button
        onClick={() => onSelect("admin")}
        style={{
          background: "#fff", border: "2px solid #E5E7EB", borderRadius: 20,
          padding: "28px 24px", cursor: "pointer", textAlign: "left",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: 16,
        }}
      >
        <span style={{ fontSize: 40 }}>🔧</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>管理者としてログイン</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>メール・パスワードでログイン</div>
        </div>
      </button>
    </div>
  );
}

// --- 会員ログイン ---
function MemberLogin({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState("");
  const [selectedName, setSelectedName] = useState("");

  // ダミー会員リスト（コード入力後に表示）
  const members = [
    "田中 一郎", "鈴木 花子", "佐藤 次郎", "山田 みよ",
    "伊藤 健一", "渡辺 幸子", "高橋 誠", "中村 文子",
  ];

  const handleCodeSubmit = () => {
    if (code.length >= 4) setStep(2);
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: "32px 24px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", fontSize: 16, color: "#22C55E",
          cursor: "pointer", fontWeight: 700, padding: 0, marginBottom: 20,
          display: "flex", alignItems: "center", gap: 4,
        }}
      >
        ‹ 戻る
      </button>

      {step === 1 ? (
        <>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
            クラブコードを入力
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 24 }}>
            お知らせに記載されたコードを入力してください
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="例：ABC1234"
            maxLength={8}
            style={{
              width: "100%", padding: "18px 16px", borderRadius: 14,
              border: "2px solid #E5E7EB", fontSize: 24, fontWeight: 700,
              textAlign: "center", letterSpacing: 6, color: "#111827",
              outline: "none", boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleCodeSubmit}
            disabled={code.length < 4}
            style={{
              width: "100%", padding: 18, borderRadius: 14, border: "none",
              background: code.length < 4 ? "#E5E7EB" : "#22C55E",
              color: code.length < 4 ? "#9CA3AF" : "#fff",
              fontSize: 18, fontWeight: 700, marginTop: 16,
              cursor: code.length < 4 ? "default" : "pointer",
            }}
          >
            次へ
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
            あなたの名前を選んでください
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 20 }}>
            ○○老人クラブ
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, maxHeight: 320, overflowY: "auto" }}>
            {members.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedName(name)}
                style={{
                  width: "100%", padding: "16px 18px", borderRadius: 14,
                  border: selectedName === name ? "2px solid #22C55E" : "2px solid #E5E7EB",
                  background: selectedName === name ? "#DCFCE7" : "#fff",
                  fontSize: 18, fontWeight: selectedName === name ? 700 : 500,
                  color: "#111827", cursor: "pointer", textAlign: "left",
                }}
              >
                {name}
              </button>
            ))}
          </div>

          <button
            onClick={onLogin}
            disabled={!selectedName}
            style={{
              width: "100%", padding: 18, borderRadius: 14, border: "none",
              background: !selectedName ? "#E5E7EB" : "#22C55E",
              color: !selectedName ? "#9CA3AF" : "#fff",
              fontSize: 18, fontWeight: 700,
              cursor: !selectedName ? "default" : "pointer",
            }}
          >
            ログインする
          </button>
        </>
      )}
    </div>
  );
}

// --- 管理者ログイン ---
function AdminLogin({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  const inputStyle = {
    width: "100%", padding: "16px", borderRadius: 14,
    border: "2px solid #E5E7EB", fontSize: 16, color: "#111827",
    outline: "none", boxSizing: "border-box" as const,
  };

  const canSubmit = email && password && !loading;

  return (
    <div style={{
      background: "#fff", borderRadius: 24, padding: "32px 24px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", fontSize: 16, color: "#22C55E",
          cursor: "pointer", fontWeight: 700, padding: 0, marginBottom: 20,
          display: "flex", alignItems: "center", gap: 4,
        }}
      >
        ‹ 戻る
      </button>

      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
        管理者ログイン
      </div>
      <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 24 }}>
        メールアドレスとパスワードを入力
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            width: "100%", padding: 18, borderRadius: 14, border: "none",
            background: canSubmit ? "#22C55E" : "#E5E7EB",
            color: canSubmit ? "#fff" : "#9CA3AF",
            fontSize: 18, fontWeight: 700,
            cursor: canSubmit ? "pointer" : "default",
          }}
        >
          {loading ? "ログイン中..." : "ログインする"}
        </button>
      </form>
    </div>
  );
}
