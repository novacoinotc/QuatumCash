"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface CounterOptions {
  target: number;
  suffix?: string;
  decimal?: boolean;
  duration?: number;
}

export function useCounterAnimation(options: CounterOptions) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { target, suffix = "", decimal = false, duration = 2 } = options;

    const counter = { value: 0 };

    const tween = gsap.to(counter, {
      value: target,
      duration,
      ease: "power3.out",
      snap: decimal ? { value: 0.1 } : { value: 1 },
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (decimal) {
          el.textContent = counter.value.toFixed(1) + suffix;
        } else {
          el.textContent =
            Math.floor(counter.value).toLocaleString("en-US") + suffix;
        }
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [options.target, options.suffix, options.decimal, options.duration]);

  return ref;
}
