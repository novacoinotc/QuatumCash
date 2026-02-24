"use client";

import React from "react";

export default function OrbitalRings() {
  const id = React.useId();

  // Build unique IDs to avoid SVG gradient conflicts when multiple instances exist
  const gradOrbit1 = `${id}-grad-orbit1`;
  const gradDot1 = `${id}-grad-dot1`;
  const orbitPath1 = `${id}-orbitPath1`;
  const gradOrbit2 = `${id}-grad-orbit2`;
  const orbitPath2 = `${id}-orbitPath2`;
  const gradHex = `${id}-grad-hex`;
  const gradCircuit = `${id}-grad-circuit`;
  const gradCircuit2 = `${id}-grad-circuit2`;

  return (
    <div className="vector-art hero-vectors pointer-events-none absolute inset-0 overflow-hidden">
      {/* --- Orbital Ring 1 --- */}
      <svg
        className="orbit-ring orbit-ring-1 absolute left-1/2 top-1/2 w-[500px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-60 md:w-[600px]"
        viewBox="0 0 500 500"
        fill="none"
        aria-hidden="true"
      >
        <ellipse
          cx="250"
          cy="250"
          rx="240"
          ry="120"
          stroke={`url(#${gradOrbit1})`}
          strokeWidth="0.5"
          opacity="0.3"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 250 250"
            to="360 250 250"
            dur="30s"
            repeatCount="indefinite"
          />
        </ellipse>
        <circle r="4" fill={`url(#${gradDot1})`}>
          <animateMotion dur="30s" repeatCount="indefinite">
            <mpath href={`#${orbitPath1}`} />
          </animateMotion>
        </circle>
        <circle r="2.5" fill="#A78BFA" opacity="0.6">
          <animateMotion dur="30s" repeatCount="indefinite" begin="-15s">
            <mpath href={`#${orbitPath1}`} />
          </animateMotion>
        </circle>
        <defs>
          <path
            id={orbitPath1}
            d="M490,250 A240,120 0 1,1 10,250 A240,120 0 1,1 490,250"
          />
          <linearGradient id={gradOrbit1} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <radialGradient id={gradDot1}>
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#7C3AED" />
          </radialGradient>
        </defs>
      </svg>

      {/* --- Orbital Ring 2 --- */}
      <svg
        className="orbit-ring orbit-ring-2 absolute left-1/2 top-1/2 w-[420px] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-50 md:w-[520px]"
        viewBox="0 0 500 500"
        fill="none"
        aria-hidden="true"
      >
        <ellipse
          cx="250"
          cy="250"
          rx="200"
          ry="80"
          stroke={`url(#${gradOrbit2})`}
          strokeWidth="0.5"
          opacity="0.2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="60 250 250"
            to="420 250 250"
            dur="25s"
            repeatCount="indefinite"
          />
        </ellipse>
        <circle r="3" fill="#818CF8" opacity="0.8">
          <animateMotion dur="25s" repeatCount="indefinite">
            <mpath href={`#${orbitPath2}`} />
          </animateMotion>
        </circle>
        <defs>
          <path
            id={orbitPath2}
            d="M450,250 A200,80 0 1,1 50,250 A200,80 0 1,1 450,250"
          />
          <linearGradient id={gradOrbit2} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* --- Floating Geometric Shapes --- */}

      {/* Hexagon */}
      <svg
        className="geo-shape geo-hexagon absolute left-[5%] top-[15%] w-[80px] md:w-[100px]"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="50,2 93,25 93,75 50,98 7,75 7,25"
          stroke={`url(#${gradHex})`}
          strokeWidth="0.8"
          opacity="0.2"
        />
        <polygon
          points="50,15 80,30 80,70 50,85 20,70 20,30"
          stroke="#A78BFA"
          strokeWidth="0.4"
          opacity="0.15"
        />
        <defs>
          <linearGradient id={gradHex} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Diamond */}
      <svg
        className="geo-shape geo-diamond absolute right-[8%] top-[20%] w-[60px] md:w-[80px]"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="12"
          y="12"
          width="56"
          height="56"
          rx="2"
          stroke="#7C3AED"
          strokeWidth="0.6"
          opacity="0.15"
          transform="rotate(45 40 40)"
        />
        <rect
          x="22"
          y="22"
          width="36"
          height="36"
          rx="1"
          stroke="#F472B6"
          strokeWidth="0.4"
          opacity="0.1"
          transform="rotate(45 40 40)"
        />
      </svg>

      {/* Triangle */}
      <svg
        className="geo-shape geo-triangle absolute bottom-[18%] left-[12%] w-[60px] md:w-[80px]"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="40,5 75,70 5,70"
          stroke="#818CF8"
          strokeWidth="0.6"
          opacity="0.15"
        />
        <polygon
          points="40,20 62,60 18,60"
          stroke="#A78BFA"
          strokeWidth="0.4"
          opacity="0.1"
        />
      </svg>

      {/* Circle Dots */}
      <svg
        className="geo-shape geo-circle-dots absolute bottom-[25%] right-[6%] w-[90px] md:w-[120px]"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r="55"
          stroke="#7C3AED"
          strokeWidth="0.4"
          opacity="0.1"
          strokeDasharray="4 8"
        />
        <circle cx="60" cy="5" r="2" fill="#F472B6" opacity="0.4">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="115" cy="60" r="1.5" fill="#818CF8" opacity="0.3">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="-360 60 60"
            dur="15s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* --- Circuit Lines --- */}

      {/* Left circuit */}
      <svg
        className="circuit-lines circuit-left absolute bottom-0 left-0 top-0 w-[120px] opacity-80 md:w-[200px]"
        viewBox="0 0 200 600"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M180,0 L180,80 L100,80 L100,200 L60,200 L60,350 L120,350 L120,450 L80,450 L80,600"
          stroke={`url(#${gradCircuit})`}
          strokeWidth="0.5"
          opacity="0.12"
          strokeDasharray="6 10"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-160"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="100" cy="200" r="3" fill="#7C3AED" opacity="0.25" />
        <circle cx="60" cy="350" r="2" fill="#F472B6" opacity="0.2" />
        <circle cx="120" cy="450" r="2.5" fill="#818CF8" opacity="0.2" />
        <defs>
          <linearGradient id={gradCircuit} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
            <stop offset="30%" stopColor="#7C3AED" />
            <stop offset="70%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Right circuit */}
      <svg
        className="circuit-lines circuit-right absolute bottom-0 right-0 top-0 w-[120px] opacity-80 md:w-[200px]"
        viewBox="0 0 200 600"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20,0 L20,120 L80,120 L80,250 L140,250 L140,400 L60,400 L60,520 L120,520 L120,600"
          stroke={`url(#${gradCircuit2})`}
          strokeWidth="0.5"
          opacity="0.12"
          strokeDasharray="6 10"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-160"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="80" cy="250" r="2.5" fill="#A78BFA" opacity="0.2" />
        <circle cx="140" cy="400" r="3" fill="#818CF8" opacity="0.25" />
        <defs>
          <linearGradient id={gradCircuit2} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
            <stop offset="30%" stopColor="#A78BFA" />
            <stop offset="70%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
