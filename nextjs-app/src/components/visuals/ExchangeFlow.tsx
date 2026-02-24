"use client";

import React from "react";

export default function ExchangeFlow() {
  const id = React.useId();

  const flowPathGrad = `${id}-flow-path-grad`;
  const flowPathGrad2 = `${id}-flow-path-grad2`;
  const hexHubGrad = `${id}-hex-hub-grad`;
  const hexHubCenter = `${id}-hex-hub-center`;

  return (
    <div className="exchange-flow relative flex min-h-[240px] items-center justify-center gap-0 py-[60px] pb-[80px]">
      {/* Orbital paths SVG (background) */}
      <svg
        className="exchange-flow-orbits pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 800 200"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Upper elliptical path */}
        <ellipse
          cx="400"
          cy="100"
          rx="320"
          ry="60"
          stroke={`url(#${flowPathGrad})`}
          strokeWidth="0.8"
          strokeDasharray="6 8"
          opacity="0.2"
        />
        {/* Lower elliptical path */}
        <ellipse
          cx="400"
          cy="100"
          rx="280"
          ry="45"
          stroke={`url(#${flowPathGrad2})`}
          strokeWidth="0.6"
          strokeDasharray="4 10"
          opacity="0.12"
        />
        {/* Arrow indicators */}
        <polygon points="135,76 125,72 128,82" fill="#A78BFA" opacity="0.4" />
        <polygon points="665,124 675,128 672,118" fill="#F472B6" opacity="0.4" />

        {/* Traveling dots (SMIL animateMotion) */}
        <circle r="3" fill="#A78BFA" opacity="0.6">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path="M720,100 A320,60 0 1,1 80,100 A320,60 0 1,1 720,100"
          />
        </circle>
        <circle r="2.5" fill="#F472B6" opacity="0.5">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M680,100 A280,45 0 1,0 120,100 A280,45 0 1,0 680,100"
          />
        </circle>
        <circle r="2" fill="#818CF8" opacity="0.4">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            begin="-4s"
            path="M720,100 A320,60 0 1,1 80,100 A320,60 0 1,1 720,100"
          />
        </circle>

        <defs>
          <linearGradient id={flowPathGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
            <stop offset="30%" stopColor="#A78BFA" />
            <stop offset="70%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={flowPathGrad2} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Left: MXN Card */}
      <div
        className="flow-card flow-card-left relative z-[2] flex items-center gap-[14px] rounded-2xl border border-[rgba(129,140,248,0.2)] px-4 py-5 backdrop-blur-[10px] md:px-7"
        style={{
          background:
            "linear-gradient(135deg, rgba(17,19,40,0.9) 0%, rgba(79,70,229,0.08) 100%)",
        }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-[1.4rem] font-bold"
          style={{
            background: "rgba(129,140,248,0.12)",
            border: "1px solid rgba(129,140,248,0.25)",
            color: "#818CF8",
          }}
        >
          <span>$</span>
        </div>
        <div>
          <strong className="block text-[1.1rem] font-bold text-white">
            MXN
          </strong>
          <span className="text-[0.82rem] text-[#64748B]">Pesos</span>
        </div>
      </div>

      {/* Center: Hexagon Hub */}
      <div className="flow-center relative z-[2] flex flex-col items-center px-10">
        {/* Hex glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-[60%]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
            animation: "hex-pulse 3s ease-in-out infinite",
          }}
        />

        <svg
          className="h-[100px] w-[100px]"
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden="true"
        >
          <polygon
            points="60,5 110,30 110,90 60,115 10,90 10,30"
            stroke={`url(#${hexHubGrad})`}
            strokeWidth="1.5"
            fill="rgba(124,58,237,0.06)"
          />
          <polygon
            points="60,25 90,40 90,80 60,95 30,80 30,40"
            stroke={`url(#${hexHubGrad})`}
            strokeWidth="0.8"
            fill="rgba(124,58,237,0.04)"
            opacity="0.6"
          />
          <polygon
            points="60,40 75,48 75,72 60,80 45,72 45,48"
            fill={`url(#${hexHubCenter})`}
            opacity="0.8"
          />
          <defs>
            <linearGradient
              id={hexHubGrad}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient
              id={hexHubCenter}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting mini dots */}
        <div
          className="flow-orbit-dot absolute left-1/2 top-1/2 h-[6px] w-[6px] rounded-full will-change-transform"
          style={{
            background: "#818CF8",
            animation: "orbit-hex-1 6s linear infinite",
          }}
        />
        <div
          className="flow-orbit-dot absolute left-1/2 top-1/2 h-[6px] w-[6px] rounded-full will-change-transform"
          style={{
            background: "#F472B6",
            animation: "orbit-hex-2 8s linear infinite",
          }}
        />
        <div
          className="flow-orbit-dot absolute left-1/2 top-1/2 h-[6px] w-[6px] rounded-full will-change-transform"
          style={{
            background: "#A78BFA",
            animation: "orbit-hex-3 5s linear infinite",
          }}
        />

        <span className="mt-3 text-[0.78rem] lowercase tracking-wider text-[#64748B]">
          Intercambio instantaneo
        </span>
      </div>

      {/* Right: CRYPTO Card */}
      <div
        className="flow-card flow-card-right relative z-[2] flex items-center gap-[14px] rounded-2xl border border-[rgba(244,114,182,0.2)] px-4 py-5 backdrop-blur-[10px] md:px-7"
        style={{
          background:
            "linear-gradient(135deg, rgba(236,72,153,0.06) 0%, rgba(17,19,40,0.9) 100%)",
        }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-[1.6rem] font-bold"
          style={{
            background: "rgba(244,114,182,0.12)",
            border: "1px solid rgba(244,114,182,0.25)",
            color: "#F472B6",
          }}
        >
          <span>&#8383;</span>
        </div>
        <div>
          <strong className="block text-[1.1rem] font-bold text-white">
            CRYPTO
          </strong>
          <span className="text-[0.82rem] text-[#64748B]">Bitcoin</span>
        </div>
      </div>
    </div>
  );
}
