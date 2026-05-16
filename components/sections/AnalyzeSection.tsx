"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SenseLogo from "@/components/SenseLogo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SenseChat } from "@/components/ui/sense-chat";
import ScrollFloat from "@/components/ScrollFloat";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}
import { Sparkles, CheckCircle2, Loader2, Phone, Mail, MessageSquare, Zap, AlertTriangle, Lightbulb, Clock, FileText, Receipt } from "lucide-react";
import { useDeployedTopic, type DeployTopic } from "@/components/TopicContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

function BrowserOutlineBackdrop({ revealed, parallax }: { revealed: boolean; parallax: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        transform: `translateY(${parallax + 130}px)`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: "min(1000px, 78%)",
          position: "relative",
          opacity: revealed ? 1 : 0,
          transform: revealed
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.97)",
          transition:
            "opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform, opacity",
        }}
      >
      {/* Glass fill matching window frame — bottom fades to nothing so
          the 3-sided frame doesn't read as a clipped rectangle. */}
      <div
        style={{
          position: "absolute",
          left: "1.25%",
          top: "3.57%",
          right: "1.25%",
          bottom: "3.57%",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.015) 100%)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "none",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          pointerEvents: "none",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0) 100%)",
        }}
      />
      <svg
        viewBox="0 0 1600 1120"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          filter:
            "drop-shadow(0 0 0.5px rgba(255,255,255,0.6)) drop-shadow(0 0 6px rgba(255,255,255,0.28)) drop-shadow(0 0 18px rgba(255,255,255,0.16)) drop-shadow(0 0 40px rgba(255,255,255,0.08))",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0) 100%)",
        }}
      >
        <g
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Window frame — open at the bottom (3 sides only). Top + L/R
              edges drop straight down; the mask gradient fades them out
              before they would meet a bottom edge. */}
          <path d="M 20 1080 L 20 62 A 22 22 0 0 1 42 40 L 1558 40 A 22 22 0 0 1 1580 62 L 1580 1080" />
          {/* Title bar divider */}
          <line x1="20" y1="110" x2="1580" y2="110" />
        </g>

        {/* Traffic light dots — macOS canonical */}
        <g>
          <circle cx="58" cy="75" r="8" fill="#FF5F56" />
          <circle cx="86" cy="75" r="8" fill="#FFBD2E" />
          <circle cx="114" cy="75" r="8" fill="#27C93F" />
        </g>

        {/* URL pill — centered, minimal */}
        <rect x="640" y="60" width="320" height="28" rx="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.8" />
      </svg>
      </div>
    </div>
  );
}

type Topic = "performance" | "sla" | "revenue" | null;

/* ── TOPIC CONFIG ── */
const TOPIC_CONFIG = {
  revenue: {
    question: "How much cash is stuck in unpaid invoices?",
    aiText: "Over the last 3 months, overdue invoices climbed hard into April before easing in May. Amount Overdue peaked at $2.10M in April across 40 overdue invoices, up from $1.45M in March and just $18.3K in February — the main signal is that the backlog built fast in March and April, even though the oldest debt was actually in February at 89 max days past due.",
  },
  performance: {
    question: "Aging supplements by carrier",
    aiText: "7 supplements are past 30 days. $164,300 waiting across 4 carriers.",
  },
  sla: {
    question: "Estimates over $25K that need follow-up",
    aiText: "12 estimates totaling $483,000. Average age since last touch: 14 days.",
  },
};

