'use client';

import { useState } from 'react';

const STORAGE_KEY = 'scratchpad:textColor';

export function useTextColor() {
  const [textColor, setTextColorState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY) ?? '';
  });

  function setTextColor(color: string) {
    setTextColorState(color);
    localStorage.setItem(STORAGE_KEY, color);
  }

  function resetTextColor() {
    setTextColorState('');
    localStorage.removeItem(STORAGE_KEY);
  }

  return { textColor, setTextColor, resetTextColor };
}
