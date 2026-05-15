import HeroScrollAnimation from "@/components/HeroScrollAnimation";
import AnalyzeSection from "@/components/sections/AnalyzeSection";
import RadarSection from "@/components/sections/RadarSection";
import IntelligenceSection from "@/components/sections/IntelligenceSection";
import DocsAnimation from "@/components/sections/DocsAnimation";
import AnywhereSection from "@/components/sections/AnywhereSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import Footer from "@/components/sections/Footer";
import { TopicProvider } from "@/components/TopicContext";

export default function Page() {
  return (
    <TopicProvider>
      <main style={{ background: "var(--bg)", overflowX: "clip", transition: "background-color 0.5s" }}>
        <HeroScrollAnimation />
        <AnalyzeSection />
        {/* ActSection now lives inside AnalyzeSection's Mac window */}
        <RadarSection />
        <IntelligenceSection />
        <AnywhereSection />
        <TestimonialsSection />
        <DocsAnimation />
        <Footer />
      </main>
    </TopicProvider>
  );
}
