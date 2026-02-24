"use client";

import React, { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CHAT_MESSAGES } from "@/lib/constants";

export default function ChatMockup() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messagesRef.current || !wrapperRef.current) return;

    const msgEls = messagesRef.current.querySelectorAll(".chat-msg");
    if (msgEls.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(msgEls, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(msgEls, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.3,
            ease: "power2.out",
          });
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="chat-mockup-wrapper relative">
      {/* Glow */}
      <div
        className="chat-glow pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[280px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, rgba(236,72,153,0.05) 50%, transparent 70%)",
        }}
      />

      {/* Floating badge icons */}
      <div
        className="chat-badge-icon chat-badge-fast absolute left-[-30px] top-[15%] z-[1] flex h-9 w-9 items-center justify-center rounded-full will-change-transform"
        style={{
          background: "rgba(244,163,58,0.1)",
          border: "1px solid rgba(244,163,58,0.2)",
          color: "#F4A33A",
          animation: "orbit-1 6s ease-in-out infinite",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <div
        className="chat-badge-icon chat-badge-lock absolute right-[-30px] top-[30%] z-[1] flex h-9 w-9 items-center justify-center rounded-full will-change-transform"
        style={{
          background: "rgba(167,139,250,0.1)",
          border: "1px solid rgba(167,139,250,0.2)",
          color: "#A78BFA",
          animation: "orbit-2 5s ease-in-out infinite 1s",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <div
        className="chat-badge-icon chat-badge-check absolute bottom-[15%] right-[-25px] z-[1] flex h-9 w-9 items-center justify-center rounded-full will-change-transform"
        style={{
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.2)",
          color: "#22C55E",
          animation: "orbit-3 7s ease-in-out infinite 2s",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Chat window */}
      <div className="chat-window relative z-[2] w-[300px] overflow-hidden rounded-[20px] border-[1.5px] border-[rgba(167,139,250,0.2)] bg-[#111328] shadow-[0_0_50px_rgba(124,58,237,0.06),0_0_100px_rgba(236,72,153,0.03)]">
        {/* Gradient border overlay */}
        <div
          className="pointer-events-none absolute inset-[-1.5px] rounded-[20px] p-[1.5px]"
          style={{
            background:
              "linear-gradient(160deg, rgba(167,139,250,0.25), rgba(124,58,237,0.08), rgba(236,72,153,0.15))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Chat header */}
        <div className="flex items-center gap-[10px] border-b border-[#1E2044] bg-[rgba(11,13,23,0.5)] px-4 py-[14px]">
          <div
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-[0.85rem] font-extrabold text-white"
            style={{
              background:
                "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)",
            }}
          >
            Q
          </div>
          <div>
            <span className="block text-[0.88rem] font-semibold text-white">
              QuantumCash
            </span>
            <span className="flex items-center gap-1 text-[0.7rem] text-[#64748B]">
              <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#22C55E]" />
              En linea
            </span>
          </div>
        </div>

        {/* Chat messages */}
        <div
          ref={messagesRef}
          className="flex flex-col gap-[10px] px-[14px] py-4"
        >
          {CHAT_MESSAGES.map((msg, i) => {
            const isUser = msg.sender === "user";
            const isConfirm = "isConfirm" in msg && msg.isConfirm;

            return (
              <div
                key={i}
                className={`chat-msg flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {isConfirm ? (
                  <div className="flex max-w-[85%] items-center gap-2 rounded-[14px] rounded-bl-[4px] border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.08)] px-[14px] py-[10px] text-[0.78rem] font-semibold leading-[1.5] text-[#22C55E]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {msg.text}
                  </div>
                ) : "html" in msg && msg.html ? (
                  <div
                    className={`max-w-[85%] rounded-[14px] px-[14px] py-[10px] text-[0.78rem] leading-[1.5] ${
                      isUser
                        ? "rounded-br-[4px] border border-[rgba(79,70,229,0.2)] bg-[rgba(79,70,229,0.15)] text-[#CBD5E1]"
                        : "rounded-bl-[4px] border border-[#1E2044] bg-[rgba(17,19,40,0.8)] text-[#CBD5E1]"
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.html }}
                  />
                ) : (
                  <div
                    className={`max-w-[85%] rounded-[14px] px-[14px] py-[10px] text-[0.78rem] leading-[1.5] ${
                      isUser
                        ? "rounded-br-[4px] border border-[rgba(79,70,229,0.2)] bg-[rgba(79,70,229,0.15)] text-[#CBD5E1]"
                        : "rounded-bl-[4px] border border-[#1E2044] bg-[rgba(17,19,40,0.8)] text-[#CBD5E1]"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                <span className="mt-[3px] px-1 text-[0.62rem] text-[#475569]">
                  {msg.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Chat input */}
        <div className="flex items-center justify-between border-t border-[#1E2044] px-4 py-3 text-[0.75rem] text-[#475569]">
          <span>Escribe un mensaje...</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            opacity="0.3"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
