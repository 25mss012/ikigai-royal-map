import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/constants";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Ikigai — Discover Purpose, Meaning, and Direction", template: "%s · Ikigai" },
  description: "A private and practical Ikigai journey with reflection tools, an interactive purpose map, flow tracking, a 30-day plan, and a personal journal.",
  openGraph: { type: "website", siteName: "Ikigai — The Royal Map of Purpose", title: "Ikigai — Discover Purpose, Meaning, and Direction", description: "A private, practical journey to understand energy, meaning, connection, and momentum." },
  twitter: { card: "summary_large_image", title: "Ikigai — Discover Purpose, Meaning, and Direction", description: "Private reflection tools, purpose map, flow lab, 30-day plan, journal." },
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, title: "Ikigai", statusBarStyle: "default" },
  applicationName: "Ikigai — The Royal Map of Purpose",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF9EE" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-motion="full" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable} min-h-screen antialiased`}>
        <Providers>
          <SiteHeader />
          <main id="main" className="min-h-[60vh]">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
