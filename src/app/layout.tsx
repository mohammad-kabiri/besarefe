import type { Metadata } from "next";

import "@fontsource-variable/vazirmatn";

import AppHeader from "@/components/AppHeader";

import "./globals.css";

export const metadata: Metadata = {
  title: "بصرفه",
  description: "مقایسه سریع قیمت محصولات بر اساس وزن یا حجم",
  applicationName: "بصرفه",
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
