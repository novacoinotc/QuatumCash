"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DUR } from "@/lib/animation";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation
    gsap.from(nav, {
      y: -100,
      autoAlpha: 0,
      duration: DUR.base,
      delay: 0.1,
      ease: "power3.out",
    });

    // Smart show/hide on scroll + scrolled glassmorphism
    const onScroll = () => {
      const currentY = window.scrollY;

      // Toggle glassmorphism class directly on the element
      nav.classList.toggle("scrolled", currentY > 50);

      // Hide on scroll down, show on scroll up (only after 300px)
      if (currentY > 300) {
        if (currentY > lastScrollY.current + 5) {
          gsap.to(nav, {
            y: -100,
            duration: 0.3,
            ease: "power2.in",
            overwrite: true,
          });
        } else if (currentY < lastScrollY.current - 5) {
          gsap.to(nav, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true,
          });
        }
      } else {
        gsap.to(nav, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate mobile overlay links on open
  useEffect(() => {
    if (!menuOpen || !overlayRef.current) return;

    const links = overlayRef.current.querySelectorAll(".mobile-nav-link");
    gsap.fromTo(
      links,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: DUR.fast,
        ease: "power3.out",
        stagger: 0.06,
      }
    );
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setMenuOpen(false);
      document.body.style.overflow = "";
    },
    []
  );

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? "hidden" : "";
      return !prev;
    });
  }, []);

  return (
    <nav ref={navRef} className="navbar">
      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-violet-600 font-[var(--font-primary)] text-sm font-bold text-white">
            Q
          </span>
          <span className="font-[var(--font-primary)] text-lg font-bold text-white">
            Quantum<span className="gradient-text">Cash</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <ul
          className="nav-menu hidden items-center gap-2 md:flex"
          style={{ listStyle: "none" }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  link.isCta
                    ? "bg-gradient-to-r from-cyan-500 via-violet-600 to-violet-500 text-white"
                    : "text-[var(--gray-400)] hover:text-[var(--cyan)]"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMenu}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Menu"
        >
          <span
            className={`block h-0.5 w-5 bg-white transition-transform duration-300 ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-[transform,opacity] duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-transform duration-300 ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[var(--surface-dark)]/95 backdrop-blur-xl md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`mobile-nav-link text-xl font-medium transition-colors hover:text-[var(--cyan)] ${
                link.isCta ? "gradient-text" : "text-[var(--gray-300)]"
              }`}
              style={{ visibility: "hidden" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
