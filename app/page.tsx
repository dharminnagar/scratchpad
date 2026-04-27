'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUrlNote } from '@/hooks/use-url-note';
import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';

const iconTransition =
  'transition-[opacity,transform] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)] absolute inset-0';

function CopyIconAnimated({ copied }: { copied: boolean }) {
  return (
    <span className="relative size-3.5">
      <CopyIcon
        className={`${iconTransition}`}
        style={{
          opacity: copied ? 0 : 1,
          transform: copied ? 'scale(0.25)' : 'scale(1)',
        }}
      />
      <CheckIcon
        className={`${iconTransition}`}
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? 'scale(1)' : 'scale(0.25)',
        }}
      />
    </span>
  );
}

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
        <span className="text-sm font-semibold tracking-widest underline underline-offset-4 decoration-dotted hover:cursor-pointer">
          scratchpad
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={linkCopied ? 'secondary' : 'default'}
            onClick={copyLink}
            className="cursor-pointer transition-[color,background-color,transform] duration-150 active:scale-[0.96]"
          >
            <CopyIconAnimated copied={linkCopied} />
            {linkCopied ? 'copied!' : 'link'}
          </Button>
          <Button
            size="sm"
            variant={textCopied ? 'secondary' : 'default'}
            onClick={copyText}
            className="cursor-pointer transition-[color,background-color,transform] duration-150 active:scale-[0.96]"
          >
            <CopyIconAnimated copied={textCopied} />
            {textCopied ? 'copied!' : 'text'}
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
          placeholder="you may begin your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          autoFocus
          spellCheck
        />
      </main>

      <footer className="flex flex-col gap-1 px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            <span className="italic">
              &apos;all good thoughts come from writing&apos;
            </span>{' '}
            {isAtLimit && (
              <span className="text-destructive font-medium">
                :URL limit reached. Delete text to continue editing:
              </span>
            )}
            {!isAtLimit && isNearLimit && (
              <span className="text-secondary dark:secondary font-medium">
                :Approaching URL limit:
              </span>
            )}
          </span>
          <div className="tabular-nums">
            <span
              className="hover:underline underline-offset-2 decoration-dotted hover:cursor-pointer"
              onClick={() => setNote('')}
            >
              reset
            </span>
            <span>{' | '}</span>
            <span>{note.length.toLocaleString()} chars</span>
            {' / '}
            <span>
              {note.trim().split(/\s+/).length.toLocaleString()} words
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
