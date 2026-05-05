import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileEdit,
  GraduationCap,
  Layers,
  Loader2,
  Printer,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackerItems, type TrackerStage } from "@/data/trackerData";
import { cn } from "@/lib/utils";

export default function AssessmentTracker() {
  const navigate = useNavigate();
  const [grade, setGrade] = useState("All");
  const [subject, setSubject] = useState("All");
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");

  const grades = useMemo(
    () => Array.from(new Set(trackerItems.map((t) => t.grade))).sort(),
    []
  );
  const subjects = useMemo(
    () => Array.from(new Set(trackerItems.map((t) => t.subject))).sort(),
    []
  );
  const types = useMemo(
    () => Array.from(new Set(trackerItems.map((t) => t.type))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return trackerItems.filter((t) => {
      const okGrade = grade === "All" || t.grade === grade;
      const okSubject = subject === "All" || t.subject === subject;
      const okType = type === "All" || t.type === type;
      const okQuery =
        !query.trim() ||
        [t.title, t.teacher, t.subject, t.grade, t.type]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      return okGrade && okSubject && okType && okQuery;
    });
  }, [grade, subject, type, query]);

  const clearAll = () => {
    setGrade("All");
    setSubject("All");
    setType("All");
    setQuery("");
  };

  const hasFilters =
    grade !== "All" || subject !== "All" || type !== "All" || query.trim().length > 0;

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
              <ClipboardCheck className="h-4.5 w-4.5" />
            </span>
            <h1 className="text-[26px] leading-tight text-foreground tracking-tight">
              Assessment Tracker
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Live status of every question paper across the review pipeline.
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

      {/* Filters */}
      <Card className="p-4 rounded-3xl border border-border/70 bg-card shadow-soft-xs">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground pr-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-medium text-foreground">Filters</span>
          </div>

          <FilterField label="Class">
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="h-9 w-[150px] sm:w-[170px] text-sm">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All classes</SelectItem>
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Subject">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="h-9 w-[160px] sm:w-[180px] text-sm">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="inline-flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                      {s}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Type of Assessment">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 w-[160px] sm:w-[180px] text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    <span className="inline-flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      {t}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={clearAll}>
              Clear filters
            </Button>
          )}

          <span className="ml-auto text-xs text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filtered.length}</span> of{" "}
            {trackerItems.length}
          </span>
        </div>
      </Card>

      {/* Tracker list */}
      {filtered.length === 0 ? (
        <Card className="p-10 rounded-3xl border border-dashed border-border text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
            <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-[15px] text-foreground">No assessments match your filters</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting the class, subject, or type filters.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <TrackerCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      {children}
    </div>
  );
}


const stageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  created: FileEdit,
  subCoordinatorReview: Users,
  subTeacherRework: FileEdit,
  subCoordinatorApproved: UserCheck,
  hmApproved: ShieldCheck,
  printing: Printer,
};

function TrackerCard({ item }: { item: (typeof trackerItems)[number] }) {
  const completedCount = item.stages.filter((s) => s.status === "complete").length;
  const total = item.stages.length;
  const pct = Math.round((completedCount / total) * 100);
  const currentStage = item.stages.find((s) => s.status === "current");
  const isComplete = completedCount === total;

  const statusBadge = isComplete
    ? {
        label: "Completed",
        cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        Icon: CheckCircle2,
      }
    : currentStage
      ? {
          label: currentStage.label,
          cls: "bg-primary/10 text-primary border-primary/20",
          Icon: Loader2,
        }
      : {
          label: "Not started",
          cls: "bg-secondary text-muted-foreground border-border",
          Icon: Clock,
        };

  const initials = item.teacher
    .replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft-xs hover:shadow-soft-md transition-shadow">
      {/* Top accent strip */}
      <div
        className={cn(
          "h-1 w-full",
          isComplete ? "bg-emerald-500" : currentStage ? "bg-primary" : "bg-border"
        )}
      />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <span className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary text-[13px] font-semibold ring-2 ring-card">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10.5px] font-medium text-foreground/70 tracking-wide">
                  {item.grade.toUpperCase()}
                </span>
                <span className="inline-flex items-center rounded-md border border-border/70 px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground tracking-wide">
                  {item.type}
                </span>
                <span className="inline-flex items-center rounded-md border border-border/70 px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground tracking-wide">
                  {item.subject}
                </span>
              </div>
              <h3 className="text-[16px] sm:text-[17px] font-medium text-foreground tracking-tight leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Created by <span className="text-foreground/80">{item.teacher}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-2 sm:shrink-0">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap",
                statusBadge.cls
              )}
            >
              <statusBadge.Icon
                className={cn(
                  "h-3 w-3",
                  !isComplete && currentStage && "animate-spin"
                )}
              />
              <span className="max-w-[180px] truncate">{statusBadge.label}</span>
            </span>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Progress
              </div>
              <div className="text-[14px] font-medium text-foreground tabular-nums">
                {completedCount}/{total}
                <span className="text-muted-foreground text-xs ml-1">· {pct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isComplete ? "bg-emerald-500" : "bg-primary"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Stepper */}
        <div className="mt-6">
          <Stepper stages={item.stages} />
        </div>
      </div>
    </Card>
  );
}

