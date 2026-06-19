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

export const metadata: Metadata = {
  applicationName: "Brit Ready",
  title: {
    default: "Brit Ready — Life in the UK",
    template: "%s · Brit Ready",
  },
  description:
    "A non-official, gamified way to prepare for the Life in the UK Test. Learn every fact, practise the format, and know when you are ready.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Brit Ready",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a1228",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
