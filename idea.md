Build an MVP called URL Scratchpad: a zero-database notes app where note content is stored entirely in the URL.

Goal
Create a dead-simple scratchpad that lets users type notes, automatically encodes note text into the URL, decodes from URL on page load, and supports instant sharing with no login and no backend.

Why this matters
- No login
- No storage
- Fully portable
- Instant sharing
- Privacy-friendly by default

Target users
- Developers
- Writers
- Quick note users
- Privacy-focused users

Tech requirements
- Pure frontend only
- Preferred stack: Next.js (App Router) with TypeScript
- No backend, no database
- Encoding options:
  - MVP: base64 URL-safe encoding
  - Optional enhancement: compression with lz-string for longer notes

Core features
- Typing UI with textarea/editor
- Auto-encode note content into URL while typing
- Decode URL content and hydrate editor on initial load
- Copy/share link button with clear success feedback
- Basic empty state and error-tolerant decoding behavior

Important constraints
- Respect browser URL length limits (roughly 2k to 8k chars depending on browser/environment)
- Warn users when approaching practical URL size limits
- This is not intended for long-form notes

UX expectations
- Fast, minimal, and intuitive
- No auth, no loading spinners for storage, no account friction
- Include clear microcopy explaining that data is in the URL

Deliverables
1. Working MVP implementation
2. Short explanation of architecture and encoding approach
3. URL-length handling strategy and user warning UX
4. Optional compression mode implementation and fallback behavior
5. Final usage instructions

Acceptance criteria
- Opening a shared URL restores the original note
- Editing note updates URL in near real-time
- Copy link action works reliably
- App works fully offline after initial load (if framework setup allows)
- No server calls for note persistence

Execution style
- Keep code simple and readable
- Avoid overengineering
- After MVP, add compression and polish copy-link UX