function Stepper({ stages }: { stages: TrackerStage[] }) {
  return (
    <ol className="relative">
      {/* Desktop / tablet: horizontal */}
      <div
        className="hidden lg:grid gap-1"
        style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
      >
        {stages.map((s, idx) => (
          <StepNodeHorizontal
            key={s.key}
            stage={s}
            isFirst={idx === 0}
            isLast={idx === stages.length - 1}
            nextStatus={stages[idx + 1]?.status}
          />
        ))}
      </div>

      {/* Mobile / tablet: vertical timeline */}
      <div className="lg:hidden">
        {stages.map((s, idx) => (
          <StepNodeVertical
            key={s.key}
            stage={s}
            isLast={idx === stages.length - 1}
          />
        ))}
      </div>
    </ol>
  );
}

function statusStyles(status: TrackerStage["status"]) {
  if (status === "complete") {
    return {
      circle: "bg-emerald-500 text-white border-emerald-500 shadow-sm",
      label: "text-foreground",
      sub: "text-muted-foreground",
    };
  }
  if (status === "current") {
    return {
      circle:
        "bg-primary text-primary-foreground border-primary ring-4 ring-primary/15 shadow-sm",
      label: "text-foreground font-medium",
      sub: "text-primary",
    };
  }
  return {
    circle: "bg-card text-muted-foreground border-border border-dashed",
    label: "text-muted-foreground",
    sub: "text-muted-foreground/70",
  };
}

function StepIcon({ stage }: { stage: TrackerStage }) {
  if (stage.status === "complete") return <Check className="h-3.5 w-3.5" strokeWidth={3} />;
  const Icon = stageIcons[stage.key] ?? Clock;
  return <Icon className="h-3.5 w-3.5" />;
}

function StepNodeHorizontal({
  stage,
  isFirst,
  isLast,
  nextStatus,
}: {
  stage: TrackerStage;
  isFirst: boolean;
  isLast: boolean;
  nextStatus?: TrackerStage["status"];
}) {
  const styles = statusStyles(stage.status);
  const leftDone = stage.status === "complete" || stage.status === "current";
  const rightDone = stage.status === "complete" && nextStatus && nextStatus !== "pending";

  return (
    <li className="relative flex flex-col items-center text-center px-1.5">
      {/* Connector lines */}
      {!isFirst && (
        <span
          aria-hidden
          className={cn(
            "absolute top-4 right-1/2 h-0.5 w-full",
            leftDone ? "bg-emerald-500" : "bg-border"
          )}
        />
      )}
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute top-4 left-1/2 h-0.5 w-full",
            rightDone ? "bg-emerald-500" : "bg-border"
          )}
        />
      )}

      <span
        className={cn(
          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
          styles.circle
        )}
      >
        <StepIcon stage={stage} />
      </span>
      <div className="mt-3 w-full px-0.5">
        <div className={cn("text-[11.5px] leading-snug line-clamp-2", styles.label)}>
          {stage.label}
        </div>
        {stage.actor && (
          <div className="text-[11px] text-foreground/80 mt-1.5 leading-tight truncate">
            {stage.actor}
          </div>
        )}
        {stage.timestamp ? (
          <div
            className={cn(
              "inline-flex items-center gap-1 text-[10.5px] mt-1 leading-tight",
              styles.sub
            )}
          >
            <Clock className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{stage.timestamp}</span>
          </div>
        ) : (
          <div className="text-[10.5px] text-muted-foreground/70 mt-1">Pending</div>
        )}
      </div>
    </li>
  );
}

function StepNodeVertical({
  stage,
  isLast,
}: {
  stage: TrackerStage;
  isLast: boolean;
}) {
  const styles = statusStyles(stage.status);
  return (
    <li className="relative flex gap-3.5 pb-5 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute left-4 top-8 bottom-0 w-0.5",
            stage.status === "complete" ? "bg-emerald-500" : "bg-border"
          )}
        />
      )}
      <span
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          styles.circle
        )}
      >
        <StepIcon stage={stage} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className={cn("text-[13px] leading-snug", styles.label)}>{stage.label}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          {stage.actor && (
            <div className="text-[12px] text-foreground/80 leading-tight">{stage.actor}</div>
          )}
          {stage.timestamp ? (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-[11px] leading-tight",
                styles.sub
              )}
            >
              <Clock className="h-2.5 w-2.5" />
              {stage.timestamp}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/70">Pending</div>
          )}
        </div>
      </div>
    </li>
  );
}