/* ── CHART DATA ── */
const missedCallKpis = [
  { label: "AMOUNT OVERDUE", value: "$2.10M" },
  { label: "OVERDUE INVOICES", value: "40" },
  { label: "MAX DAYS PAST DUE", value: "89", accent: "#ef4444" },
];
const missedCallRows = [
  { time: "Apr 2026", caller: "Peak month", reason: "Largest backlog buildup", value: "$2.10M", urgent: true },
  { time: "Mar 2026", caller: "Ramp-up",    reason: "Backlog accelerates from $18K → $1.45M", value: "$1.45M" },
  { time: "Feb 2026", caller: "Oldest debt", reason: "89 max days past due — earliest exposure", value: "$18.3K" },
];
const missedCallMore = 0;
const carrierAgingRows = [
  { carrier: "State Farm", pending: 72400, days: 47 },
  { carrier: "Allstate", pending: 41800, days: 38 },
  { carrier: "USAA", pending: 29600, days: 33 },
  { carrier: "Farmers", pending: 20500, days: 31 },
];
const carrierAgingChart = {
  labels: carrierAgingRows.map((r) => r.carrier),
  datasets: [
    {
      label: "$ pending",
      data: carrierAgingRows.map((r) => r.pending),
      backgroundColor: ["rgba(232,93,58,0.85)", "rgba(232,93,58,0.6)", "rgba(232,93,58,0.45)", "rgba(232,93,58,0.32)"],
      borderRadius: 6,
      barPercentage: 0.7,
    },
  ],
};
const carrierChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1e1e24",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#A1A1AA",
      cornerRadius: 8,
      padding: 10,
      callbacks: {
        label: (ctx: any) => `$${ctx.parsed.x.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.08)" },
      ticks: {
        color: "rgba(255,255,255,0.7)",
        font: { size: 12 },
        callback: (v: any) => `$${(Number(v) / 1000).toFixed(0)}k`,
      },
      border: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: { color: "#ffffff", font: { size: 13, weight: 500 } },
      border: { display: false },
    },
  },
};
const chartOpts = (max: number) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom" as const, labels: { color: "var(--ink2)", padding: 20, usePointStyle: true, font: { size: 13 } } },
    tooltip: { backgroundColor: "#1e1e24", borderColor: "rgba(255,255,255,0.1)", borderWidth: 1, titleColor: "#fff", bodyColor: "#A1A1AA", cornerRadius: 8, padding: 10 },
  },
  scales: {
    x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "var(--ink2)", font: { size: 12 } }, border: { display: false } },
    y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "var(--ink2)", font: { size: 12 } }, border: { display: false }, max },
  },
});

const estimateKpis = [
  { label: "ESTIMATES", value: "12" },
  { label: "TOTAL VALUE", value: "$483K" },
  { label: "AT RISK OF AGING OUT", value: "$318K" },
];
const estimateRows = [
  { name: "Hargrove residence", value: 68400, days: 19 },
  { name: "Elmwood HOA", value: 54200, days: 16 },
  { name: "Okafor residence", value: 41900, days: 12 },
];
const estimateMore = 9;
/* ── Typewriter hook ── */
function useTypewriter(text: string, speed = 20, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, active]);
  return { displayed, done };
}

/* ── COMPONENT ── */
type ActVariant = {
  agent: { name: string; role: string; status: string; tagline: string };
  steps: string[];
  capabilities: string[];
  log: { icon: "call" | "email" | "text"; text: string; time: string }[];
  recap: { value: string; label: string }[];
  caption: string;
};

const ACT_VARIANTS: Record<DeployTopic, ActVariant> = {
  performance: {
    agent: { name: "Casey", role: "Collections Agent", status: "Working", tagline: "Collections Agent working those aging supplements live." },
    steps: ["Pulling supplements aged 30+ days", "Scoring claims by payout likelihood", "Drafting outreach to adjusters", "Placing calls to top 4 carriers", "Logging responses back to the job"],
    capabilities: ["Carrier AR", "Homeowner balances", "Supplement payouts"],
    log: [
      { icon: "call", text: "Called State Farm on claim 47220", time: "4 min ago" },
      { icon: "email", text: "Escalated Allstate claim AL-2210", time: "11 min ago" },
      { icon: "call", text: "Called USAA on claim 88041", time: "18 min ago" },
      { icon: "call", text: "Swept Farmers on 4 smaller claims", time: "26 min ago" },
    ],
    recap: [
      { value: "$31,400", label: "committed Thursday" },
      { value: "$20,500", label: "in flight" },
      { value: "$24,020", label: "escalated" },
    ],
    caption: "Casey worked 7 stuck supplements · Carrier DSO 72 → 41 days",
  },
  sla: {
    agent: { name: "Morgan", role: "Sales Coach Agent", status: "Working", tagline: "Sales Coach Agent re-engaging your biggest dormant estimates." },
    steps: ["Ranking estimates by value and age", "Pulling inspection notes for each", "Drafting personalized outreach", "Calling top 5 prospects", "Scheduling second inspections"],
    capabilities: ["Estimate follow-up", "Objection handling", "Financing options"],
    log: [
      { icon: "call", text: "Called Hargrove residence", time: "6 min ago" },
      { icon: "text", text: "Texted Elmwood HOA board", time: "13 min ago" },
      { icon: "call", text: "Called Okafor residence", time: "21 min ago" },
      { icon: "email", text: "Emailed 9 smaller estimates", time: "34 min ago" },
    ],
    recap: [
      { value: "1", label: "walk-through booked" },
      { value: "$218,500", label: "re-pitched" },
      { value: "3", label: "warm replies" },
    ],
    caption: "Morgan worked 12 dormant estimates · $167K recovered and climbing",
  },
  revenue: {
    agent: { name: "Casey", role: "Collections Agent", status: "Working", tagline: "Collections Agent chasing the $2.10M overdue stack, oldest first." },
    steps: [
      "Pulling 40 overdue invoices",
      "Scoring each by amount × days past due",
      "Drafting personalized outreach",
      "Calling top 6 accounts in priority order",
      "Logging promise-to-pay back to the invoice",
    ],
    capabilities: ["AR follow-up", "Promise-to-pay tracking", "Carrier escalation"],
    log: [
      { icon: "call", text: "Called Meridian Builders on $148K invoice", time: "4 min ago" },
      { icon: "email", text: "Sent dunning letter to State Farm on 89-day-old claim", time: "12 min ago" },
      { icon: "call", text: "Reached Hargrove Construction — PTP secured for Friday", time: "21 min ago" },
      { icon: "call", text: "Swept 3 small accounts under $5K", time: "30 min ago" },
    ],
    recap: [
      { value: "$148K", label: "PTP secured" },
      { value: "$72K",  label: "escalated to adjuster" },
      { value: "$24K",  label: "auto-collected" },
    ],
    caption: "Casey worked 40 overdue invoices · $244K committed, average days past due 38 → 21",
  },
};

export default function AnalyzeSection() {
  const [topic, setTopic] = useState<Topic>(null);
  const [view, setView] = useState<"ask" | "analyze" | "act">("ask");
  // Separate tab state for the 4-tab UI on top of the Mac frame. Drawn
  // from the same scroll progress as `view`, but split into 4 quartiles
  // so the visible journey reads as Monitor → Analyze → Predict →
  // Recommend even though the underlying content has 3 phases.
  const [activeTab, setActiveTab] = useState<"monitor" | "analyze" | "predict" | "recommend">("monitor");
  // Set true the moment the SenseChat in the intro fires the
  // "sense-radar-added" custom event — the Monitor view then surfaces
  // the Overdue-invoices card alongside the 3 always-on radar tiles.

  // No auto-scroll — scrolling alone drives the whole journey, so
  // scrolling back up restores the intro (title + prompt box +
  // result card) naturally as introProgress decreases.

  const { deployedTopic, setDeployedTopic } = useDeployedTopic();
  const [actCompleted, setActCompleted] = useState<number[]>([]);
  const [actActive, setActActive] = useState(-1);
  // Radar add-to-radar CTA — appears once Casey's stepper hits the final
  // "Logging responses back to the job" beat. Click flips it to a green
  // "Added to radar" confirmation that fades out after a short hold.
  const [radarAdded, setRadarAdded] = useState(false);
  const [radarHidden, setRadarHidden] = useState(false);
  // Auto-click choreography:
  //   hidden  → no cursor yet (waiting for steps to finish)
  //   moving  → cursor flies in from bottom-left toward the button
  //   pressed → cursor sits on the button with a quick press squish
  //   done    → cursor faded; button has flipped to confirmation
  const [cursorPhase, setCursorPhase] = useState<"hidden" | "moving" | "pressed" | "done">("hidden");
  // View overlays sit on top of one another — no slide distance, just
  // an opacity swap. Transition is set to "none" so the Mac-window
  // content snaps the moment the tab crosses its scroll threshold.
  const offsetFor = (_own: "ask" | "analyze" | "act") => 0;
  const isActive = (own: "ask" | "analyze" | "act") => own === view;
  const viewTransition = "opacity 240ms cubic-bezier(0.22, 1, 0.36, 1)";

  // Auto-click choreography. Triggers when all stepper items have
  // completed: cursor flies in (560ms), presses (180ms), then the button
  // flips to the green confirmation and the cursor fades out.
  // cursorPhase is intentionally NOT a dep — including it caused this
  // effect to re-run and cancel its own pending timers as soon as t1
  // flipped phase to "moving", so the green confirmation never landed.
  useEffect(() => {
    if (view !== "act") return;
    const total = ACT_VARIANTS[deployedTopic].steps.length;
    if (actCompleted.length !== total) return;
    const t1 = setTimeout(() => setCursorPhase("moving"), 380);
    const t2 = setTimeout(() => setCursorPhase("pressed"), 380 + 620);
    const t3 = setTimeout(() => {
      setRadarAdded(true);
      setCursorPhase("done");
    }, 380 + 620 + 180);
    const t4 = setTimeout(() => setRadarHidden(true), 380 + 620 + 180 + 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [actCompleted, view, deployedTopic]);

  // Run the Act stepper sequence whenever view enters "act".
  // Reset all act state when leaving so a re-entry (forward OR from
  // scroll-up back through analyze) replays cleanly from the top.
  useEffect(() => {
    if (view !== "act") {
      setActCompleted([]);
      setActActive(-1);
      setRadarAdded(false);
      setRadarHidden(false);
      setCursorPhase("hidden");
      return;
    }
    setActCompleted([]);
    setActActive(-1);
    setRadarAdded(false);
    setRadarHidden(false);
    setCursorPhase("hidden");
    const variant = ACT_VARIANTS[deployedTopic];
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Whole 5-step sequence runs in ~2s. Each step gets an equal slice
    // (totalMs / count); it activates at the slice start and checks off
    // at the slice end so the last item lands right at 2000ms.
    const totalMs = 2000;
    const stride = totalMs / variant.steps.length;
    variant.steps.forEach((_, i) => {
      timers.push(setTimeout(() => setActActive(i), i * stride));
      timers.push(setTimeout(() => setActCompleted((p) => [...p, i]), (i + 1) * stride));
    });
    return () => timers.forEach(clearTimeout);
  }, [view, deployedTopic]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const config = topic ? TOPIC_CONFIG[topic] : null;
  const { displayed: aiText, done: aiDone } = useTypewriter(config?.aiText || "", 3, showAiResponse);

  // Show chart once typing finishes
  useEffect(() => {
    if (aiDone) {
      const t = setTimeout(() => setShowChart(true), 60);
      return () => clearTimeout(t);
    }
  }, [aiDone]);

  const hasTriggered = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const askRef = useRef<HTMLDivElement>(null);
  const chatPinRef = useRef<HTMLDivElement>(null);
  const [chatProgress, setChatProgress] = useState(0);

  // Pin the prompt block while it plays. ScrollTrigger maps the 200%
  // pin region to chatProgress 0 → 1. SenseChat reads this and
  // scrubs every beat of typing → cursor → result → "Added to Radar".
  // High-water-mark: scrolling back UP does not rewind. Only a page
  // reload resets it (chatProgress state initialises to 0 on mount).
  useGSAP(() => {
    if (!chatPinRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
      // No pin on mobile — page is short and pinning fights touch scroll.
      setChatProgress(1);
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: chatPinRef.current,
      start: "top top",
      end: "+=180%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: 1,
      onUpdate: (self) => {
        setChatProgress((prev) => Math.max(prev, self.progress));
      },
    });
    return () => trigger.kill();
  }, { scope: sectionRef });

  // SenseChat fires `sense-radar-added` once its auto-cursor presses
  // the Add-to-Radar pill. Flip a flag so the rest of the section can
  // react (Monitor card glow, etc.) and auto-scroll smoothly to the
  // Mac-window section right after the user sees "Added to Radar".
  const [overdueOnRadar, setOverdueOnRadar] = useState(false);
  useEffect(() => {
    const onAdded = () => {
      setOverdueOnRadar(true);
      // Brief beat to let the green "Added to Radar" pill register,
      // then smooth-scroll past the prompt block into the Mac window.
      setTimeout(() => {
        const el = askRef.current;
        if (!el) return;
        const targetY = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }, 900);
    };
    window.addEventListener("sense-radar-added", onAdded);
    return () => window.removeEventListener("sense-radar-added", onAdded);
  }, []);

  // Stepper visibility tracks scroll position both directions so that
  // scrolling BACK up to the prompt hides the stepper again. Shown
  // when the Mac-window top is within ~240px of the viewport top
  // (about to take the sticky spot); hidden otherwise.
  const [stepperShown, setStepperShown] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el = askRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Visible only while the Mac-window block is in the viewport.
      // Hides on scroll past so the tab bar doesn't bleed over the
      // sections below (Radar / Anywhere).
      const inFrame = rect.top < 240 && rect.bottom > 80;
      setStepperShown(inFrame);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-driven tab progression. The Mac-window block is pinned
  // while the user scrolls through it; scroll progress maps to the
  // active tab. Clicking a tab scrolls to the corresponding progress
  // position within the pinned region.
  const TAB_ORDER = ["monitor", "analyze", "predict", "recommend"] as const;
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [tabProgress, setTabProgress] = useState(0); // 0..1 progress within the current tab range

  const tabToView = (t: typeof TAB_ORDER[number]): "ask" | "analyze" | "act" =>
    t === "monitor" ? "ask" : t === "recommend" ? "act" : "analyze";

  // Pin askRef and map scroll progress to active tab + per-tab progress.
  // Pinning is desktop-only — on mobile we let the section scroll
  // naturally and use IntersectionObserver per tab block instead.
  useGSAP(() => {
    if (!askRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;
    const trigger = ScrollTrigger.create({
      trigger: askRef.current,
      start: "top top",
      end: "+=320%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const idx = Math.min(TAB_ORDER.length - 1, Math.floor(p * TAB_ORDER.length));
        const nextTab = TAB_ORDER[idx];
        const nextView = tabToView(nextTab);
        setActiveTab((prev) => (prev === nextTab ? prev : nextTab));
        setView((prev) => (prev === nextView ? prev : nextView));
        const local = p * TAB_ORDER.length - idx; // 0..1 within current tab
        setTabProgress(Math.max(0, Math.min(1, local)));
      },
    });
    triggerRef.current = trigger;
    return () => {
      trigger.kill();
      triggerRef.current = null;
    };
  }, { scope: sectionRef });


  // Click a tab → scroll to that tab's range start within the pinned
  // region. On mobile (no pin), just set the active tab directly.
  const jumpToTab = (key: typeof TAB_ORDER[number]) => {
    const trigger = triggerRef.current;
    if (!trigger) {
      setActiveTab(key);
      setView(tabToView(key));
      setTabProgress(0);
      return;
    }
    const idx = TAB_ORDER.indexOf(key);
    const target = trigger.start + ((trigger.end - trigger.start) * idx) / TAB_ORDER.length + 4;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Stage setup driven by scroll-derived view. Replaces the old
  // auto-deploy timer — entering analyze fires the typewriter, entering
  // act sets the deployed topic, returning to ask resets.
  useEffect(() => {
    if (view === "ask") {
      setShowQuestion(false);
      setShowAiResponse(false);
      setShowChart(false);
      return;
    }
    if (view === "analyze") {
      setTopic((prev) => prev ?? "revenue");
      const t1 = setTimeout(() => setShowQuestion(true), 80);
      const t2 = setTimeout(() => setShowAiResponse(true), 300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    if (view === "act") {
      setDeployedTopic((topic ?? "revenue") as DeployTopic);
    }
  }, [view, topic, setDeployedTopic]);
  const [askProgress, setAskProgress] = useState(0);
  const [backdropRevealed, setBackdropRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = askRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const distance = vh - rect.top;
      const total = vh;
      const p = Math.max(0, Math.min(1, distance / total));
      setAskProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (askProgress > 0.15 && !backdropRevealed) {
      const t = setTimeout(() => setBackdropRevealed(true), 500);
      return () => clearTimeout(t);
    }
  }, [askProgress, backdropRevealed]);

  // Mobile: trigger backdrop reveal via IntersectionObserver as soon
  // as the Mac-window block enters the viewport — scroll-progress math
  // can lag on short mobile viewports, so observe directly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    const el = askRef.current;
    if (!el || backdropRevealed) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setBackdropRevealed(true);
        io.disconnect();
      }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [backdropRevealed]);

  // Content inside the Mac window fades in ~400ms AFTER the chrome
  // has revealed, so the user sees the window arrive first and then
  // the dashboard / chat / agent populate.
  const [contentRevealed, setContentRevealed] = useState(false);
  useEffect(() => {
    if (backdropRevealed && !contentRevealed) {
      const t = setTimeout(() => setContentRevealed(true), 400);
      return () => clearTimeout(t);
    }
  }, [backdropRevealed, contentRevealed]);

  // Mobile: no auto-cycle, no scroll animation. Show Monitor tab by
  // default — users can tap any other tab to switch. Everything is
  // static and readable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    setActiveTab("monitor");
    setView("ask");
    setTabProgress(0);
  }, []);

  const parallaxOffset = (askProgress - 0.5) * -50;
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const effectiveParallax = mobile ? 0 : parallaxOffset;

  const [selectedIdx, setSelectedIdx] = useState(0);
  // Chip click jumps the tab cycle straight to Analyze.
  const triggerTopic = (t: Topic) => {
    setShowChart(false);
    setTopic(t);
    setSelectedIdx(0);
    jumpToTab("analyze");
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const t = (e as CustomEvent).detail?.topic as Topic;
      hasTriggered.current = true;
      triggerTopic(t);
    };
    window.addEventListener("sense-chip-click", handler);
    return () => window.removeEventListener("sense-chip-click", handler);
  }, []);

  // No auto-trigger — page lands on the Ask view; user picks a prompt to advance.

  const cardStyle: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "var(--card-shadow)",
  };

  return (
    <section
      id="analyze-section"
      ref={sectionRef}
      style={{ background: "var(--bg)", padding: "0 24px", position: "relative", marginTop: "-2px" }}
    >
      {/* Intro band — title + prompt bar. Plays the chat sequence on
          auto timers when the chat enters the viewport. Once the
          radar add fires, the "Added to Radar" pill stays visible —
          the intro doesn't fade out; the user scrolls past it on
          their own to reach the Mac window below. */}
      <div
        ref={chatPinRef}
        style={{
          padding: "80px 24px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "clamp(34px, 4.4vw, 56px)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.06,
              margin: "0 auto 16px",
              maxWidth: "720px",
              color: "var(--ink)",
              fontFeatureSettings: '"ss01", "cv11"',
            }}
          >
            Begin with the question.
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 1.6vw, 19px)",
              lineHeight: 1.55,
              color: "var(--ink2)",
              maxWidth: "640px",
              margin: "0 auto 24px",
              fontWeight: 450,
            }}
          >
            Whatever you&apos;ve been wondering about the business, you can finally just ask.
          </p>

          {/* "Watch how" micro-label — fades out as typing begins so it
              doesn't compete with the chat itself. */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "32px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink3)",
              opacity: chatProgress < 0.1 ? 1 : 0,
              transform: chatProgress < 0.1 ? "translateY(0)" : "translateY(-4px)",
              transition: "opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <span style={{ animation: "watch-bob 1.6s ease-in-out infinite" }}>↓</span>
            Watch how
          </div>

          <SenseChat scrollProgress={chatProgress} />
        </div>

      </div>

      {/* Four-tab bar — Monitor → Analyze → Predict → Recommend.
          Sticky below the nav. The active tab tracks scroll-driven
          `activeTab` state which splits the section's 240% pin into
          four equal quartiles; the content below uses the simpler 3-
          phase `view` state to drive the chat / chart / act swap.
          Slides down + fades in coordinated with the Mac window
          entering the viewport. */}
      <div
        style={{
          position: "sticky",
          top: "104px",
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "32px",
          opacity: stepperShown ? 1 : 0,
          transform: stepperShown ? "translateY(0)" : "translateY(-28px)",
          transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: stepperShown ? "auto" : "none",
          marginBottom: "-32px",
        }}
      >
        <div
          className="analyze-tab-bar"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            width: "min(960px, 92vw)",
            background: "rgba(10, 10, 12, 0.7)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: [
              "0 18px 48px -16px rgba(0,0,0,0.6)",
              "inset 0 1px 0 rgba(255,255,255,0.06)",
            ].join(", "),
          }}
        >
          {([
            { key: "monitor",  label: "Monitor"   },
            { key: "analyze",  label: "Analyze"   },
            { key: "predict",  label: "Predict"   },
            { key: "recommend", label: "Recommend" },
          ] as const).map((tab, i, arr) => {
            const isActive = activeTab === tab.key;
            const onClick = () => jumpToTab(tab.key);
            return (
              <button
                key={tab.key}
                type="button"
                onClick={onClick}
                aria-label={`Jump to ${tab.label}`}
                style={{
                  position: "relative",
                  padding: "16px 12px",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: "0.04em",
                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                  background: isActive ? "rgba(232,93,58,0.08)" : "transparent",
                  borderRight:
                    i < arr.length - 1
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                  borderTop: "none",
                  borderLeft: "none",
                  borderBottom: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition:
                    "color 360ms cubic-bezier(0.22,1,0.36,1), font-weight 360ms cubic-bezier(0.22,1,0.36,1), background 360ms cubic-bezier(0.22,1,0.36,1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }}
              >
                {tab.label}
                {/* Track */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "2px",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                {/* Progress fill — driven by scroll progress within the
                    current tab's range. 0% at tab start, 100% by next tab. */}
                {isActive && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      height: "2px",
                      background: "linear-gradient(90deg, #E85D3A 0%, #F87E5C 100%)",
                      boxShadow: "0 0 12px rgba(232,93,58,0.7), 0 0 4px rgba(232,93,58,0.9)",
                      width: `${tabProgress * 100}%`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Monitor view — radar dashboard with 4 cards inside the Mac
          window. Shown when view === "ask" (Monitor / Analyze tabs).
          Overdue-invoices card surfaces once the user's auto-cursor
          presses Add-to-Radar in the intro SenseChat. */}
      <div ref={askRef} style={{ minHeight: "112vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0", position: "relative" }}>
        <BrowserOutlineBackdrop revealed={backdropRevealed} parallax={effectiveParallax} />
        {/* Per-tab copy — sits below the sticky stepper, above the Mac
            window. Swaps based on activeTab with a soft crossfade. */}
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: 0,
            right: 0,
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 24px",
            pointerEvents: "none",
            opacity: contentRevealed ? 1 : 0,
            transform: contentRevealed ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 520ms cubic-bezier(0.22,1,0.36,1), transform 520ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            key={activeTab}
            style={{
              width: "min(720px, 92vw)",
              textAlign: "center",
              animation: "tab-copy-in 480ms cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {(() => {
              const COPY: Record<typeof activeTab, { h2: string; sub: string }> = {
                monitor: {
                  h2: "Make decisions you don’t second-guess.",
                  sub: "Radar is your personal, live view of the business. Every pinned card refreshes itself in real time, so nothing important goes stale or slips by.",
                },
                analyze: {
                  h2: "See what’s behind every insight.",
                  sub: "Tap any Radar card to see the breakdown. Each follow-up question takes you one layer deeper.",
                },
                predict: {
                  h2: "Stop fighting fires you could’ve prevented.",
                  sub: "The early signals show up long before any of it shows up as a problem, so you can move before it costs you.",
                },
                recommend: {
                  h2: "Know exactly what to do, every time.",
                  sub: "Each prediction arrives with the action drawn up and the projected outcome attached.",
                },
              };
              const c = COPY[activeTab];
              return (
                <>
                  <h2
                    style={{
                      fontSize: "clamp(22px, 2.4vw, 30px)",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      color: "var(--ink)",
                      margin: 0,
                      marginBottom: "8px",
                    }}
                  >
                    {c.h2}
                  </h2>
                  <p
                    style={{
                      fontSize: "clamp(12.5px, 1.05vw, 14.5px)",
                      lineHeight: 1.5,
                      color: "var(--ink2)",
                      maxWidth: "560px",
                      margin: "0 auto",
                      fontWeight: 450,
                    }}
                  >
                    {c.sub}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: "330px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            opacity: isActive("ask") && contentRevealed ? 1 : 0,
            transform: `translateY(${offsetFor("ask")}%)`,
            pointerEvents: view === "ask" ? "auto" : "none",
            transition: viewTransition,
          }}
        >
          <div style={{ width: "min(1000px, 78vw)", height: "min(700px, 54.6vw)", maxHeight: "68vh", position: "relative" }}>
            <div style={{ position: "absolute", top: "9.82%", left: "1.25%", right: "1.25%", bottom: "3.57%", overflow: "auto", padding: "36px 40px 24px", display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 12px", borderRadius: "999px", background: "rgba(232,93,58,0.10)", border: "1px solid rgba(232,93,58,0.30)", fontSize: "11px", color: "#E85D3A", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
                  Task Radar
                </div>
                <span style={{ fontSize: "11px", color: "var(--ink3)" }}>Live · updated just now</span>
              </div>

              <div
                className="analyze-dashboard-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateAreas: `"overdue dormant" "overdue stuck" "missed missed"`,
                  gap: "12px",
                  alignItems: "stretch",
                }}
              >
                {/* Overdue invoices — matches the result card from the
                    intro prompt (header + big $, aging bars, Added-to-
                    Radar pill). Glows with the "NEW" ring once it
                    lands on the radar via the auto-cursor sequence. */}
                <div
                  style={{
                    position: "relative",
                    gridArea: "overdue",
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    opacity: 1,
                    transform: "translateY(0) scale(1)",
                    transition: "opacity 520ms cubic-bezier(0.22,1,0.36,1), transform 520ms cubic-bezier(0.22,1,0.36,1)",
                    boxShadow: "0 0 0 2px rgba(232,93,58,0.25), 0 10px 24px -10px rgba(232,93,58,0.35)",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#FFD7C5",
                      background: "rgba(232,93,58,0.18)",
                      border: "1px solid rgba(232,93,58,0.5)",
                      padding: "2px 7px",
                      borderRadius: "999px",
                    }}
                  >
                    New
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: "rgba(232,93,58,0.14)" }}>
                      <Receipt className="w-3.5 h-3.5" style={{ color: "#E85D3A" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.005em" }}>Overdue invoices</span>
                      <span style={{ fontSize: "10px", color: "var(--ink3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Last 30 days</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <span style={{ fontSize: "26px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>$87,450</span>
                    <span style={{ fontSize: "11px", color: "var(--ink2)" }}>across 9 invoices · oldest 47 days</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {[
                      { label: "0 – 30 days",  pct: 36, value: "$32K", color: "rgba(34,197,94,0.85)" },
                      { label: "30 – 60 days", pct: 32, value: "$28K", color: "rgba(245,158,11,0.85)" },
                      { label: "60+ days",     pct: 32, value: "$27K", color: "rgba(239,68,68,0.85)" },
                    ].map((b) => (
                      <div key={b.label} style={{ display: "grid", gridTemplateColumns: "82px 1fr 40px", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--ink2)" }}>
                        <span>{b.label}</span>
                        <span style={{ position: "relative", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          <span style={{ position: "absolute", inset: "0 auto 0 0", width: `${b.pct}%`, background: b.color, borderRadius: "3px" }} />
                        </span>
                        <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--ink)" }}>{b.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        border: "1px solid rgba(34,197,94,0.45)",
                        background: "rgba(34,197,94,0.12)",
                        color: "#22C55E",
                      }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Added to Radar
                    </span>
                  </div>
                </div>

                {/* Dormant estimates — donut chart of aging buckets */}
                <div className="card-depth" style={{ gridArea: "dormant", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock className="w-4 h-4" style={{ color: "#FCA5A5" }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#FCA5A5" }}>Dormant estimates</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {/* Donut */}
                    <svg width="72" height="72" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
                      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                      {([
                        { color: "#FCA5A5", value: 50 },
                        { color: "rgba(252,165,165,0.6)", value: 33 },
                        { color: "rgba(252,165,165,0.35)", value: 17 },
                      ]).reduce<React.ReactElement[]>((acc, seg, i, arr) => {
                        const prevTotal = arr.slice(0, i).reduce((s, x) => s + x.value, 0);
                        const circumference = 2 * Math.PI * 14;
                        const dash = (seg.value / 100) * circumference;
                        const offset = (prevTotal / 100) * circumference;
                        acc.push(
                          <circle
                            key={i}
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={seg.color}
                            strokeWidth="5"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                            transform="rotate(-90 18 18)"
                            strokeLinecap="butt"
                          />
                        );
                        return acc;
                      }, [])}
                      <text x="18" y="19" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="600" fill="var(--ink)" style={{ fontVariantNumeric: "tabular-nums" }}>
                        12
                      </text>
                    </svg>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>$318K</div>
                      <div style={{ fontSize: "10.5px", color: "var(--ink3)" }}>aging out</div>
                      {[
                        { label: "10–20d", pct: 50, color: "#FCA5A5" },
                        { label: "20–30d", pct: 33, color: "rgba(252,165,165,0.6)" },
                        { label: "30+d",   pct: 17, color: "rgba(252,165,165,0.35)" },
                      ].map((b) => (
                        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--ink2)" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: b.color }} />
                          <span style={{ flex: 1 }}>{b.label}</span>
                          <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink2)" }}>{b.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stuck supplements — horizontal bars by carrier */}
                <div className="card-depth" style={{ gridArea: "stuck", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileText className="w-4 h-4" style={{ color: "#FCD34D" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#FCD34D" }}>Stuck supplements</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>$164K</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    {[
                      { carrier: "State Farm", pct: 100, value: "$72K", days: 47 },
                      { carrier: "Allstate",   pct: 58,  value: "$42K", days: 38 },
                      { carrier: "USAA",       pct: 42,  value: "$30K", days: 33 },
                      { carrier: "Farmers",    pct: 28,  value: "$20K", days: 31 },
                    ].map((b) => (
                      <div key={b.carrier} style={{ display: "grid", gridTemplateColumns: "70px 1fr 38px", alignItems: "center", gap: "8px", fontSize: "10.5px", color: "var(--ink2)" }}>
                        <span style={{ color: "var(--ink)" }}>{b.carrier}</span>
                        <span style={{ position: "relative", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          <span style={{ position: "absolute", inset: "0 auto 0 0", width: `${b.pct}%`, background: `linear-gradient(90deg, rgba(252,211,77,0.85), rgba(245,158,11,0.65))`, borderRadius: "3px" }} />
                        </span>
                        <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--ink)" }}>{b.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missed calls — sparkline of last 7 days, full-width
                    row anchoring the bottom of the dashboard. */}
                <div className="card-depth" style={{ gridArea: "missed", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "14px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Phone className="w-4 h-4" style={{ color: "#C4B5FD" }} />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#C4B5FD" }}>Missed calls</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                      <span style={{ fontSize: "20px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>11</span>
                      <span style={{ fontSize: "10px", color: "#EF4444" }}>3 urgent</span>
                    </div>
                  </div>
                  {/* Sparkline */}
                  <div style={{ position: "relative", height: "56px", marginTop: "2px" }}>
                    <svg viewBox="0 0 200 56" preserveAspectRatio="none" width="100%" height="100%" style={{ display: "block" }}>
                      <defs>
                        <linearGradient id="spark-violet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(196,181,253,0.4)" />
                          <stop offset="100%" stopColor="rgba(196,181,253,0)" />
                        </linearGradient>
                      </defs>
                      {(() => {
                        const data = [4, 7, 5, 9, 6, 8, 11];
                        const max = Math.max(...data);
                        const step = 200 / (data.length - 1);
                        const pts = data.map((v, i) => [i * step, 56 - (v / max) * 44 - 4] as const);
                        const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
                        const areaPath = `${linePath} L 200 56 L 0 56 Z`;
                        const [lx, ly] = pts[pts.length - 1];
                        return (
                          <>
                            <path d={areaPath} fill="url(#spark-violet)" />
                            <path d={linePath} fill="none" stroke="#C4B5FD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx={lx} cy={ly} r="3" fill="#C4B5FD" />
                            <circle cx={lx} cy={ly} r="6" fill="rgba(196,181,253,0.25)" />
                          </>
                        );
                      })()}
                    </svg>
                    <div style={{ position: "absolute", inset: "auto 0 -2px 0", display: "flex", justifyContent: "space-between", fontSize: "9px", color: "var(--ink3)", padding: "0 1px" }}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: "10.5px", color: "var(--ink3)" }}>CSR Agent cleared 9 of them this morning.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Analyze — chat + chart, overlays the Mac window when view === "analyze" */}
      <div
        id="analyze-content"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: "330px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          opacity: isActive("analyze") && contentRevealed ? 1 : 0,
          transform: `translateY(${offsetFor("analyze")}%)`,
          pointerEvents: view === "analyze" ? "auto" : "none",
          transition: viewTransition,
        }}
      >
        <div style={{ width: "min(1000px, 78vw)", height: "min(700px, 54.6vw)", maxHeight: "68vh", position: "relative" }}>
        <div style={{ position: "absolute", top: "9.82%", left: "1.25%", right: "1.25%", bottom: "3.57%", overflow: activeTab === "predict" ? "hidden" : "auto", padding: "36px 40px 24px", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start", gap: "14px" }}>
        {/* Standalone Prediction cards — only show when Predict tab is
            active. Rendered at the TOP of the Mac window so no scroll
            is needed to reach them. */}
        {activeTab === "predict" && topic === "revenue" && (
          <div style={{ position: "relative", background: "linear-gradient(180deg, rgba(239,68,68,0.10) 0%, rgba(239,68,68,0.04) 60%, rgba(239,68,68,0.02) 100%)", border: "1px solid rgba(239,68,68,0.28)", borderRadius: "14px", padding: "18px 22px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 10px 30px -16px rgba(239,68,68,0.35)", maxWidth: "880px", width: "100%", marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.35)" }}>
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#FCA5A5" }} />
                </span>
                <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "#FCA5A5" }}>Prediction · 30-day projection</span>
              </div>
              <span style={{ fontSize: "10px", color: "#FCA5A5", padding: "3px 8px", borderRadius: "999px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>89% confidence</span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Overdue stack rebounds to <strong style={{ color: "#FCA5A5" }}>$1.85M</strong> by end of June.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: "6px 12px", fontSize: "11.5px", color: "var(--ink2)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--ink3)", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "10px", paddingTop: "1px" }}>Pattern</span>
              <span>May&apos;s ease was a payment burst, not a trend break. 60% of paydowns came from <strong>2 carriers</strong> — the broader backlog kept aging.</span>
              <span style={{ color: "var(--ink3)", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "10px", paddingTop: "1px" }}>Risk</span>
              <span><strong style={{ color: "#FCA5A5" }}>$420K</strong> rolls into the 60+ day bucket within 3 weeks if nothing changes — DSO climbs 38 → 51 days and write-off probability hits 14%.</span>
              <span style={{ color: "var(--ink3)", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "10px", paddingTop: "1px" }}>Window</span>
              <span>Next 14 days — invoices over $25K that haven&apos;t moved in 3 weeks are the highest-yield targets.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "10px", color: "var(--ink3)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>Recommended</span>
              <span style={{ fontSize: "12px", color: "var(--ink)", flex: 1 }}>
                <strong>Casey</strong> (Collections Agent) works the top 8 overdue accounts before Friday.
              </span>
              <span style={{ fontSize: "10px", color: "#22C55E", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.30)" }}>+$420K saved</span>
            </div>
          </div>
        )}

        {/* Chat conversation — hidden in Predict tab so only the
            prediction card shows */}
        {topic && activeTab !== "predict" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>

            {/* User question bubble */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                opacity: showQuestion ? 1 : 0,
                transform: showQuestion ? "translateX(0)" : "translateX(16px)",
                transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                style={{
                  background: "rgba(232,93,58,0.08)",
                  border: "1px solid rgba(232,93,58,0.2)",
                  borderRadius: "16px 16px 4px 16px",
                  padding: "12px 18px",
                  fontSize: "15px",
                  color: "var(--ink)",
                  maxWidth: "400px",
                }}
              >
                {config?.question}
              </div>
            </div>

            {/* AI response */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                opacity: showAiResponse ? 1 : 0,
                transform: showAiResponse ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(232,93,58,0.10)",
                  border: "1px solid rgba(232,93,58,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 0 14px rgba(232,93,58,0.2)",
                }}
              >
                <SenseLogo size={20} />
              </div>

              <div style={{ flex: 1 }}>
                {/* Label */}
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#E85D3A", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  Sense
                  {!aiDone && (
                    <span style={{ display: "inline-flex", gap: "3px" }}>
                      <span className="typing-dot" style={{ animationDelay: "0s" }} />
                      <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                      <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                    </span>
                  )}
                </div>

                {/* Text bubble */}
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "4px 16px 16px 16px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "var(--ink2)",
                    lineHeight: 1.7,
                    minHeight: "60px",
                  }}
                >
                  {aiText}
                  {!aiDone && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "16px",
                        background: "#E85D3A",
                        marginLeft: "2px",
                        verticalAlign: "text-bottom",
                        animation: "blink 1s step-end infinite",
                      }}
                    />
                  )}
                </div>

                {/* Chart / Data — slides in after typing */}
                <div
                  style={{
                    marginTop: "10px",
                    opacity: showChart ? 1 : 0,
                    transform: showChart ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                    ...(showChart ? {} : { pointerEvents: "none" as const }),
                  }}
                >
                  {/* REVENUE — Calls I missed yesterday */}
                  {topic === "revenue" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* KPI row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--glass-bg)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
                        {missedCallKpis.map((k) => (
                          <div key={k.label} style={{ background: "var(--surface)", padding: "12px 16px" }}>
                            <div style={{ fontSize: "10px", color: "var(--ink2)", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                            <div style={{ fontSize: "22px", fontWeight: 600, color: k.accent || "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Sorted table — overdue invoices month-over-month */}
                      <div style={{ ...cardStyle, padding: 0, overflow: "hidden", boxShadow: "none", position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "90px 150px 1fr 90px", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 500, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          <span>Month</span><span>Signal</span><span>Detail</span><span style={{ textAlign: "right" }}>Overdue</span>
                        </div>
                        {missedCallRows.map((r, i) => (
                          <div
                            key={i}
                            style={{
                              display: "grid", gridTemplateColumns: "90px 150px 1fr 90px", padding: "10px 16px", gap: "8px",
                              borderBottom: i < missedCallRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                              fontSize: "13px", color: "#d4d4d8", alignItems: "center",
                              opacity: 0, animation: showChart ? `fadeUp 0.22s ${0.06 * i}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
                            }}
                          >
                            <span style={{ color: "var(--ink2)", fontVariantNumeric: "tabular-nums" }}>{r.time}</span>
                            <span style={{ color: "var(--ink)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "8px" }}>
                              {r.urgent && (
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.7)", flexShrink: 0 }} />
                              )}
                              {r.caller}
                            </span>
                            <span style={{ color: "var(--ink2)", fontSize: "12px" }}>{r.reason}</span>
                            <span style={{ textAlign: "right", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  {/* PERFORMANCE — Aging supplements by carrier */}
                  {topic === "performance" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* Chart + table side-by-side */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "stretch" }}>
                        {/* Horizontal bar — $ pending by carrier */}
                        <div style={{ ...cardStyle, boxShadow: "none", position: "relative", overflow: "hidden" }}>
                          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>$ pending by carrier</div>
                          <div style={{ fontSize: "12px", color: "var(--ink2)", marginBottom: "20px" }}>Outstanding supplement value across carriers</div>
                          <div style={{ height: "140px" }}><Bar data={carrierAgingChart} options={carrierChartOpts as any} /></div>
                        </div>

                        {/* Table — carrier rows */}
                        <div style={{ ...cardStyle, padding: 0, overflow: "hidden", boxShadow: "none", position: "relative" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 90px", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 500, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            <span>Carrier</span><span style={{ textAlign: "right" }}>Pending</span><span style={{ textAlign: "right" }}>Days aging</span>
                          </div>
                          {carrierAgingRows.map((r, i) => (
                            <div
                              key={r.carrier}
                              style={{
                                display: "grid", gridTemplateColumns: "1fr 110px 90px", padding: "10px 16px",
                                borderBottom: i < carrierAgingRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                                fontSize: "13px", color: "#d4d4d8", alignItems: "center",
                                opacity: 0, animation: showChart ? `fadeUp 0.22s ${0.06 * i}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
                              }}
                            >
                              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{r.carrier}</span>
                              <span style={{ textAlign: "right", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>${r.pending.toLocaleString()}</span>
                              <span style={{ textAlign: "right", color: "var(--ink2)", fontVariantNumeric: "tabular-nums" }}>{r.days} days</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SLA */}
                  {topic === "sla" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* KPI row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--glass-bg)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--card-border)" }}>
                        {estimateKpis.map((k) => (
                          <div key={k.label} style={{ background: "var(--surface)", padding: "12px 16px" }}>
                            <div style={{ fontSize: "10px", color: "var(--ink2)", letterSpacing: "0.08em", marginBottom: "6px" }}>{k.label}</div>
                            <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Sorted table */}
                      <div style={{ ...cardStyle, padding: 0, overflow: "hidden", boxShadow: "none", position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 100px", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "11px", fontWeight: 500, color: "var(--ink2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          <span>Estimate</span><span style={{ textAlign: "right" }}>Value</span><span style={{ textAlign: "right" }}>Days aging</span>
                        </div>
                        {estimateRows.map((r, i) => (
                          <div
                            key={r.name}
                            style={{
                              display: "grid", gridTemplateColumns: "1fr 110px 100px", padding: "10px 16px",
                              borderBottom: "1px solid rgba(255,255,255,0.05)",
                              fontSize: "13px", color: "#d4d4d8", alignItems: "center",
                              opacity: 0, animation: showChart ? `fadeUp 0.22s ${0.06 * i}s cubic-bezier(0.22,1,0.36,1) forwards` : "none",
                            }}
                          >
                            <span style={{ color: "var(--ink)", fontWeight: 500 }}>{r.name}</span>
                            <span style={{ textAlign: "right", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>${r.value.toLocaleString()}</span>
                            <span style={{ textAlign: "right", color: "var(--ink2)", fontVariantNumeric: "tabular-nums" }}>{r.days} days</span>
                          </div>
                        ))}
                        <div style={{ padding: "8px 16px", fontSize: "12px", color: "var(--ink2)", fontWeight: 500 }}>
                          + {estimateMore} more
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!topic && (
          <div style={{ color: "var(--ink3)", fontSize: "16px", padding: "60px 0", textAlign: "center" }}>
            Select a question above to see the analysis
          </div>
        )}

        </div>
        </div>
      </div>

      {/* Act overlay — shows when view === "act" */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: "330px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          opacity: isActive("act") && contentRevealed ? 1 : 0,
          transform: `translateY(${offsetFor("act")}%)`,
          pointerEvents: view === "act" ? "auto" : "none",
          transition: viewTransition,
        }}
      >
        <div style={{ width: "min(1000px, 78vw)", height: "min(700px, 54.6vw)", maxHeight: "68vh", position: "relative" }}>
        {/* overflow: visible so the live activity card can transform
            out of the mac frame on its way to the radar section without
            being clipped at the frame edge. */}
        <div style={{ position: "absolute", top: "9.82%", left: "1.25%", right: "1.25%", bottom: "3.57%", overflow: "visible", padding: "36px 40px 24px", display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start", gap: "10px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "12px" }}>
            {/* Agent + steps */}
            <div className="card-depth" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <div
                  style={{
                    position: "relative",
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "linear-gradient(135deg, #2A1810, #1a0e08)",
                    border: "1px solid rgba(232,93,58,0.35)",
                    boxShadow: "0 4px 14px -4px rgba(232,93,58,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <Image
                    src="/assets/agent-casey.png"
                    alt={`${ACT_VARIANTS[deployedTopic].agent.name} portrait`}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>{ACT_VARIANTS[deployedTopic].agent.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--ink3)" }}>{ACT_VARIANTS[deployedTopic].agent.role}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div className="live-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E" }} />
                  <span style={{ fontSize: "10px", color: "#4ADE80" }}>{ACT_VARIANTS[deployedTopic].agent.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "14px" }}>
                {ACT_VARIANTS[deployedTopic].capabilities.map((tag) => (
                  <span key={tag} style={{ background: "var(--glass-bg)", border: "1px solid var(--card-border)", borderRadius: "5px", padding: "2px 8px", fontSize: "10px", color: "var(--ink2)" }}>{tag}</span>
                ))}
              </div>
              {ACT_VARIANTS[deployedTopic].steps.map((label, i) => {
                const done = actCompleted.includes(i);
                const active = actActive === i && !done;
                return (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", opacity: actActive >= i ? 1 : 0.3, transition: "opacity 0.4s", marginBottom: "8px" }}>
                    <div style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "1px" }}>
                      {done ? (
                        <CheckCircle2 className="w-4 h-4" style={{ color: "var(--green)" }} />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#E85D3A" }} />
                      ) : (
                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: "1.5px solid #3F3F46" }} />
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: done ? "#A1A1AA" : active ? "#FAFAFA" : "#52525B" }}>{label}</div>
                  </div>
                );
              })}
            </div>

            {/* Activity feed — shared element. Marked with id so the
                RadarSection's scroll-driven transform can move THIS card
                (the only one) into a placeholder slot in the next
                section as the user scrolls. */}
            <div id="live-activity-source" className="card-depth" style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "18px", willChange: "transform", transformOrigin: "center center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                <span style={{ fontSize: "10px", color: "var(--ink3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{ACT_VARIANTS[deployedTopic].agent.name} · Live activity</span>
              </div>
              {ACT_VARIANTS[deployedTopic].log.map((entry, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < ACT_VARIANTS[deployedTopic].log.length - 1 ? "8px" : 0, paddingBottom: i < ACT_VARIANTS[deployedTopic].log.length - 1 ? "8px" : 0, borderBottom: i < ACT_VARIANTS[deployedTopic].log.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ marginTop: "2px", flexShrink: 0, color: entry.icon === "call" ? "#60a5fa" : entry.icon === "text" ? "#34d399" : "#a78bfa" }}>
                    {entry.icon === "call" ? <Phone className="w-3 h-3" /> : entry.icon === "text" ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                  </div>
                  <div style={{ flex: 1, fontSize: "12px", color: "var(--ink)" }}>{entry.text}</div>
                  <div style={{ fontSize: "10px", color: "var(--ink3)", whiteSpace: "nowrap", marginTop: "2px" }}>{entry.time}</div>
                </div>
              ))}

              {/* Add to Radar CTA — appears once Casey's final step
                  ("Logging responses back to the job") lands. A cursor
                  flies in and auto-clicks; the button then flips to a
                  green confirmation that fades after a short hold. */}
              {(() => {
                const totalSteps = ACT_VARIANTS[deployedTopic].steps.length;
                const allDone = actCompleted.length === totalSteps;
                if (!allDone || radarHidden) return null;
                const cursorVisible = cursorPhase === "moving" || cursorPhase === "pressed";
                return (
                  <div
                    style={{
                      position: "relative",
                      marginTop: "14px",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      justifyContent: "flex-end",
                      transition: "opacity 600ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    {!radarAdded ? (
                      <button
                        type="button"
                        onClick={() => {
                          setRadarAdded(true);
                          setCursorPhase("done");
                          setTimeout(() => setRadarHidden(true), 1800);
                        }}
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 18px 9px 14px",
                          borderRadius: "999px",
                          background:
                            "linear-gradient(180deg, rgba(232,93,58,0.22) 0%, rgba(232,93,58,0.12) 100%)",
                          border: "1px solid rgba(232,93,58,0.45)",
                          color: "#FFD7C5",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.01em",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: [
                            "0 6px 18px -8px rgba(232,93,58,0.55)",
                            "inset 0 1px 0 rgba(255,255,255,0.18)",
                            "inset 0 -1px 0 rgba(0,0,0,0.25)",
                          ].join(", "),
                          transform:
                            cursorPhase === "pressed" ? "scale(0.96)" : "scale(1)",
                          transition:
                            "transform 180ms cubic-bezier(0.22,1,0.36,1), background 220ms, border-color 220ms, box-shadow 220ms, color 220ms",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(180deg, #FF8B65 0%, #E85D3A 100%)",
                            boxShadow:
                              "0 0 0 1px rgba(232,93,58,0.6), 0 0 12px rgba(232,93,58,0.55)",
                          }}
                        >
                          <Zap
                            className="w-3 h-3"
                            style={{ color: "#fff", fill: "#fff" }}
                          />
                        </span>
                        Add to Radar
                      </button>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "9px 4px",
                          color: "#22C55E",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.01em",
                          opacity: radarHidden ? 0 : 1,
                          transform: radarHidden ? "translateY(-2px)" : "translateY(0)",
                          transition:
                            "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Added to radar
                      </span>
                    )}

                    {/* Auto-click cursor — anchored at the button's
                        right edge (right: 28px, top: 18px). Hidden state
                        offsets it down-right via transform so the entry
                        animates transform + opacity ONLY (no layout
                        thrash). Press state shrinks the cursor a touch. */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        right: "28px",
                        top: "18px",
                        pointerEvents: "none",
                        opacity: cursorVisible ? 1 : 0,
                        transform:
                          cursorPhase === "hidden"
                            ? "translate(60px, 56px) scale(0.9)"
                            : cursorPhase === "pressed"
                              ? "translate(0, 0) scale(0.88)"
                              : "translate(0, 0) scale(1)",
                        transition:
                          "transform 540ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                        filter:
                          "drop-shadow(0 4px 10px rgba(0,0,0,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                        willChange: "transform, opacity",
                      }}
                    >
                      <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
                        <path
                          d="M3 2.2 L3 19.3 L7.6 15.2 L10.2 21.2 L12.6 20.1 L10 14 L16.4 14 Z"
                          fill="#fff"
                          stroke="#0a0a0a"
                          strokeWidth="1.4"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {/* Click ripple at press moment */}
                      {cursorPhase === "pressed" && (
                        <span
                          style={{
                            position: "absolute",
                            left: "-6px",
                            top: "-2px",
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            border: "1.5px solid rgba(255,255,255,0.85)",
                            animation: "radar-click-ring 340ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Recap */}
          <div style={{ marginTop: "8px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {ACT_VARIANTS[deployedTopic].recap.map((r) => (
                <div key={r.label} style={{ background: "rgba(34,197,94,0.06)", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--green)", letterSpacing: "-0.02em" }}>{r.value}</div>
                  <div style={{ fontSize: "10px", color: "#86EFAC", marginTop: "2px" }}>{r.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: "11px", color: "var(--ink3)", marginTop: "10px", textAlign: "center" }}>
              {ACT_VARIANTS[deployedTopic].caption}
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .typing-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #E85D3A;
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        @keyframes tab-copy-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes watch-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(3px); }
        }
      ` }} />
    </section>
  );
}
