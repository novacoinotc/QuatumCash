"use client";

import { useState, useEffect, useCallback } from "react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--blue)] via-[var(--purple)] to-[var(--pink)] font-[var(--font-primary)] text-sm font-bold text-white">
            Q
          </span>
          <span className="font-[var(--font-primary)] text-lg font-bold text-white">
            Quantum<span className="gradient-text">Cash</span>
          </span>
        </a>

        <ul
          className={`nav-menu ${menuOpen ? "active" : ""}`}
          style={{
            display: "flex",
            gap: "8px",
            listStyle: "none",
            alignItems: "center",
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:text-white ${
                  link.isCta
                    ? "bg-gradient-to-r from-[var(--blue)] via-[var(--purple)] to-[var(--pink)] text-white"
                    : "text-[var(--gray-400)]"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={toggleMenu}
          className={`nav-toggle relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden ${
            menuOpen ? "active" : ""
          }`}
          aria-label="Menu"
        >
          <span
            className={`block h-0.5 w-5 bg-white transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-[transform,opacity] ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-0 z-40 flex flex-col items-center justify-center gap-6 bg-[var(--dark)]/95 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-xl font-medium transition-colors hover:text-white ${
                link.isCta
                  ? "gradient-text"
                  : "text-[var(--gray-300)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
