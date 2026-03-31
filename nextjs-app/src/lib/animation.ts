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
  micro: 0.15,
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
  glacial: 1.2,
} as const;

export const STAGGER = {
  tight: 0.03,
  small: 0.05,
  medium: 0.08,
  large: 0.04,  // for many items (chars, words)
} as const;
