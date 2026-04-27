'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUrlNote } from '@/hooks/use-url-note';
import { cn } from '@/lib/utils';

export default function Home() {
  const { note, setNote, isNearLimit, isAtLimit } = useUrlNote();
  const [linkCopied, setLinkCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  async function copyText() {
    await navigator.clipboard.writeText(note);
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2000);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold tracking-tight tracking-widest">
          scratchpad
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={linkCopied ? 'secondary' : 'default'}
            onClick={copyLink}
            className="transition-all duration-200"
          >
            {linkCopied ? 'copied!' : 'copy link'}
          </Button>
          <Button
            size="sm"
            variant={textCopied ? 'secondary' : 'default'}
            onClick={copyText}
            className="transition-all duration-200"
          >
            {textCopied ? 'copied!' : 'copy text'}
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-col flex-1 overflow-hidden">
        <textarea
          className={cn(
            'flex-1 w-full resize-none bg-background text-foreground',
            'px-4 py-3 text-sm leading-relaxed outline-none',
            'placeholder:text-muted-foreground'
          )}
          placeholder="Start typing — your note is saved in the URL automatically."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          autoFocus
          spellCheck
        />
      </main>

      <footer className="flex flex-col gap-1 px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            welcome back frend{' '}
            {isAtLimit && (
              <span className="text-destructive font-medium">
                :URL limit reached. Delete text to continue editing:
              </span>
            )}
            {!isAtLimit && isNearLimit && (
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                :Approaching URL limit:
              </span>
            )}
          </span>
          <div>
            <span>{note.length.toLocaleString()} chars</span>
            {' / '}
            <span>{note.split(/\s+/).length.toLocaleString()} words</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
