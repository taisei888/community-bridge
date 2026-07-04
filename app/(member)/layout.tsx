import BottomTabs from "../components/BottomTabs";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {children}
      <BottomTabs />
    </div>
  );
}
