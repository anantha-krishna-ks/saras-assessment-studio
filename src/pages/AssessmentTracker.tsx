import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Layers,
  Search,
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

function TrackerCard({ item }: { item: (typeof trackerItems)[number] }) {
  const completedCount = item.stages.filter((s) => s.status === "complete").length;
  const total = item.stages.length;
  const pct = Math.round((completedCount / total) * 100);

  return (
    <Card className="p-5 sm:p-6 rounded-3xl border border-border/70 bg-card shadow-soft-xs">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
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
          <h3 className="text-[16px] font-medium text-foreground tracking-tight leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Created by {item.teacher}</p>
        </div>

        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Progress
          </div>
          <div className="text-[15px] font-medium text-foreground tabular-nums">
            {completedCount}/{total} <span className="text-muted-foreground text-xs">· {pct}%</span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="mt-5">
        <Stepper stages={item.stages} />
      </div>
    </Card>
  );
}

function Stepper({ stages }: { stages: TrackerStage[] }) {
  return (
    <ol className="relative">
      {/* Desktop: horizontal */}
      <div className="hidden md:grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
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

      {/* Mobile: vertical */}
      <div className="md:hidden space-y-0">
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
      circle: "bg-emerald-500 text-white border-emerald-500",
      line: "bg-emerald-500",
      label: "text-foreground",
      sub: "text-muted-foreground",
    };
  }
  if (status === "current") {
    return {
      circle:
        "bg-primary text-primary-foreground border-primary ring-4 ring-primary/15 animate-pulse",
      line: "bg-border",
      label: "text-foreground font-medium",
      sub: "text-primary",
    };
  }
  return {
    circle: "bg-card text-muted-foreground border-border",
    line: "bg-border",
    label: "text-muted-foreground",
    sub: "text-muted-foreground/70",
  };
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
  const connectorComplete =
    stage.status === "complete" && nextStatus && nextStatus !== "pending";

  return (
    <li className="relative flex flex-col items-center text-center px-2">
      {/* Connectors */}
      {!isFirst && (
        <span
          aria-hidden
          className={cn(
            "absolute top-3.5 right-1/2 h-0.5 w-full",
            stage.status === "complete" || stage.status === "current"
              ? "bg-emerald-500"
              : "bg-border"
          )}
        />
      )}
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute top-3.5 left-1/2 h-0.5 w-full",
            connectorComplete ? "bg-emerald-500" : "bg-border"
          )}
        />
      )}

      <span
        className={cn(
          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] font-medium",
          styles.circle
        )}
      >
        {stage.status === "complete" ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <div className="mt-2.5 px-1">
        <div className={cn("text-[12px] leading-tight", styles.label)}>{stage.label}</div>
        {stage.actor && (
          <div className="text-[11px] text-foreground/80 mt-1 leading-tight">{stage.actor}</div>
        )}
        {stage.timestamp ? (
          <div className={cn("inline-flex items-center gap-1 text-[10.5px] mt-0.5", styles.sub)}>
            <Clock className="h-2.5 w-2.5" />
            {stage.timestamp}
          </div>
        ) : (
          <div className="text-[10.5px] text-muted-foreground/70 mt-0.5">Pending</div>
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
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            "absolute left-3.5 top-7 bottom-0 w-0.5",
            stage.status === "complete" ? "bg-emerald-500" : "bg-border"
          )}
        />
      )}
      <span
        className={cn(
          "relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-medium",
          styles.circle
        )}
      >
        {stage.status === "complete" ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <div className="min-w-0 pb-1">
        <div className={cn("text-[13px] leading-tight", styles.label)}>{stage.label}</div>
        {stage.actor && (
          <div className="text-[12px] text-foreground/80 mt-0.5 leading-tight">{stage.actor}</div>
        )}
        {stage.timestamp ? (
          <div className={cn("inline-flex items-center gap-1 text-[11px] mt-0.5", styles.sub)}>
            <Clock className="h-2.5 w-2.5" />
            {stage.timestamp}
          </div>
        ) : (
          <div className="text-[11px] text-muted-foreground/70 mt-0.5">Pending</div>
        )}
      </div>
    </li>
  );
}
