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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
            <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[17px] font-medium tracking-tight text-foreground leading-tight">
              Assessment Calendar
            </h2>
            <p className="text-[13.5px] text-muted-foreground leading-tight">
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
            className="text-[15px] font-medium text-foreground min-w-[140px] text-center px-2"
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
      <div className="grid grid-cols-7 mb-2" role="row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            role="columnheader"
            className="text-[13px] uppercase tracking-wide text-muted-foreground text-center py-1.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid — compact, label only when there's an event */}
      <div className="grid grid-cols-7 gap-y-2.5 flex-1">
        {weeks.flat().map((day, i) => {
          if (!day) return <div key={i} aria-hidden="true" />;

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

          const labelText = (() => {
            if (!events.length) return null;
            const review = events.find((e) => e.type === "review");
            const sched = events.find((e) => e.type === "scheduled");
            const lead = review ?? sched!;
            const more = events.length - 1;
            const base = lead.a.type;
            return more > 0 ? `${base} +${more}` : base;
          })();

          const labelTone =
            primaryKind === "review"
              ? "text-[hsl(var(--pastel-peach-ink))]"
              : "text-[hsl(var(--pastel-sky-ink))]";

          return (
            <div
              key={i}
              role="gridcell"
              className="flex flex-col items-center gap-0.5"
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
                  "relative h-11 w-11 flex items-center justify-center rounded-full text-[15px] transition-all",
                  !isToday && !primaryKind && "text-foreground hover:bg-secondary",
                  primaryKind && !isToday && [
                    kindStyles[primaryKind].highlight,
                    "font-medium ring-1",
                    kindStyles[primaryKind].ring,
                  ],
                  isToday &&
                    "bg-primary text-primary-foreground font-medium shadow-soft-sm",
                )}
              >
                {day.getDate()}
              </div>

              {labelText && (
                <span
                  className={cn(
                    "text-[11.5px] leading-tight font-medium px-1 max-w-[64px] truncate text-center",
                    isToday ? "text-primary" : labelTone
                  )}
                  title={labelText}
                >
                  {labelText}
                </span>
              )}
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
