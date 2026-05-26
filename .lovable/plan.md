In `src/pages/Dashboard.tsx` (HOD action group, ~lines 138–165):

- Remove the "Create Assessment" button entirely.
- Remove the existing outline-styled "Review QP" button.
- In its place, render a single primary "Review QP" button (default `Button` variant, same `h-10 px-5` sizing, keeping the `FileSearch` icon) that navigates to `/review-qp`.
- Drop the now-unneeded vertical divider span between the two buttons.
- HM branch (Assessment Tracker) stays unchanged.