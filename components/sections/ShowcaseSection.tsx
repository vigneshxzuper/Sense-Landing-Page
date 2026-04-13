"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Clock, Users, User, CalendarDays, Plus, Grid3X3, ChevronLeft, ChevronRight, CreditCard, Phone, Mail, Wrench, BarChart3, LucideIcon } from "lucide-react";

type CardField = { icon: LucideIcon; label: string; value: string; badge?: string };

const CATEGORY_TAGS: Record<string, { emoji: string; label: string }> = {
  job: { emoji: "📋", label: "Jobs" },
  payment: { emoji: "💳", label: "Pending Payments" },
  contact: { emoji: "👥", label: "Contacts" },
};

const CARDS = [
  {
    type: "job",
    status: "red",
    statusLabel: "Overdue",
    title: "Roof Replacement for Jake",
    address: "2847 Sunset Boulevard, Los Angeles, CA 90026",
    fields: [
      { icon: Clock, label: "Status", value: "On Going", badge: "blue" },
      { icon: Users, label: "Assignees", value: "John Davis +2" },
      { icon: User, label: "Customer", value: "Craig Calzoni" },
      { icon: CalendarDays, label: "Schedule", value: "20–24 Dec 2024" },
      { icon: Plus, label: "Created by", value: "Tom Riddle" },
      { icon: Grid3X3, label: "Category", value: "Installation" },
    ],
  },
  {
    type: "job",
    status: "orange",
    statusLabel: "In Progress",
    title: "HVAC System Install",
    address: "421 Oak Avenue, Portland, OR 97201",
    fields: [
      { icon: Clock, label: "Status", value: "In Progress", badge: "orange" },
      { icon: Users, label: "Assignees", value: "Mike Kim +1" },
      { icon: User, label: "Customer", value: "Sarah Mitchell" },
      { icon: CalendarDays, label: "Schedule", value: "15–17 Jan 2025" },
      { icon: Plus, label: "Created by", value: "Alex Reyes" },
      { icon: Grid3X3, label: "Category", value: "HVAC" },
    ],
  },
  {
    type: "payment",
    title: "Invoice #INV-2847",
    subtitle: "Premier Properties LLC",
    amount: "$14,400",
    statusLabel: "Overdue",
    statusColor: "#ef4444",
    fields: [
      { icon: CalendarDays, label: "Due Date", value: "Dec 15, 2024" },
      { icon: Clock, label: "Days Overdue", value: "28 days" },
      { icon: User, label: "Contact", value: "Marcus Ortiz" },
      { icon: CreditCard, label: "Method", value: "Bank Transfer" },
    ],
  },
  {
    type: "job",
    status: "green",
    statusLabel: "Completed",
    title: "Solar Panel Installation",
    address: "89 Maple Drive, Austin, TX 78701",
    fields: [
      { icon: Clock, label: "Status", value: "Completed", badge: "green" },
      { icon: Users, label: "Assignees", value: "Pat Torres, RK" },
      { icon: User, label: "Customer", value: "Donna Hartley" },
      { icon: CalendarDays, label: "Schedule", value: "8–10 Mar 2025" },
      { icon: Plus, label: "Created by", value: "Tom Riddle" },
      { icon: Grid3X3, label: "Category", value: "Solar" },
    ],
  },
  {
    type: "contact",
    name: "Sarah Mitchell",
    initials: "SM",
    color: "#d4884a",
    customerSince: "Customer since Mar 2022",
    label: "Premium",
    stats: [
      { val: "12", lbl: "Jobs" },
      { val: "$48K", lbl: "Revenue" },
      { val: "98%", lbl: "SLA" },
    ],
    fields: [
      { icon: Mail, label: "Email", value: "sarah@mitchell.com" },
      { icon: Phone, label: "Phone", value: "(503) 555-0142" },
      { icon: MapPin, label: "Location", value: "Portland, OR" },
      { icon: User, label: "Account Mgr", value: "Alex Reyes" },
    ],
  },
  {
    type: "payment",
    title: "Invoice #INV-2901",
    subtitle: "Sunrise HVAC Services",
    amount: "$9,800",
    statusLabel: "Pending",
    statusColor: "#E85D3A",
    fields: [
      { icon: CalendarDays, label: "Due Date", value: "Jan 28, 2025" },
      { icon: Clock, label: "Days Overdue", value: "14 days" },
      { icon: User, label: "Contact", value: "Lisa Wang" },
      { icon: CreditCard, label: "Method", value: "Credit Card" },
    ],
  },
  {
    type: "contact",
    name: "Craig Calzoni",
    initials: "CC",
    color: "#3a9a8a",
    customerSince: "Customer since Jan 2021",
    label: "Business",
    stats: [
      { val: "24", lbl: "Jobs" },
      { val: "$92K", lbl: "Revenue" },
      { val: "94%", lbl: "SLA" },
    ],
    fields: [
      { icon: Mail, label: "Email", value: "craig@calzoni.io" },
      { icon: Phone, label: "Phone", value: "(213) 555-0198" },
      { icon: MapPin, label: "Location", value: "Los Angeles, CA" },
      { icon: User, label: "Account Mgr", value: "Tom Riddle" },
    ],
  },
  {
    type: "job",
    status: "orange",
    statusLabel: "In Progress",
    title: "Electrical Panel Upgrade",
    address: "1240 Pine Street, Denver, CO 80202",
    fields: [
      { icon: Clock, label: "Status", value: "In Progress", badge: "orange" },
      { icon: Users, label: "Assignees", value: "Jake Torres" },
      { icon: User, label: "Customer", value: "Metro School District" },
      { icon: CalendarDays, label: "Schedule", value: "22–24 Jan 2025" },
      { icon: Plus, label: "Created by", value: "Lisa Wang" },
      { icon: Grid3X3, label: "Category", value: "Electrical" },
    ],
  },
];

const BADGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  blue: { bg: "rgba(56,180,239,0.1)", text: "#38b4ef", dot: "#38b4ef" },
  orange: { bg: "rgba(232,93,58,0.08)", text: "#E85D3A", dot: "#E85D3A" },
  green: { bg: "rgba(45,155,111,0.1)", text: "#2d9b6f", dot: "#2d9b6f" },
};
const STATUS_DOT: Record<string, string> = { red: "#ef4444", orange: "#E85D3A", green: "#2d9b6f" };

export default function ShowcaseSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  // Auto-scroll carousel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 360, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const cardBase: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--card-border)",
    borderRadius: "18px",
    overflow: "hidden",
    width: "340px",
    minWidth: "340px",
    flexShrink: 0,
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "default",
  };

  const fieldRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "11px 0",
    borderBottom: "1px solid var(--card-border)",
    fontSize: "13px",
  };

  return (
    <section id="showcase-section" ref={sectionRef} style={{ background: "var(--bg)", padding: "120px 0", minHeight: "100vh", overflow: "hidden" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto 56px", padding: "0 24px" }}>
        <div style={{ height: "1px", background: "var(--line)", marginBottom: "60px" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(232,93,58,0.08)", border: "1px solid rgba(232,93,58,0.2)", borderRadius: "100px", padding: "5px 14px", fontSize: "11px", color: "#E85D3A", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "20px" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#E85D3A" }} />
          Anywhere in Zuper
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
          <div>
            <h2 style={{ fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--ink)", marginBottom: "12px" }}>
              Entire Zuper inside a{" "}
              <span style={{ color: "#E85D3A", fontStyle: "italic" }}>prompt box.</span>
            </h2>
            <p style={{ fontSize: "17px", color: "var(--ink3)", maxWidth: "520px", lineHeight: 1.6 }}>
              Ask anything, from anywhere in Zuper.
            </p>
          </div>
          {/* Arrows */}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button onClick={() => scroll(-1)} style={{ width: "40px", height: "40px", borderRadius: "10px", background: canScrollLeft ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <ChevronLeft className="w-5 h-5" style={{ color: canScrollLeft ? "#FAFAFA" : "#3F3F46" }} />
            </button>
            <button onClick={() => scroll(1)} style={{ width: "40px", height: "40px", borderRadius: "10px", background: canScrollRight ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <ChevronRight className="w-5 h-5" style={{ color: canScrollRight ? "#FAFAFA" : "#3F3F46" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          display: "flex",
          gap: "28px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingLeft: "max(24px, calc(50vw - 450px))",
          paddingRight: "80px",
          paddingBottom: "8px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {CARDS.map((card, ci) => {
          if (card.type === "job") {
            const tag = CATEGORY_TAGS[card.type];
            return (
              <div key={ci} style={{ ...cardBase, scrollSnapAlign: "start" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Category tag */}
                <div style={{ padding: "14px 20px 0" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "100px", padding: "5px 14px", fontSize: "12px", color: "var(--ink2)" }}>
                    <span style={{ fontSize: "13px" }}>{tag.emoji}</span>
                    {tag.label}
                  </span>
                </div>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 20px 8px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: STATUS_DOT[card.status!], flexShrink: 0, marginTop: "5px" }} />
                  <span style={{ fontSize: "17px", fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>{card.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "2px 20px 14px", fontSize: "12px", color: "var(--ink3)" }}>
                  <MapPin className="w-3 h-3" /> {card.address}
                </div>
                {/* Illustration placeholder */}
                <div style={{ margin: "0 16px", height: "140px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Wrench className="w-10 h-10" style={{ color: "#1F1F23" }} />
                </div>
                {/* Fields */}
                <div style={{ padding: "8px 20px 12px" }}>
                  {card.fields!.map((f, fi) => (
                    <div key={fi} style={{ ...fieldRow, borderBottom: fi < card.fields!.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <f.icon className="w-3.5 h-3.5" style={{ color: "var(--ink3)" }} />
                        <span style={{ color: "var(--ink3)" }}>{f.label}</span>
                      </div>
                      {(f as CardField).badge ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", background: BADGE_COLORS[(f as CardField).badge!].bg, borderRadius: "100px", padding: "3px 10px", fontSize: "12px", color: BADGE_COLORS[(f as CardField).badge!].text }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BADGE_COLORS[(f as CardField).badge!].dot }} />
                          {f.value}
                        </span>
                      ) : (
                        <span style={{ color: "var(--ink)", fontWeight: 500 }}>{f.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (card.type === "payment") {
            const tag = CATEGORY_TAGS[card.type];
            return (
              <div key={ci} style={{ ...cardBase, scrollSnapAlign: "start" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Category tag */}
                <div style={{ padding: "14px 20px 10px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "100px", padding: "5px 14px", fontSize: "12px", color: "var(--ink2)" }}>
                    <span style={{ fontSize: "13px" }}>{tag.emoji}</span>
                    {tag.label}
                  </span>
                </div>
                <div style={{ padding: "6px 20px 14px", borderBottom: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: "12px", color: "var(--ink3)", marginBottom: "4px" }}>{card.title}</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)" }}>{card.subtitle}</div>
                </div>
                <div style={{ padding: "24px 20px", textAlign: "center", borderBottom: "1px solid var(--card-border)" }}>
                  <div style={{ fontSize: "36px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-1.5px" }}>{card.amount}</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${card.statusColor}15`, borderRadius: "100px", padding: "4px 12px", fontSize: "12px", color: card.statusColor, marginTop: "8px" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: card.statusColor }} />
                    {card.statusLabel}
                  </span>
                </div>
                <div style={{ padding: "4px 20px 12px" }}>
                  {card.fields!.map((f, fi) => (
                    <div key={fi} style={{ ...fieldRow, borderBottom: fi < card.fields!.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <f.icon className="w-3.5 h-3.5" style={{ color: "var(--ink3)" }} />
                        <span style={{ color: "var(--ink3)" }}>{f.label}</span>
                      </div>
                      <span style={{ color: "var(--ink)", fontWeight: 500 }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // contact
          const ctag = CATEGORY_TAGS[card.type];
          return (
            <div key={ci} style={{ ...cardBase, scrollSnapAlign: "start" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Category tag */}
              <div style={{ padding: "14px 20px 0" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "100px", padding: "5px 14px", fontSize: "12px", color: "var(--ink2)" }}>
                  <span style={{ fontSize: "13px" }}>{ctag.emoji}</span>
                  {ctag.label}
                </span>
              </div>
              {/* Avatar row */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 20px 20px", borderBottom: "1px solid var(--card-border)" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: `linear-gradient(135deg, ${card.color}, ${card.color}90)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {card.initials}
                </div>
                <div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--ink)" }}>{card.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--ink3)", marginTop: "2px" }}>{card.customerSince}</div>
                  <span style={{ display: "inline-block", borderRadius: "100px", padding: "2px 8px", fontSize: "10px", fontWeight: 500, marginTop: "4px", background: "rgba(45,155,111,0.1)", color: "#2d9b6f" }}>{card.label}</span>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid var(--card-border)" }}>
                {card.stats!.map((s, si) => (
                  <div key={si} style={{ padding: "14px 12px", textAlign: "center", borderRight: si < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.5px" }}>{s.val}</div>
                    <div style={{ fontSize: "10px", color: "var(--ink3)", marginTop: "2px" }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              {/* Fields */}
              <div style={{ padding: "4px 20px 12px" }}>
                {card.fields!.map((f, fi) => (
                  <div key={fi} style={{ ...fieldRow, borderBottom: fi < card.fields!.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <f.icon className="w-3.5 h-3.5" style={{ color: "var(--ink3)" }} />
                      <span style={{ color: "var(--ink3)" }}>{f.label}</span>
                    </div>
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
