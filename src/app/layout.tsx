import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VentureForge Enterprise | Autonomous Work-to-Match Protocol",
  description: "Enterprise work-to-match autonomous candidate assessment and telemetry console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-full bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300`}
      >
        {children}
      </body>
    </html>
  );
}
