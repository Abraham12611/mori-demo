export const dynamic = 'force-dynamic';

import type { Metadata, Viewport } from "next";

import { DM_Sans, DM_Mono } from "next/font/google";

import "./globals.css";
import Providers from "./_contexts";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mori Protocol",
  description: "Humanized Artificial Intelligence Through Natural Emergence",
  themeColor: "#F9F9F4",
  openGraph: {
    title: "Mori Protocol",
    description: "Humanized Artificial Intelligence Through Natural Emergence",
    type: "website",
    images: [
      {
        url: "/mori-origami-forest.png",
        width: 1200,
        height: 630,
        alt: "Mori Protocol"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mori Protocol",
    description: "Humanized Artificial Intelligence Through Natural Emergence",
    images: ["/mori-origami-forest.png"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased bg-white dark:bg-neutral-900`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
