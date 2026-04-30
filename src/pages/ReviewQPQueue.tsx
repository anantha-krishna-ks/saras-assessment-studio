import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileSearch,
  Hourglass,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reviewQueue, type ReviewStatus } from "@/data/reviewQueue";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ReviewStatus,
  {
    label: string;
    dot: string;
    pill: string;
    accent: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  "Submitted to teacher": {
    label: "Submitted to teacher",
    dot: "bg-sky-500",
    pill: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    accent: "before:bg-sky-500",
    icon: Send,
  },
  "Waiting for approval": {
    label: "Waiting for approval",
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    accent: "before:bg-amber-500",
    icon: Hourglass,
  },
  "Reverted for revision": {
    label: "Reverted for revision",
    dot: "bg-rose-500",
    pill: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    accent: "before:bg-rose-500",
    icon: RotateCcw,
  },
  Approved: {
    label: "Approved",
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    accent: "before:bg-emerald-500",
    icon: CheckCircle2,
  },
};

const filters: ("All" | ReviewStatus)[] = [
  "All",
  "Waiting for approval",
  "Submitted to teacher",
  "Reverted for revision",
  "Approved",
];

export default function ReviewQPQueue() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<"All" | ReviewStatus>("All");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<"All" | ReviewStatus, number> = {
      All: reviewQueue.length,
      "Submitted to teacher": 0,
      "Waiting for approval": 0,
      "Reverted for revision": 0,
      Approved: 0,
    };
    reviewQueue.forEach((q) => (c[q.status] += 1));
    return c;
  }, []);

  const filtered = useMemo(() => {
    return reviewQueue.filter((q) => {
      const matchesStatus = statusFilter === "All" || q.status === statusFilter;
      const matchesQuery =
        !query.trim() ||
        [q.title, q.teacher, q.subject, q.grade]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [statusFilter, query]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to dashboard
        </Button>
      </div>

      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <FileSearch className="h-4.5 w-4.5" />
            </span>
            <h1 className="text-[26px] leading-tight text-foreground tracking-tight">
              Review Question Papers
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Question papers submitted by teachers for your review and approval.
          </p>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, teacher, subject…"
            className="h-10 w-[280px] pl-9 rounded-xl bg-card"
          />
        </div>
      </div>

      {/* Status filter pills */}
      <div
        role="tablist"
        aria-label="Filter by status"
        className="flex flex-wrap items-center gap-2"
      >
        {filters.map((opt) => {
          const active = statusFilter === opt;
          const cfg = opt === "All" ? null : statusConfig[opt];
          return (
            <button
              key={opt}
              role="tab"
              aria-selected={active}
              onClick={() => setStatusFilter(opt)}
              className={cn(
                "inline-flex items-center gap-2 h-9 px-3.5 rounded-full text-sm transition-all ring-1",
                active
                  ? "bg-primary text-primary-foreground ring-primary shadow-soft-xs"
                  : "bg-card text-foreground ring-border/70 hover:ring-primary/40 hover:bg-primary-soft/40"
              )}
            >
              {cfg && (
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    active ? "bg-primary-foreground" : cfg.dot
                  )}
                />
              )}
              <span className="font-medium">{opt}</span>
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-medium tabular-nums",
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {counts[opt]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <Card className="p-10 rounded-3xl border border-dashed border-border text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
            <FileSearch className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-[15px] text-foreground">No question papers found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different status or clear your search.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3.5">
          {filtered.map((qp) => {
            const cfg = statusConfig[qp.status];
            const StatusIcon = cfg.icon;
            const canReview = qp.status !== "Approved";
            return (
              <Card
                key={qp.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/review-qp/${qp.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/review-qp/${qp.id}`);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft-xs flex flex-col",
                  "hover:shadow-soft-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                )}
              >
                {/* Top accent line */}
                <div className={cn("h-1 w-full", cfg.dot)} />

                {/* Header: grade/type + status */}
                <div className="px-4 pt-3.5 pb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10.5px] font-medium text-foreground/70 tracking-wide">
                      {qp.grade.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center rounded-md border border-border/70 px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground tracking-wide">
                      {qp.type}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap",
                      cfg.pill
                    )}
                  >
                    <StatusIcon className="h-2.5 w-2.5" />
                    {cfg.label}
                  </span>
                </div>

                {/* Body: title, subject, teacher */}
                <div className="px-4 pb-3.5 flex-1">
                  <h3 className="text-[15px] font-medium text-foreground tracking-tight leading-snug line-clamp-1">
                    {qp.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {qp.subject}
                  </p>

                  <div className="mt-3 flex items-center gap-2 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary text-[11px] font-medium ring-2 ring-card">
                      {qp.teacherInitials}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12.5px] text-foreground truncate leading-tight">
                        {qp.teacher}
                      </div>
                      <div className="text-[10.5px] text-muted-foreground leading-tight mt-0.5">
                        Submitted {qp.submittedOn}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat strip */}
                <div className="grid grid-cols-3 divide-x divide-border/60 border-t border-border/60 bg-secondary/30">
                  <Stat
                    icon={<FileSearch className="h-3 w-3" />}
                    label="Questions"
                    value={qp.totalQuestions}
                  />
                  <Stat
                    icon={<ClipboardList className="h-3 w-3" />}
                    label="Marks"
                    value={qp.totalMarks}
                  />
                  <Stat
                    icon={<Clock className="h-3 w-3" />}
                    label="Duration"
                    value={qp.duration}
                  />
                </div>

                {/* Footer action */}
                <div className="px-4 py-2.5 border-t border-border/60 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    Due <span className="text-foreground font-medium ml-0.5">{qp.dueBy}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-primary">
                    {canReview ? "Review" : "View"}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-2.5 px-2">
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="mt-0.5 text-[13.5px] font-medium text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}
