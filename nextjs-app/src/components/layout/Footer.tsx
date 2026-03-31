"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/animation";
import {
  FOOTER_NAV,
  FOOTER_SERVICES,
  FOOTER_ECOSYSTEM,
} from "@/lib/constants";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      gsap.set(footer.querySelectorAll(".footer-col, .footer-bottom"), {
        autoAlpha: 1,
        y: 0,
      });
      return;
    }

    // Staggered reveal of footer columns
    const columns = footer.querySelectorAll(".footer-col");
    const bottomBar = footer.querySelector(".footer-bottom");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 90%",
        end: "top 60%",
        scrub: 1,
      },
    });

    tl.from(columns, {
      autoAlpha: 0,
      y: 30,
      stagger: STAGGER.small,
      duration: 0.4,
      ease: EASE.enterSoft,
    });

    if (bottomBar) {
      tl.from(
        bottomBar,
        {
          autoAlpha: 0,
          y: 15,
          duration: 0.3,
          ease: EASE.enterSoft,
        },
        "-=0.1"
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-[var(--dark-border)] bg-[var(--surface-dark)] py-16"
    >
      {/* Top line with gradient */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--glow-primary)]/30 to-transparent" />

      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="footer-col">
            <a href="#" className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-violet-600 font-bold text-white">
                Q
              </span>
              <span className="font-[var(--font-primary)] text-lg font-bold text-white">
                Quantum<span className="gradient-text">Cash</span>
              </span>
            </a>
            <p className="text-sm text-[var(--gray-500)]">
              La cuenta P2P mas grande de Mexico. Operadora oficial de
              NovaCoin.mx
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4 className="mb-4 font-[var(--font-primary)] text-sm font-semibold text-white">
              Navegacion
            </h4>
            <div className="flex flex-col gap-2">
              {FOOTER_NAV.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--gray-500)] transition-colors hover:text-[var(--glow-primary)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4 className="mb-4 font-[var(--font-primary)] text-sm font-semibold text-white">
              Servicios
            </h4>
            <div className="flex flex-col gap-2">
              {FOOTER_SERVICES.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[var(--gray-500)] transition-colors hover:text-[var(--glow-primary)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div className="footer-col">
            <h4 className="mb-4 font-[var(--font-primary)] text-sm font-semibold text-white">
              Ecosistema
            </h4>
            <div className="flex flex-col gap-2">
              {FOOTER_ECOSYSTEM.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener" : undefined}
                  className="text-sm text-[var(--gray-500)] transition-colors hover:text-[var(--glow-primary)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom flex flex-col items-center justify-between gap-4 border-t border-[var(--dark-border)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--gray-600)]">
            &copy; 2025 QuantumCash. Todos los derechos reservados.
          </p>
          <p className="text-xs text-[var(--gray-600)]">
            Powered by{" "}
            <a
              href="https://www.novacoin.mx"
              target="_blank"
              rel="noopener"
              className="text-[var(--glow-primary)] hover:underline"
            >
              NovaCoin.mx
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
