'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useUrlNote } from '@/hooks/use-url-note'
import { cn } from '@/lib/utils'

export default function Home() {
  const { note, setNote, urlLength, isNearLimit, isAtLimit } = useUrlNote()
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold tracking-tight">URL Scratchpad</span>
        <Button
          size="sm"
          variant={copied ? 'secondary' : 'default'}
          onClick={copyLink}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </header>

      <main className="flex flex-col flex-1 overflow-hidden">
        <textarea
          className={cn(
            'flex-1 w-full resize-none bg-background text-foreground',
            'px-4 py-3 text-sm leading-relaxed outline-none',
            'placeholder:text-muted-foreground',
            isAtLimit && 'opacity-50 cursor-not-allowed',
          )}
          placeholder="Start typing — your note is saved in the URL automatically."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isAtLimit}
          autoFocus
          spellCheck
        />
      </main>

      <footer className="flex flex-col gap-1 px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Data lives in the URL · no server, no login</span>
          <span>{note.length.toLocaleString()} chars</span>
        </div>
        {isAtLimit && (
          <div className="text-destructive font-medium">
            URL limit reached ({urlLength.toLocaleString()} chars). Cannot add more text.
          </div>
        )}
        {!isAtLimit && isNearLimit && (
          <div className="text-yellow-600 dark:text-yellow-400 font-medium">
            Approaching URL limit — {urlLength.toLocaleString()} chars used.
          </div>
        )}
      </footer>
    </div>
  )
}
