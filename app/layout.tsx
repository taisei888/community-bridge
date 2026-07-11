import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "会報AI - 老人クラブ会報かんたん作成",
  description: "必要な情報を入力するだけで、A4会報を自動生成。PPTX・PDFでダウンロード。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
