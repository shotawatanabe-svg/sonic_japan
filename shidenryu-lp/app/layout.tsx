import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sonic Japan — Authentic Japanese Culture Experience in Your Hotel Room",
  description:
    "Learn authentic Japanese culture from a professional troupe with decades of performing arts history. Sword fighting, tea ceremony, calligraphy and more — delivered to your hotel room.",
  keywords: [
    "Japanese culture experience",
    "samurai experience",
    "hotel activity",
    "Tokyo",
    "sword fighting",
    "tea ceremony",
    "calligraphy",
    "Sonic Japan",
  ],
  openGraph: {
    title: "Sonic Japan — Authentic Japanese Culture Experience in Your Hotel Room",
    description:
      "Learn authentic Japanese culture from professional masters. 9 unique experiences delivered to your hotel room.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} ${notoSansJP.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
