import { useMemo, useState } from "react";
import { Assessment } from "@/data/assessments";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const typeColor: Record<string, string> = {
  PA1: "bg-primary",
  PA2: "bg-primary",
  "Mid-term": "bg-warning",
  "Final Exam": "bg-destructive",
  "Unit Test 1": "bg-success",
  "Unit Test 2": "bg-success",
  "Unit Test 3": "bg-success",
};

interface Props {
  assessments: Assessment[];
}

export function AssessmentCalendar({ assessments }: Props) {
  const [cursor, setCursor] = useState(() => new Date());

  const { weeks, monthLabel, eventsByDay } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const eventsByDay: Record<string, { type: "scheduled" | "review"; a: Assessment }[]> = {};
    for (const a of assessments) {
      const sched = new Date(a.scheduledAt);
      const due = new Date(a.dueAt);
      const sk = sched.toDateString();
      const dk = due.toDateString();
      (eventsByDay[sk] ||= []).push({ type: "scheduled", a });
      (eventsByDay[dk] ||= []).push({ type: "review", a });
    }

    const monthLabel = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return { weeks, monthLabel, eventsByDay };
  }, [cursor, assessments]);

  const today = new Date();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] text-foreground">Assessment Calendar</h2>
          <p className="text-[12px] text-muted-foreground">Scheduled assessments & QP review deadlines</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-[13px] text-foreground min-w-[130px] text-center">{monthLabel}</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px text-center mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-[10px] uppercase tracking-wide text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 flex-1">
        {weeks.flat().map((day, i) => {
          if (!day) return <div key={i} className="rounded-lg bg-secondary/40 min-h-[64px]" />;
          const events = eventsByDay[day.toDateString()] || [];
          const isToday = day.toDateString() === today.toDateString();
          return (
            <div
              key={i}
              className={cn(
                "rounded-lg border p-1.5 min-h-[64px] flex flex-col gap-1 transition-colors",
                isToday ? "border-primary bg-primary-soft/40" : "border-border bg-card hover:bg-secondary/50"
              )}
            >
              <div
                className={cn(
                  "text-[11px] self-end",
                  isToday ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {day.getDate()}
              </div>
              <div className="flex flex-col gap-0.5">
                {events.slice(0, 2).map((e, idx) => (
                  <div
                    key={idx}
                    title={`${e.a.title} — ${e.type === "review" ? "Review QP due" : "Scheduled"}`}
                    className={cn(
                      "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate",
                      e.type === "review"
                        ? "bg-warning/10 text-warning"
                        : "bg-primary-soft text-primary"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", typeColor[e.a.type] || "bg-primary")} />
                    <span className="truncate">{e.a.type}</span>
                  </div>
                ))}
                {events.length > 2 && (
                  <span className="text-[10px] text-muted-foreground px-1.5">+{events.length - 2}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
        <Legend dot="bg-primary" label="Scheduled" />
        <Legend dot="bg-warning" label="Review QP due" />
        <Legend dot="bg-success" label="Unit Test" />
        <Legend dot="bg-destructive" label="Final Exam" />
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
