## Goal
Generate a single, self-contained design system document you can drop into any project (Tailwind + shadcn/ui or otherwise). It will be saved to `/mnt/documents/design-system.md` so you can download it directly, plus a ready-to-paste `index.css` and `tailwind.config.ts` snippet.

## What the document will contain

**1. Brand & Philosophy**
- Apple-like minimalism, sober tone, no gradients, soft shadows only
- Primary brand color `#0070E0`, neutral Apple-grey surfaces
- Font weight cap at 500, 14px minimum text size

**2. Color Tokens (HSL, light + dark)**
- Brand: `primary`, `primary-foreground`, `primary-soft`, `primary-hover`
- Surfaces: `background` (#F7F8FA), `card`, `popover`, `secondary`, `muted`, `accent`
- Status: `success`, `warning`, `destructive`, `info` + foregrounds
- Pastels: lavender / mint / peach / sky / rose, each with an "ink" pair for AAA-contrast text
- Form/structure: `border`, `input`, `ring`, `--radius: 0.875rem`
- Sidebar token set
- Full dark-mode override table

**3. Typography**
- Font: Poppins (300/400/500), system fallbacks
- Tailwind override: `xs` and `sm` both = 14px, `base` = 16px (enforces 14px floor)
- Weight rule: headings, `.font-medium`, `<strong>`, `<b>` capped at 500

**4. Elevation (Shadows)**
- Three-tier soft shadow system: `--shadow-xs / sm / md` (multi-layer, low-opacity)
- Utility classes: `.shadow-soft-xs / -sm / -md`
- Rule: never use Tailwind's default harsh shadows

**5. Radius Scale**
- `lg` = `var(--radius)` (14px), `md` = 12px, `sm` = 10px
- Buttons use `rounded-full` by default

**6. Motion**
- Keyframes: `accordion-down/up`, `float`, `fadeInUp`, `shimmer`, `progress-grow`
- Animations with timings and easings (e.g. `cubic-bezier(0.22, 1, 0.36, 1)`)

**7. Component Patterns (shadcn-based)**
- Button: pill-shaped (`rounded-full`), variants (default, destructive, outline, secondary, ghost, link), sizes (default/sm/lg/icon), `[&_svg]:size-4`
- Card: `rounded-lg border bg-card shadow-soft-sm`, padding `p-6`
- Dialog / Drawer / Input / Badge usage patterns

**8. Usage Rules (enforced)**
- Never hardcode color utilities (`text-white`, `bg-[#...]`) — always semantic tokens
- All colors authored in HSL inside `index.css`
- No purple/indigo gradients on white; no default Inter/Poppins-on-purple AI aesthetic
- Status colors only via tokens

**9. Drop-in files**
- Complete `index.css` (light + dark vars + base layer + utilities)
- Complete `tailwind.config.ts` (color mapping, fontSize floor, keyframes, animations)
- `components.json` snippet for shadcn projects
- Quick install steps (Tailwind, `tailwindcss-animate`, Poppins import)

## Deliverables
- `/mnt/documents/design-system.md` — full doc
- `/mnt/documents/design-system/index.css` — paste-ready
- `/mnt/documents/design-system/tailwind.config.ts` — paste-ready

Both will be surfaced as download artifacts at the end.
