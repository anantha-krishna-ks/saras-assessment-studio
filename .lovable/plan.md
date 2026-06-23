Update the master design prompt at `/mnt/documents/master-design-prompt.md` so it contains the exact prompt / component pattern required to reproduce the pastel-stat progress bar shown in the screenshot.

### What will change
- In **§18.1 Pastel Stat Card**, replace the simplified progress-bar snippet with the full implementation spec taken from `src/pages/Dashboard.tsx` (lines 544–592).
- The spec will include:
  - Track: `relative h-2.5 flex-1 rounded-full overflow-hidden bg-white/60 ring-1 ring-inset ring-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]` with `role="progressbar"` and `aria-*` attributes.
  - Fill: tone's ink color (`bg-[hsl(var(--pastel-<tone>-ink))]`), `rounded-full`, inline shadow `shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_2px_8px_-1px_currentColor]`.
  - Glossy top highlight: absolute top-half span with `bg-white/35 rounded-t-full`.
  - Glow tip: absolute right circle `h-3 w-3 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)]` centered vertically.
  - Animation: `animate-progress-grow` keyed off a CSS variable `--progress-target`.
  - Percentage label: `text-sm font-medium tabular-nums min-w-[3ch] text-right` in the same ink color.
- Add a short standalone **"Prompt to generate this progress bar"** paragraph directly after the code block so the user can copy-paste just that paragraph into any AI agent.
- Ensure the tone map shown in the file reflects the `bar` token used by the real component.

### What will NOT change
- No project source code will be edited.
- No other sections of the design prompt will be removed or reordered.
- No new dependencies, builds, or deployments.

### Acceptance
- The updated markdown file reads cleanly and the new progress-bar code block is syntactically valid.
- The standalone prompt paragraph accurately describes every visual detail visible in the screenshot (rounded track, ink fill, glossy highlight, white glow tip, animated fill, percentage label).