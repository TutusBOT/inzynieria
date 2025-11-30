import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ExposeShadcn from "@/components/ExposeShadcn";
// Import safelist to ensure Tailwind includes all classes
import "@/lib/tailwind-safelist";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generator Interfejsów UI - AI",
  description: "Generuj interfejsy webowe za pomocą LLM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ExposeShadcn />
        {children}
      </body>
    </html>
  );
}
