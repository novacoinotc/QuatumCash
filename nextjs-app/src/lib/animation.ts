/**
 * QUANTUMCASH ANIMATION SYSTEM v3.0
 * Ground-up redesign tokens. Every component imports these.
 */

export const EASE = {
  enter: "expo.out",
  enterSoft: "power3.out",
  exit: "power2.in",
  elastic: "elastic.out(1, 0.5)",
  spring: "back.out(1.4)",
  smooth: "power2.inOut",
} as const;

export const DUR = {
  micro: 0.2,
  fast: 0.4,
  base: 0.8,
  slow: 1.4,
  glacial: 2.0,
} as const;

export const STAGGER = {
  tight: 0.04,
  small: 0.08,
  medium: 0.12,
  large: 0.06,  // for many items (chars, words)
} as const;
