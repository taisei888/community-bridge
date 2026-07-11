import KaihoGenerator from "./components/KaihoGenerator";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #E2E4E9",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: "14px",
            }}>K</div>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#111" }}>
              会報AI
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {["入力", "生成", "保存"].map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: i === 0 ? "#2563EB" : "#E2E4E9",
                  color: i === 0 ? "#fff" : "#9CA3AF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 600,
                }}>{i + 1}</div>
                <span style={{
                  fontSize: "13px", fontWeight: 500,
                  color: i === 0 ? "#111" : "#9CA3AF",
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
        <KaihoGenerator />
      </div>
    </main>
  );
}
