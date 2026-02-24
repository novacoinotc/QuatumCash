"use client";

import React from "react";

export default function PhoneMockup() {
  const id = React.useId();
  const chartFillGrad = `${id}-chart-fill-grad`;
  const chartLineGrad = `${id}-chart-line-grad`;

  return (
    <div className="phone-mockup-wrapper relative flex items-center justify-center">
      {/* Glow behind phone */}
      <div
        className="phone-glow pointer-events-none absolute left-1/2 top-1/2 z-0 h-[400px] w-[300px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Connecting lines SVG */}
      <svg
        className="phone-connect-lines pointer-events-none absolute left-1/2 top-1/2 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 max-md:hidden"
        viewBox="0 0 500 500"
        fill="none"
        aria-hidden="true"
      >
        <line
          x1="60"
          y1="180"
          x2="150"
          y2="220"
          stroke="#A78BFA"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          opacity="0.25"
        />
        <line
          x1="440"
          y1="160"
          x2="350"
          y2="200"
          stroke="#F472B6"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          opacity="0.2"
        />
        <line
          x1="250"
          y1="460"
          x2="250"
          y2="400"
          stroke="#818CF8"
          strokeWidth="0.6"
          strokeDasharray="4 6"
          opacity="0.2"
        />
        <circle cx="105" cy="200" r="1.5" fill="#A78BFA" opacity="0.4" />
        <circle cx="395" cy="180" r="1.5" fill="#F472B6" opacity="0.35" />
      </svg>

      {/* Orbiting icons — hidden on mobile to prevent overflow */}
      <div
        className="phone-orbit-icon absolute left-[-50px] top-[25%] z-[1] flex h-11 w-11 items-center justify-center rounded-full text-[1.2rem] font-bold max-md:hidden"
        style={{
          background: "rgba(244,163,58,0.1)",
          border: "1px solid rgba(244,163,58,0.25)",
          color: "#F4A33A",
          animation: "orbit-1 5s ease-in-out infinite",
        }}
      >
        <span>&#8383;</span>
      </div>
      <div
        className="phone-orbit-icon absolute right-[-50px] top-[30%] z-[1] flex h-11 w-11 items-center justify-center rounded-full max-md:hidden"
        style={{
          background: "rgba(167,139,250,0.1)",
          border: "1px solid rgba(167,139,250,0.2)",
          color: "#A78BFA",
          animation: "orbit-2 6s ease-in-out infinite 1s",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>
      <div
        className="phone-orbit-icon absolute bottom-[20%] left-[-40px] z-[1] flex h-[38px] w-[38px] items-center justify-center rounded-full text-[1.1rem] font-bold max-md:hidden"
        style={{
          background: "rgba(129,140,248,0.1)",
          border: "1px solid rgba(129,140,248,0.2)",
          color: "#818CF8",
          animation: "orbit-3 7s ease-in-out infinite 2s",
        }}
      >
        <span>$</span>
      </div>
      <div
        className="phone-orbit-icon absolute bottom-[25%] right-[-45px] z-[1] flex h-[38px] w-[38px] items-center justify-center rounded-full max-md:hidden"
        style={{
          background: "rgba(244,114,182,0.1)",
          border: "1px solid rgba(244,114,182,0.2)",
          color: "#F472B6",
          animation: "orbit-4 5.5s ease-in-out infinite 0.5s",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Phone frame — responsive width */}
      <div className="phone-frame relative z-[2] w-[220px] overflow-hidden rounded-[28px] border-[1.5px] border-[rgba(167,139,250,0.25)] bg-[#111328] px-4 pb-[10px] pt-3 shadow-[0_0_60px_rgba(124,58,237,0.08),0_0_120px_rgba(236,72,153,0.04)] md:w-[260px]">
        {/* Gradient border overlay */}
        <div
          className="pointer-events-none absolute inset-[-1.5px] rounded-[28px] p-[1.5px]"
          style={{
            background:
              "linear-gradient(160deg, rgba(167,139,250,0.3), rgba(124,58,237,0.1), rgba(236,72,153,0.2))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Status bar */}
        <div className="flex items-center justify-between px-1 pb-2 pt-1 text-[0.7rem] font-semibold text-[#94A3B8]">
          <span>9:41</span>
          <span>
            <svg
              width="20"
              height="10"
              viewBox="0 0 24 12"
              fill="currentColor"
              opacity="0.5"
            >
              <rect
                x="0"
                y="1"
                width="20"
                height="10"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect x="2" y="3" width="14" height="6" rx="1" fill="currentColor" />
              <rect x="21" y="3.5" width="2" height="5" rx="1" fill="currentColor" />
            </svg>
          </span>
        </div>

        {/* App header */}
        <div className="flex items-baseline gap-[10px] px-1 pb-3">
          <span className="text-base font-bold text-white">QuantumCash</span>
          <span className="text-[0.88rem] font-semibold text-[#A78BFA]">
            Exchange
          </span>
        </div>

        {/* Chart area */}
        <div className="relative mb-[14px] h-[100px] overflow-hidden rounded-xl border border-[#1E2044] bg-[rgba(11,13,23,0.6)] p-[10px]">
          <span className="absolute right-2 top-2 z-[1] rounded-md bg-[rgba(34,197,94,0.12)] px-2 py-[2px] text-[0.68rem] font-bold text-[#22C55E]">
            +12.4%
          </span>
          <svg
            className="h-full w-full"
            viewBox="0 0 260 80"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={chartFillGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={chartLineGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
            <path
              d="M0,65 C20,62 40,58 65,55 C90,52 110,50 130,42 C150,34 170,38 190,30 C210,22 230,15 250,10 L260,8"
              stroke={`url(#${chartLineGrad})`}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0,65 C20,62 40,58 65,55 C90,52 110,50 130,42 C150,34 170,38 190,30 C210,22 230,15 250,10 L260,8 L260,80 L0,80 Z"
              fill={`url(#${chartFillGrad})`}
            />
            <circle cx="250" cy="10" r="4" fill="#A78BFA" />
            <circle
              cx="250"
              cy="10"
              r="7"
              stroke="#A78BFA"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Crypto list */}
        <div className="mb-[14px] flex flex-col gap-[2px]">
          {/* BTC */}
          <div className="grid grid-cols-[28px_36px_1fr_auto] items-center gap-2 border-b border-[rgba(30,32,68,0.5)] px-[6px] py-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[0.8rem] font-bold"
              style={{
                background: "rgba(244,163,58,0.15)",
                color: "#F4A33A",
              }}
            >
              &#8383;
            </span>
            <span className="text-[0.82rem] font-semibold text-white">BTC</span>
            <span className="text-right text-[0.78rem] font-medium text-[#CBD5E1]">
              $1,680,000
            </span>
            <span className="text-right text-[0.72rem] font-semibold text-[#22C55E]">
              +3.2%
            </span>
          </div>

          {/* ETH */}
          <div className="grid grid-cols-[28px_36px_1fr_auto] items-center gap-2 border-b border-[rgba(30,32,68,0.5)] px-[6px] py-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{
                background: "rgba(129,140,248,0.15)",
                color: "#818CF8",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1.75l-6.25 10.5h4.5L8.5 22.25 18.25 11h-4.5l2-9.25z" />
              </svg>
            </span>
            <span className="text-[0.82rem] font-semibold text-white">ETH</span>
            <span className="text-right text-[0.78rem] font-medium text-[#CBD5E1]">
              $54,200
            </span>
            <span className="text-right text-[0.72rem] font-semibold text-[#22C55E]">
              +1.8%
            </span>
          </div>

          {/* USDT */}
          <div className="grid grid-cols-[28px_36px_1fr_auto] items-center gap-2 px-[6px] py-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[0.8rem] font-bold"
              style={{
                background: "rgba(34,197,94,0.15)",
                color: "#22C55E",
              }}
            >
              $
            </span>
            <span className="text-[0.82rem] font-semibold text-white">USDT</span>
            <span className="text-right text-[0.78rem] font-medium text-[#CBD5E1]">
              $20.45
            </span>
            <span className="text-right text-[0.72rem] font-semibold text-[#64748B]">
              ~0.0%
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mb-[10px] grid grid-cols-2 gap-2">
          <button
            className="cursor-default rounded-[10px] border-none py-[10px] text-[0.78rem] font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
            }}
          >
            Comprar
          </button>
          <button className="cursor-default rounded-[10px] border border-[#1E2044] bg-transparent py-[10px] text-[0.78rem] font-semibold text-[#CBD5E1]">
            Vender
          </button>
        </div>

        {/* Home bar */}
        <div className="mx-auto mt-[6px] mb-[2px] h-1 w-[40%] rounded-full bg-[#475569] opacity-50" />
      </div>
    </div>
  );
}
