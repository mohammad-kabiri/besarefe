import type { Metadata } from "next";

import AppHeader from "@/components/AppHeader";

import "./globals.css";

export const metadata: Metadata = {
  title: "مقایسه قیمت واحد",
  description: "مقایسه قیمت محصولات بر اساس وزن یا حجم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
