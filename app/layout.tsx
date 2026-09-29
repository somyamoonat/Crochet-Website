import type { Metadata } from "next";
import { Fraunces, Nunito, Caveat } from "next/font/google";
import { getBaseUrl } from "@/lib/constants";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "The Crochet Diaryy | Handcrafted with Love",
    template: "%s | The Crochet Diaryy",
  },
  description:
    "Handmade crochet treasures by Nitika Tanted. Discover cute amigurumi plushies, eternal flower bouquets, daisy tote bags, and custom keepsakes stitched with love.",
  keywords: [
    "crochet",
    "handmade gifts",
    "artisan crochet",
    "nitika tanted",
    "amigurumi",
    "crochet bouquet",
    "the crochet diaryy",
    "crochet accessories",
  ],
  authors: [{ name: "Nitika Tanted", url: "https://instagram.com/the_crochetdiaryy" }],
  creator: "Nitika Tanted",
  publisher: "The Crochet Diaryy",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "The Crochet Diaryy",
    title: "The Crochet Diaryy | Handcrafted with Love",
    description:
      "Handmade crochet treasures by Nitika Tanted. Cute amigurumi toys, eternal flowers, cozy bags, and customized keepsakes.",
    images: [
      {
        url: "/images/hero-showcase.jpg",
        width: 1200,
        height: 630,
        alt: "The Crochet Diaryy — Handcrafted crochet creations by Nitika Tanted",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Crochet Diaryy | Handcrafted with Love",
    description:
      "Handmade crochet treasures by Nitika Tanted. Cute amigurumi toys, eternal flowers, cozy bags, and customized keepsakes.",
    images: ["/images/hero-showcase.jpg"],
    creator: "@the_crochetdiaryy",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import { SessionProvider } from "@/components/auth/session-provider";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${nunito.variable} ${caveat.variable} font-body bg-brand-bg text-brand-text min-h-screen antialiased selection:bg-brand-accent/50 selection:text-brand-text relative`}
      >
        {/* Accessible Keyboard Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-primary focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary text-xs font-bold"
        >
          Skip to main content
        </a>
        <SessionProvider>
          <div id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <WhatsAppButton />
          <MobileBottomNav />
        </SessionProvider>
      </body>
    </html>
  );
}
