import type { Metadata } from "next";

import "@fontsource-variable/vazirmatn";

import AppHeader from "@/components/AppHeader";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

import "./globals.css";

export const metadata: Metadata = {
  title: "بصرفه",
  description: "مقایسه سریع قیمت محصولات بر اساس وزن یا حجم",
  applicationName: "بصرفه",
  appleWebApp: {
    capable: true,
    title: "بصرفه",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ServiceWorkerRegister />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
