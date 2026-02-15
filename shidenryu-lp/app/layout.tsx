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
  title: "SHIDENRYU — Samurai Experience in Your Hotel Room",
  description:
    "Experience authentic Japanese culture in your hotel room. Sword fighting, tea ceremony, calligraphy and more. Professional performers come to you.",
  keywords: [
    "samurai experience",
    "Japanese culture",
    "hotel activity",
    "Tokyo",
    "sword fighting",
    "tea ceremony",
    "calligraphy",
  ],
  openGraph: {
    title: "SHIDENRYU — Samurai Experience in Your Hotel Room",
    description:
      "Experience authentic Japanese culture in your hotel room. Professional performers come to you.",
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
