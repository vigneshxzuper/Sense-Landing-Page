import HeroScrollAnimation from "@/components/HeroScrollAnimation";

/**
 * Demo route: visit /scroll-hero to verify the GSAP-driven hero in
 * isolation, then watch the next section come up cleanly once the pin
 * releases.
 */
export default function ScrollHeroDemoPage() {
  return (
    <main className="bg-black">
      <HeroScrollAnimation />

      {/* Placeholder next section — comes up after the hero unpins. */}
      <section className="min-h-screen bg-zinc-950 text-white grid place-items-center px-6">
        <div className="max-w-2xl text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
            You&rsquo;re inside.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg">
            Next section content lives here. The GSAP timeline above pins
            for 300vh, scrubs phase 1 → 3, and unpins exactly when the
            black overlay covers the viewport.
          </p>
        </div>
      </section>
    </main>
  );
}
