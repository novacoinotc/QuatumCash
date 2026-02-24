"use client";

import { useState, useEffect, useCallback } from "react";

export function useTypingEffect(phrases: string[]) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      setText(currentPhrase.substring(0, charIndex - 1));
      setCharIndex((prev) => prev - 1);
    } else {
      setText(currentPhrase.substring(0, charIndex + 1));
      setCharIndex((prev) => prev + 1);
    }
  }, [phrases, phraseIndex, charIndex, isDeleting]);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let speed: number;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2500;
      const timeout = setTimeout(() => setIsDeleting(true), speed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      speed = 400;
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, speed);
      return () => clearTimeout(timeout);
    }

    speed = isDeleting ? 40 : 80;
    const timeout = setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases, tick]);

  return text;
}
