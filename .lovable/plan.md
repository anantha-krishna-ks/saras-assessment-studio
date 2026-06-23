# Master Design Prompt Artifact

Goal: produce a single, portable "master design prompt" you can paste into any AI/coding agent (Lovable, Cursor, ChatGPT, Claude, etc.) and have it reproduce this application's exact visual language — Apple-like minimalism, `#0070E0` brand blue, Poppins, soft elevation, pastel accents, 14px text floor — across any new app.

## Deliverable

One file: `/mnt/documents/master-design-prompt.md`

Written as a directive prompt (second-person "You will…"), not a reference doc. Self-contained — no links to read, no external assumptions. Copy-paste and go.

## Sections inside the prompt

1. **Role & Mission** — frame the agent as a senior product designer building in this exact system.
2. **Design Philosophy** — Apple-like restraint, sober pastel accents, no AI-generic aesthetics (no purple/indigo gradients on white, no Inter default, no neon).
3. **Hard Constraints (non-negotiable)** — never hardcode colors, never exceed font-weight 500, never use default Tailwind shadows, never go below 14px, never use serif, never use gradients on surfaces.
4. **Color System** — complete HSL token table (brand, surfaces, status, 5 pastel pairs with ink), light + dark mode values, usage rules per token, do/don't pairings.
5. **Typography** — Poppins 300/400/500, 14px floor, 16px body, heading scale, weight cap, letter-spacing, line-height.
6. **Spacing & Layout** — 4px base unit, container width, section rhythm, card padding standards.
7. **Radius** — 14px base / 12 / 10, `rounded-full` for buttons & pills, never sharp corners on interactive elements.
8. **Elevation** — three-tier soft shadow tokens, when to use each tier, never `shadow-lg`/`shadow-xl`.
9. **Motion** — keyframes (`float`, `fadeInUp`, `shimmer`, `progress-grow`, accordion), easing curves, durations, when to animate vs. when not to.
10. **Component Patterns** — buttons (pill, variants), cards (`rounded-lg border bg-card shadow-soft-sm`), inputs, badges/status chips with pastel pairs, dialogs/modals, empty states, tabs, tables, toasts.
11. **Iconography** — lucide-react only, stroke 1.5–2, size scale.
12. **Imagery** — flat illustration or none, no stock-photo gradients.
13. **Accessibility** — AAA contrast for ink-on-pastel pairs, focus rings using `--ring`, keyboard-first.
14. **Dark Mode** — full override table, parity rules.
15. **Edge Cases** — long text truncation, empty/loading/error/skeleton states, disabled, hover/active/focus, RTL, dense vs. comfortable density, mobile breakpoints, very large numbers, very long names, zero-data charts, network failure UI, permission-denied UI, first-run/onboarding, success confirmations, destructive confirmations.
16. **Drop-in Files** — full `index.css` and `tailwind.config.ts` embedded inline in fenced blocks so the agent can write them verbatim.
17. **Acceptance Checklist** — 15-item checklist the agent must self-verify before shipping any screen.

## Format notes

- Single markdown file, ~600–900 lines.
- Every rule phrased as an imperative ("Use…", "Never…").
- Code blocks for tokens + config so paste-in is one step.
- No project-specific references (no "Saras", no "Teacher LMS") — fully generic so it works on any future app.

After you approve, I'll write the file and surface it as a downloadable artifact.
