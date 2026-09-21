import type {Metadata} from "next";
import type {ReactNode} from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: "Memory Calendar",
    description: "AI 기반 개인 기록 및 일정 관리 서비스",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="ko" className="h-full antialiased">
        <body className="min-h-full flex flex-col">
        {children}
        </body>
        </html>
    );
}