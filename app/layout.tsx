import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Nyx Scholars | Ivy League+ SAT, ACT, and AP Tutoring",
    template: "%s | Nyx Scholars",
  },
  description:
    "Premium SAT, ACT, and AP tutoring from Ivy League+ college mentors. Personalized 1:1 test prep for ambitious students.",
  keywords: ["SAT tutoring", "ACT tutoring", "AP tutoring", "Ivy League tutors", "test prep", "college admissions"],
  openGraph: {
    title: "Nyx Scholars | Ivy League+ SAT, ACT, and AP Tutoring",
    description:
      "Premium SAT, ACT, and AP tutoring from Ivy League+ college mentors. Personalized 1:1 test prep for ambitious students.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="bg-[#0a0d14] text-[#f0ede6] min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
