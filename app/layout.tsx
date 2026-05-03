import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/shared/SiteChrome";

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
  openGraph: {
    title: "Nyx | 1:1 SAT tutoring with vetted Ivy League students",
    description:
      "1:1 online tutoring with current Ivy League undergraduates. Free 30-minute trial. Pay by the session.",
    type: "website",
  },
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
      <body className="text-[var(--text-1)] min-h-screen flex flex-col antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
