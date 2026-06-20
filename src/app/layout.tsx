import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { AmbientBackground } from "@/components/ambient-background";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Identity type: a heavy, characterful grotesque for display, Inter for body,
// JetBrains Mono for numeric accents.
const display = Bricolage_Grotesque({
  variable: "--font-display-loaded",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans-loaded",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
});

const SITE_URL = "https://brit-ready.vercel.app";
const siteTitle = "Brit Ready — Life in the UK";
const siteDescription =
  "A non-official, gamified way to prepare for the Life in the UK Test. Learn every fact, practise the format, and know when you are ready.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Brit Ready",
  title: {
    default: siteTitle,
    template: "%s · Brit Ready",
  },
  description: siteDescription,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Brit Ready",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "Brit Ready",
    title: siteTitle,
    description: siteDescription,
    url: "/",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Brit Ready" }],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: ["/icons/icon-512.png"],
  },
};

// No maximumScale/userScalable lock — pinch-zoom must stay available (WCAG 1.4.4).
export const viewport: Viewport = {
  themeColor: "#0a1228",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html
    lang="en"
    className={`${display.variable} ${sans.variable} ${mono.variable}`}
    suppressHydrationWarning
  >
    <body>
      <AmbientBackground />
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
