'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
      className="theme-toggle"
    >
      <Sun
        size={16}
        weight="bold"
        className="theme-toggle-icon theme-toggle-sun"
      />
      <Moon
        size={16}
        weight="bold"
        className="theme-toggle-icon theme-toggle-moon"
      />
    </Button>
  );
}
