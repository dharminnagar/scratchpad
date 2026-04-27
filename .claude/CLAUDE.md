# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js Version Warning

This project uses **Next.js 16.2.4** with **React 19** — both may have breaking changes from training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/` to verify current APIs and conventions.

## Commands

```bash
bun dev          # dev server at localhost:3000
bun build        # production build
bun lint         # ESLint
bun format       # Prettier (write)
bun format:check # Prettier (check only)
```

Pre-commit hook runs `lint-staged`: ESLint + Prettier on staged files automatically.

## Project: URL Scratchpad

Zero-database notes app — note content lives entirely in the URL. No backend, no auth, no storage.

**Core data flow:**
1. User types → encode note to URL hash/param (base64 URL-safe encoding)
2. Page load → decode URL → hydrate editor
3. Copy/share button → share current URL

**Constraints:**
- Browser URL length limit ~2k–8k chars; warn user when approaching limit
- Not for long-form notes
- Must work fully offline after initial load

**Encoding strategy:**
- MVP: base64 URL-safe encoding
- Enhancement: `lz-string` compression for longer notes, with fallback to plain base64

## Stack

- **Framework**: Next.js 16 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 (config in `app/globals.css`, no `tailwind.config.*`)
- **Components**: shadcn/ui — style `radix-lyra`, icons `@phosphor-icons/react`
- **Fonts**: Geist Sans, Geist Mono, JetBrains Mono (loaded in `app/layout.tsx`)

## Architecture

App Router under `app/`. Components under `components/ui/` are shadcn primitives.

Path alias `@/` maps to project root. Use `@/components`, `@/lib`, `@/hooks`.

`lib/utils.ts` exports `cn` (clsx + tailwind-merge) — use for all className merging.

Add shadcn components: `bunx shadcn add <component>`.