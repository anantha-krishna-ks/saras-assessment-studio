import { useMemo, useState } from "react";
import { Assessment } from "@/data/assessments";
import { ChevronLeft, ChevronRight, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  assessments: Assessment[];
}

type EventKind = "scheduled" | "review";

const kindStyles: Record<
  EventKind,
  { highlight: string; ring: string; legendDot: string }
> = {
  scheduled: {
    highlight:
      "bg-[hsl(var(--pastel-sky))] text-[hsl(var(--pastel-sky-ink))]",
    ring: "ring-[hsl(var(--pastel-sky-ink))]/30",
    legendDot: "bg-[hsl(var(--pastel-sky-ink))]",
  },
  review: {
    highlight:
      "bg-[hsl(var(--pastel-peach))] text-[hsl(var(--pastel-peach-ink))]",
    ring: "ring-[hsl(var(--pastel-peach-ink))]/30",
    legendDot: "bg-[hsl(var(--pastel-peach-ink))]",
  },
};

export function AssessmentCalendar({ assessments }: Props) {
  const [cursor, setCursor] = useState(() => new Date());

  const { weeks, monthLabel, eventsByDay, totalEvents } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const eventsByDay: Record<string, { type: EventKind; a: Assessment }[]> = {};
    for (const a of assessments) {
      const sched = new Date(a.scheduledAt);
      const due = new Date(a.dueAt);
      (eventsByDay[sched.toDateString()] ||= []).push({ type: "scheduled", a });
      (eventsByDay[due.toDateString()] ||= []).push({ type: "review", a });
    }

    const monthLabel = first.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    let totalEvents = 0;
    for (const k of Object.keys(eventsByDay)) {
      const d = new Date(k);
      if (d.getMonth() === month && d.getFullYear() === year) {
        totalEvents += eventsByDay[k].length;
      }
    }

    return { weeks, monthLabel, eventsByDay, totalEvents };
  }, [cursor, assessments]);

  const today = new Date();

  return (
    <div
      className="h-full flex flex-col"
      role="region"
      aria-label="Assessment calendar"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
            <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[15px] font-medium tracking-tight text-foreground">
              Assessment Calendar
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalEvents} event{totalEvents === 1 ? "" : "s"} this month
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-secondary/60 p-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            className="h-7 w-7 rounded-full hover:bg-card"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div
            className="text-sm font-medium text-foreground min-w-[120px] text-center px-2"
            aria-live="polite"
          >
            {monthLabel}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next month"
            className="h-7 w-7 rounded-full hover:bg-card"
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday header */}
      <div
        className="grid grid-cols-7 mb-2"
        role="row"
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            role="columnheader"
            className="text-sm text-muted-foreground text-center py-1.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid — minimal, like reference */}
      <div className="grid grid-cols-7 gap-y-2 flex-1">
        {weeks.flat().map((day, i) => {
          if (!day) return <div key={i} aria-hidden="true" />;

          // Reorder Sun-first source to Mon-first display: shift Sun to end visually
          const events = eventsByDay[day.toDateString()] || [];
          const isToday = day.toDateString() === today.toDateString();
          const primaryKind: EventKind | null =
            events.find((e) => e.type === "review")?.type ??
            events[0]?.type ??
            null;

          const tooltip = events
            .map(
              (e) =>
                `${e.a.title} — ${
                  e.type === "review" ? "Review QP due" : "Scheduled"
                }`
            )
            .join("\n");

          return (
            <div
              key={i}
              role="gridcell"
              className="flex items-center justify-center"
            >
              <div
                title={tooltip || undefined}
                aria-label={
                  events.length
                    ? `${day.toDateString()} — ${events.length} event${
                        events.length === 1 ? "" : "s"
                      }`
                    : day.toDateString()
                }
                className={cn(
                  "relative h-10 w-10 flex items-center justify-center rounded-full text-sm transition-all",
                  // base hover
                  !isToday && !primaryKind && "text-foreground hover:bg-secondary",
                  // event highlight
                  primaryKind && !isToday && [
                    kindStyles[primaryKind].highlight,
                    "font-medium ring-1",
                    kindStyles[primaryKind].ring,
                  ],
                  // today
                  isToday && "bg-primary text-primary-foreground font-medium shadow-soft-sm",
                )}
              >
                {day.getDate()}
                {/* multi-event indicator */}
                {events.length > 1 && !isToday && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5"
                  >
                    {Array.from({ length: Math.min(events.length, 3) }).map(
                      (_, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "h-1 w-1 rounded-full",
                            kindStyles[
                              events[idx]?.type ?? "scheduled"
                            ].legendDot
                          )}
                        />
                      )
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-border/70">
        <Legend
          swatch="bg-[hsl(var(--pastel-sky))] ring-[hsl(var(--pastel-sky-ink))]/30"
          label="Scheduled"
        />
        <Legend
          swatch="bg-[hsl(var(--pastel-peach))] ring-[hsl(var(--pastel-peach-ink))]/30"
          label="Review QP due"
        />
        <Legend swatch="bg-primary" label="Today" solid />
      </div>
    </div>
  );
}

function Legend({
  swatch,
  label,
  solid,
}: {
  swatch: string;
  label: string;
  solid?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn(
          "h-3.5 w-3.5 rounded-full",
          solid ? swatch : `${swatch} ring-1`
        )}
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
