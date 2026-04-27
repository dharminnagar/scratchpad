'use client';

import { useEffect, useState } from 'react';

const KEY = 'scratchpad:fontSize';
const DEFAULT = 14;
const MIN = 12;
const MAX = 24;
const STEP = 2;

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(KEY) ?? '', 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration
    setFontSizeState(isNaN(stored) ? DEFAULT : stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, String(fontSize));
  }, [fontSize]);

  return {
    fontSize,
    increase: () => setFontSizeState((p) => Math.min(MAX, p + STEP)),
    decrease: () => setFontSizeState((p) => Math.max(MIN, p - STEP)),
    atMin: fontSize <= MIN,
    atMax: fontSize >= MAX,
  };
}
