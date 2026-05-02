import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nyx | Adaptive SAT prep, calibrated by Ivy-tier students",
    template: "%s | Nyx",
  },
  description:
    "Adaptive SAT preparation built around your gaps, your pace, and your target score — written and vetted by Ivy-tier students.",
  keywords: ["SAT prep", "adaptive SAT", "Nyx", "Ivy League tutors", "test prep", "college admissions"],
  openGraph: {
    title: "Nyx | Adaptive SAT prep",
    description:
      "Adaptive SAT preparation built around your gaps, your pace, and your target score.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}
    >
      <body className="text-[var(--text-1)] min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
