import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollReset from "@/components/ScrollReset";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zuper Sense — AI Intelligence Layer for Field Service",
  description: "Zuper Sense turns your operational data into plain-English answers — and turns those answers into action.",
};

// Force dark theme site-wide
const themeScript = `
(function(){
  try {
    document.documentElement.setAttribute('data-theme', 'dark');
  } catch(e) {}
})()
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${pressStart2P.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ScrollReset />
          <SmoothScroll />
          <ScrollProgress />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
