import type { Metadata } from "next";
import { Inter, Press_Start_2P, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
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

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
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
    <html lang="en" className={`${inter.variable} ${pressStart2P.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ScrollReset />
          <SmoothScroll />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
