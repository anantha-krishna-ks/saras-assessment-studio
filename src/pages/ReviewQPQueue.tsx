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
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { reviewQueue, type ReviewStatus } from "@/data/reviewQueue";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ReviewStatus,
  { label: string; dot: string; pill: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "Submitted to teacher": {
    label: "Submitted to teacher",
    dot: "bg-sky-500",
    pill: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    icon: Send,
  },
  "Waiting for approval": {
    label: "Waiting for approval",
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Hourglass,
  },
  "Reverted for revision": {
    label: "Reverted for revision",
    dot: "bg-rose-500",
    pill: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    icon: RotateCcw,
  },
  Approved: {
    label: "Approved",
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((qp, i) => {
            const cfg = statusConfig[qp.status];
            const StatusIcon = cfg.icon;
            const canReview = qp.status !== "Approved";
            return (
              <Card
                key={qp.id}
                className="group relative p-5 rounded-2xl border border-border/70 bg-card shadow-soft-xs hover:shadow-soft-md hover:border-primary/30 transition-all duration-200"
              >
                {/* Header: index + status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-medium text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-full font-normal bg-background"
                    >
                      {qp.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full font-normal bg-background"
                    >
                      {qp.grade}
                    </Badge>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                      cfg.pill
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-[16px] text-foreground tracking-tight">
                  {qp.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">{qp.subject}</p>

                {/* Teacher */}
                <div className="mt-4 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-medium">
                    {qp.teacherInitials}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm text-foreground truncate">{qp.teacher}</div>
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <User className="h-3 w-3" /> Subject teacher
                    </div>
                  </div>
                </div>

                {/* Meta grid */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-secondary/40 p-3">
                  <Meta
                    icon={<ClipboardList className="h-3.5 w-3.5" />}
                    label="Marks"
                    value={`${qp.totalMarks}`}
                  />
                  <Meta
                    icon={<FileSearch className="h-3.5 w-3.5" />}
                    label="Questions"
                    value={`${qp.totalQuestions}`}
                  />
                  <Meta
                    icon={<Clock className="h-3.5 w-3.5" />}
                    label="Duration"
                    value={qp.duration}
                  />
                </div>

                {/* Dates */}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Submitted {qp.submittedOn}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    Due <span className="text-foreground font-medium">{qp.dueBy}</span>
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {canReview ? "Open preview to comment & decide" : "Already approved"}
                  </span>
                  <Button
                    size="sm"
                    variant={canReview ? "default" : "outline"}
                    className="rounded-xl gap-1.5"
                    onClick={() => navigate(`/review-qp/${qp.id}`)}
                  >
                    {canReview ? "Review QP" : "View QP"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Meta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm text-foreground font-medium mt-0.5">{value}</span>
    </div>
  );
}
