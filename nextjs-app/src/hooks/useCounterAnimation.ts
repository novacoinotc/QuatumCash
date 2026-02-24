"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface CounterOptions {
  target: number;
  suffix?: string;
  decimal?: boolean;
  duration?: number;
  /** If true, counter advances tied to scroll position */
  scrub?: boolean;
}

export function useCounterAnimation(options: CounterOptions) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      target,
      suffix = "",
      decimal = false,
      duration = 2,
      scrub = false,
    } = options;

    const counter = { value: 0 };

    const updateText = () => {
      if (decimal) {
        el.textContent = counter.value.toFixed(1) + suffix;
      } else {
        el.textContent =
          Math.floor(counter.value).toLocaleString("en-US") + suffix;
      }
    };

    const tweenVars: gsap.TweenVars = {
      value: target,
      ease: scrub ? "none" : "power3.out",
      snap: decimal ? { value: 0.1 } : { value: 1 },
      onUpdate: updateText,
    };

    if (scrub) {
      tweenVars.scrollTrigger = {
        trigger: el,
        start: "top 85%",
        end: "top 40%",
        scrub: 1,
      };
    } else {
      tweenVars.duration = duration;
      tweenVars.scrollTrigger = {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      };
    }

    const tween = gsap.to(counter, tweenVars);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [options.target, options.suffix, options.decimal, options.duration, options.scrub]);

  return ref;
}
