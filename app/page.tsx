import HeroSection from "@/components/sections/HeroSection";
import AnalyzeSection from "@/components/sections/AnalyzeSection";
import ActSection from "@/components/sections/ActSection";
import RadarSection from "@/components/sections/RadarSection";
import DocsAnimation from "@/components/sections/DocsAnimation";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <main style={{ background: "#09090B", overflowX: "hidden" }}>
      <HeroSection />
      <AnalyzeSection />
      <ActSection />
      <RadarSection />
      <DocsAnimation />
      <ShowcaseSection />
      <Footer />
    </main>
  );
}
