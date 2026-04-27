'use client';

import { useEffect, useState } from 'react';

const KEY = 'scratchpad:markdownMode';

export function useMarkdownMode() {
  const [isMarkdown, setIsMarkdown] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration
    setIsMarkdown(localStorage.getItem(KEY) === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, String(isMarkdown));
  }, [isMarkdown]);

  function toggle() {
    setIsMarkdown((prev) => !prev);
  }

  return { isMarkdown, toggle };
}
