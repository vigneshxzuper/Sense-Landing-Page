import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zuper Sense — AI Intelligence Layer for Field Service",
  description: "Zuper Sense turns your operational data into plain-English answers — and turns those answers into action.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body style={{ margin: 0, background: "#09090B", color: "#FAFAFA", fontFamily: "var(--font-inter, Inter, system-ui, sans-serif)" }}>

        {children}
      </body>
    </html>
  );
}
