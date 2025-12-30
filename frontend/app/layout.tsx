import type { Metadata } from "next";
import { Amiri, Cairo, Inter, Scheherazade_New } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { QueryProvider } from "@/components/shared/query-provider";
import { Toaster } from "sonner";
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
  title: "Masjid Baiturrahim - Website Resmi",
  description: "Website resmi Masjid Baiturrahim - Informasi kegiatan, jadwal sholat, donasi, dan pengumuman",
  keywords: ["masjid", "islam", "jakarta", "sholat", "donasi", "kegiatan"],
  openGraph: {
    title: "Masjid Baiturrahim",
    description: "Pusat kegiatan keislaman dan kemasyarakatan",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${amiri.variable} ${cairo.variable} ${inter.variable} ${scheherazade.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
