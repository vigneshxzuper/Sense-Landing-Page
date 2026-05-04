import HeroSection from "@/components/sections/HeroSection";
import AnalyzeSection from "@/components/sections/AnalyzeSection";
import ActSection from "@/components/sections/ActSection";
import RadarSection from "@/components/sections/RadarSection";
import DocsAnimation from "@/components/sections/DocsAnimation";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import Footer from "@/components/sections/Footer";
import { TopicProvider } from "@/components/TopicContext";

export default function Page() {
  return (
    <TopicProvider>
      <main style={{ background: "var(--bg)", overflowX: "clip", transition: "background-color 0.5s" }}>
        <HeroSection />
        <AnalyzeSection />
        <ActSection />
        <RadarSection />
        <DocsAnimation />
        <ShowcaseSection />
        <Footer />
      </main>
    </TopicProvider>
  );
}
