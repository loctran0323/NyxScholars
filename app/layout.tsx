import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/system/ThemeProvider";
import { ThemeInitScript } from "@/components/system/ThemeInitScript";
import { ToastProvider } from "@/components/system/Toast";
import { Analytics } from "@/components/system/Analytics";
import { PwaRegister } from "@/components/system/PwaRegister";
import { NpsPrompt } from "@/components/system/NpsPrompt";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nyx | 1:1 SAT tutoring with vetted Ivy League students",
    template: "%s | Nyx",
  },
  description:
    "Online 1:1 SAT, ACT, AP, and admissions tutoring from current Princeton, Harvard, Yale, MIT, Stanford, and Columbia undergraduates. Free 30-minute trial. Pay by the session.",
  keywords: ["SAT tutoring", "Ivy League tutors", "ACT tutoring", "AP tutoring", "college admissions", "online tutoring", "Nyx"],
  manifest: "/manifest.webmanifest",
  applicationName: "Nyx Scholars",
  appleWebApp: { capable: true, title: "Nyx", statusBarStyle: "black-translucent" },
  openGraph: {
    title: "Nyx | 1:1 SAT tutoring with vetted Ivy League students",
    description:
      "1:1 online tutoring with current Ivy League undergraduates. Free 30-minute trial. Pay by the session.",
    type: "website",
    siteName: "Nyx Scholars",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyx | 1:1 SAT tutoring with vetted Ivy League students",
    description: "1:1 online tutoring with current Ivy League undergraduates. Free 30-minute trial.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#050816" },
    { media: "(prefers-color-scheme: light)", color: "#faf6ec" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${cormorant.variable} h-full`}
    >
      <head>
        <ThemeInitScript />
      </head>
      <body className="text-[var(--text-1)] min-h-screen flex flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-3 focus:py-2 focus:rounded-lg focus:bg-[var(--surface-elevated)] focus:text-[var(--text-1)] focus:border focus:border-[var(--border-accent)]"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <Analytics />
            <PwaRegister />
            <NpsPrompt />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
