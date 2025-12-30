import type { Metadata } from "next";
import { Amiri, Cairo, Inter, Scheherazade_New } from "next/font/google";
import "./globals.css";

// Heading fonts - Arabic-friendly
const amiri = Amiri({
  weight: ["400", "700"],
  variable: "--font-amiri",
  subsets: ["latin", "arabic"],
});

const cairo = Cairo({
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

// Body font - Modern and clean
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Arabic text font
const scheherazade = Scheherazade_New({
  weight: ["400", "700"],
  variable: "--font-scheherazade",
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: "Web Masjid - Islamic Design System",
  description: "Modern masjid web application with Islamic-inspired design system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${amiri.variable} ${cairo.variable} ${inter.variable} ${scheherazade.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
