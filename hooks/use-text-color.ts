"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "scratchpad:textColor";

export function useTextColor() {
  const [textColor, setTextColorState] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration; must run after mount
    if (stored) setTextColorState(stored);
  }, []);

  function setTextColor(color: string) {
    setTextColorState(color);
    localStorage.setItem(STORAGE_KEY, color);
  }

  function resetTextColor() {
    setTextColorState("");
    localStorage.removeItem(STORAGE_KEY);
  }

  return { textColor, setTextColor, resetTextColor };
}
