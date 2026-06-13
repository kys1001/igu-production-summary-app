import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "이구산업 생산일보 요약 자동화",
  description:
    "생산 메모와 일일 실적을 입력하면 회의자료와 핵심 이슈를 자동 정리하는 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
