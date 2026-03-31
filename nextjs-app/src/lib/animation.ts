/**
 * QUANTUMCASH ANIMATION TOKENS v2.0
 * Shared constants for all GSAP animations.
 * Every section MUST use these — no hardcoded values.
 */

// ── Easing ──
export const EASE = {
  enter: "expo.out",          // Primary entrance (headings, hero)
  enterSoft: "power3.out",    // Secondary entrance (body, cards)
  exit: "power2.in",          // Elements leaving
  scrub: "none",              // Scroll-driven (scrub handles easing)
  elastic: "elastic.out(1, 0.5)", // Counters, badges snapping
  hoverIn: "power2.out",      // Hover enter
  hoverOut: "power2.inOut",   // Hover leave
  spring: "back.out(1.4)",    // Buttons, interactive elements
} as const;

// ── Duration (seconds) ──
export const DUR = {
  micro: 0.2,
  fast: 0.4,
  base: 0.8,
  slow: 1.4,
  glacial: 2.0,
} as const;

// ── Stagger ──
export const STAGGER = {
  small: 0.08,    // 2-4 items
  medium: 0.12,   // 4-8 items
  large: 0.06,    // 8+ items (words, chars)
} as const;

// ── Movement distances (px) ──
export const MOVE = {
  y: { enter: 80, exit: -40 },
  x: { enter: 120, exit: -60 },
} as const;

// Mobile multiplier: 0.5 for Y, 0.6 for X
export const MOVE_MOBILE = {
  y: { enter: 40, exit: -20 },
  x: { enter: 72, exit: -36 },
} as const;

// ── Blur ──
export const BLUR = {
  enter: "blur(12px)",
  exit: "blur(6px)",
  subtle: "blur(4px)",
} as const;

// ── Scale ──
export const SCALE = {
  enter: 0.92,
  rest: 1,
  hoverCard: 1.03,
  hoverBtn: 1.06,
  active: 0.97,
  exit: 0.96,
} as const;

// ── Scrub values ──
export const SCRUB = {
  cinematic: 1.5,   // Pinned dramatic sections
  text: 0.8,        // Text reveals
  cards: 1.2,       // Card choreography
  parallax: true,    // Instant parallax response
} as const;

// ── Colors (for GSAP tweens) ──
export const GLOW = {
  primary: "#00F0FF",
  secondary: "#8B5CF6",
  accent: "#06FFA5",
  warm: "#FF6B35",
} as const;
