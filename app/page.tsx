"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import { useTheme } from "next-themes";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ColorPicker } from "@/components/color-picker";
import { useUrlNote } from "@/hooks/use-url-note";
import { useTextColor } from "@/hooks/use-text-color";
import { useFontSize } from "@/hooks/use-font-size";
import { useMarkdownMode } from "@/hooks/use-markdown-mode";
import { cn, invertLightness } from "@/lib/utils";
import Copy from "@/components/copy-icon";

export default function Home() {
  const { note, setNote, isNearLimit, isAtLimit } = useUrlNote();
  const { textColor, setTextColor, resetTextColor } = useTextColor();
  const { fontSize, increase, decrease, atMin, atMax } = useFontSize();
  const { isMarkdown, toggle: toggleMarkdown } = useMarkdownMode();
  const { resolvedTheme } = useTheme();
  const displayColor =
    textColor && resolvedTheme === "light"
      ? invertLightness(textColor)
      : textColor;

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
            variant={linkCopied ? "secondary" : "default"}
            onClick={copyLink}
            className="cursor-pointer transition-[color,background-color,transform] duration-150 active:scale-[0.96]"
          >
            <Copy copied={linkCopied} />
            {linkCopied ? "copied!" : "link"}
          </Button>
          <Button
            size="sm"
            variant={textCopied ? "secondary" : "default"}
            onClick={copyText}
            className="cursor-pointer transition-[color,background-color,transform] duration-150 active:scale-[0.96]"
          >
            <Copy copied={textCopied} />
            {textCopied ? "copied!" : "text"}
          </Button>
          <ColorPicker
            color={textColor}
            onChange={setTextColor}
            onReset={resetTextColor}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={toggleMarkdown}
            title="Toggle markdown preview"
            className="tabular-nums font-mono text-xs"
          >
            {isMarkdown ? "raw" : "md"}
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-col flex-1 overflow-hidden">
        {isMarkdown ? (
          <div
            className="flex-1 overflow-auto px-4 py-3 prose prose-sm dark:prose-invert max-w-none"
            style={{
              fontSize: `${fontSize}px`,
              color: displayColor || undefined,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            className={cn(
              "flex-1 w-full resize-none bg-background text-foreground",
              "px-4 py-3 leading-relaxed outline-none font-mono",
              "placeholder:text-muted-foreground"
            )}
            style={{
              fontSize: `${fontSize}px`,
              ...(displayColor ? { color: displayColor } : {}),
            }}
            placeholder="you may begin your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
            spellCheck
          />
        )}
      </main>

      <footer className="flex flex-col gap-1 px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>
            <span className="italic hidden sm:inline">
              &apos;all good thoughts come from writing&apos;
            </span>{" "}
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
          <div className="flex items-center gap-3 tabular-nums">
            <div className="flex items-center gap-1">
              <button
                onClick={decrease}
                disabled={atMin}
                className="px-1 py-0.5 hover:underline underline-offset-2 decoration-dotted disabled:opacity-40 hover:cursor-pointer disabled:cursor-default active:scale-[0.96] transition-[transform,opacity] duration-150"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="w-9 text-center font-semibold italic">
                {fontSize}px
              </span>
              <button
                onClick={increase}
                disabled={atMax}
                className="px-1 py-0.5 hover:underline underline-offset-2 decoration-dotted disabled:opacity-40 hover:cursor-pointer disabled:cursor-default active:scale-[0.96] transition-[transform,opacity] duration-150"
                title="Increase font size"
              >
                A+
              </button>
            </div>
            <span>{" | "}</span>
            <button
              type="button"
              onClick={() => setNote("")}
              className="hover:underline underline-offset-2 decoration-dotted hover:cursor-pointer active:scale-[0.96] transition-transform duration-150"
              title="Clear note"
            >
              reset
            </button>
            <span>{" | "}</span>
            <span>{note.length.toLocaleString()} chars</span>
            {" / "}
            <span>
              {note.trim().split(/\s+/).filter(Boolean).length.toLocaleString()}{" "}
              words
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
