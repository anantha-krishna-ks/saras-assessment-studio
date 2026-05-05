import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext";
import type { AssessmentStatus } from "@/data/assessments";
import { assessments as allAssessments } from "@/data/assessments";
import { AssessmentCard } from "@/components/dashboard/AssessmentCard";
import { AssessmentCalendar } from "@/components/dashboard/AssessmentCalendar";
import { InboxPanel } from "@/components/dashboard/InboxPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardCheck,
  FilePlus2,
  FileSearch,
  GraduationCap,
  Inbox,
  Plus,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { role, user } = useRole();
  const navigate = useNavigate();
  const isTeacher = role === "Teacher";
  const isHM = role === "HM";

  const [statusFilter, setStatusFilter] = useState<AssessmentStatus | "All">("All");
  const [gradeFilter, setGradeFilter] = useState<string>("All");
  const [subjectFilter, setSubjectFilter] = useState<string>("All");

  const grades = useMemo(
    () => Array.from(new Set(allAssessments.map((a) => a.grade))).sort(),
    []
  );
  const subjects = useMemo(
    () => Array.from(new Set(allAssessments.map((a) => a.subject))).sort(),
    []
  );

  // Scope assessments by grade/subject (only applied for Teacher view)
  const scopedAssessments = useMemo(() => {
    if (!isTeacher) return allAssessments;
    return allAssessments.filter(
      (a) =>
        (gradeFilter === "All" || a.grade === gradeFilter) &&
        (subjectFilter === "All" || a.subject === subjectFilter)
    );
  }, [isTeacher, gradeFilter, subjectFilter]);

  const assessments = scopedAssessments;

  const drafts = assessments.filter((a) => a.status === "Draft").length;
  const review = assessments.filter((a) => a.status === "Not yet received").length;
  const completed = assessments.filter((a) => a.status === "Accepted").length;
  const total = assessments.length;
  const completionPct = Math.round((completed / Math.max(total, 1)) * 100);

  const reverted = assessments.filter((a) => a.status === "Reverted").length;

  type FilterKey = AssessmentStatus | "All";

  const submittedToHM = assessments.filter((a) => a.status === "Submitted to HM").length;

  const statusCounts: Record<FilterKey, number> = useMemo(
    () => ({
      All: assessments.length,
      "Not yet started": assessments.filter((a) => a.status === "Not yet started").length,
      Draft: drafts,
      "Not yet received": review,
      Reverted: reverted,
      Accepted: completed,
      "Submitted to HM": submittedToHM,
    }),
    [assessments, drafts, review, completed, reverted, submittedToHM]
  );

  const filteredAssessments = useMemo(
    () =>
      statusFilter === "All"
        ? assessments
        : assessments.filter((a) => a.status === statusFilter),
    [assessments, statusFilter]
  );

  const isHOD = role === "HOD";

  const filterOptions: FilterKey[] = isHOD
    ? ["All", "Not yet received", "Draft", "Submitted to HM", "Reverted", "Accepted"]
    : ["All", "Not yet started", "Draft", "Not yet received", "Reverted", "Accepted"];

  const hodLabelMap: Partial<Record<FilterKey, string>> = {
    "Not yet received": "Submitted to teacher",
    Draft: "Waiting for approval",
    Reverted: "Reverted for revision",
  };

  const getFilterLabel = (opt: FilterKey) =>
    isHOD ? hodLabelMap[opt] ?? opt : opt;

  const inboxFilter = useMemo(
    () =>
      isTeacher
        ? (a: (typeof allAssessments)[number]) =>
            (gradeFilter === "All" || a.grade === gradeFilter) &&
            (subjectFilter === "All" || a.subject === subjectFilter)
        : undefined,
    [isTeacher, gradeFilter, subjectFilter]
  );

  const greeting = "Hello";

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight text-foreground tracking-tight">
            {greeting}, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Here's what needs your attention today.
          </p>
        </div>
        {!isTeacher && (
          <div className="inline-flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-card hover:bg-secondary/60 border-border h-10 px-5"
              onClick={() => navigate("/review-qp")}
            >
              <FileSearch className="h-4 w-4 mr-2" />
              Review QP
            </Button>
            {!isHM && (
              <>
                <span aria-hidden="true" className="h-7 w-px bg-border/80" />
                <Button className="h-10 px-5" onClick={() => navigate("/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Teacher scope filters */}
      {isTeacher && (
        <Card className="p-4 rounded-3xl border border-border/70 bg-card shadow-soft-xs">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Filters group */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground pr-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <span className="font-medium text-foreground">Scope</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-muted-foreground shrink-0">Class</span>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="h-9 w-[140px] sm:w-[160px] text-sm">
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
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-muted-foreground shrink-0">Subject</span>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="h-9 w-[150px] sm:w-[180px] text-sm">
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
              </div>
              {(gradeFilter !== "All" || subjectFilter !== "All") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => {
                    setGradeFilter("All");
                    setSubjectFilter("All");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Actions group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 justify-center"
                onClick={() => navigate("/question-repository")}
              >
                <BookOpen className="h-4 w-4" />
                Question Repository
              </Button>
              <span
                aria-hidden="true"
                className="hidden sm:block h-6 w-px bg-border/80"
              />
              <Button
                size="sm"
                className="h-9 gap-1.5 justify-center"
                onClick={() => navigate("/create-v2")}
              >
                <FilePlus2 className="h-4 w-4" />
                Create Question Paper
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isHM && (
        <div>
          <h2 className="text-[18px] text-foreground tracking-tight">Assessment Pipeline</h2>
          <p className="text-sm text-muted-foreground">Snapshot of where every paper stands</p>
        </div>
      )}

      {/* Hero pastel stat tiles */}
      {isTeacher ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PastelStat
            tone="mint"
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="Assessments Submitted"
            value={completed + review}
            caption={`${completed} accepted • ${review} in review`}
            progress={((completed + review) / Math.max(total, 1)) * 100}
          />
          <PastelStat
            tone="peach"
            icon={<FilePlus2 className="h-3.5 w-3.5" />}
            label="Assessments Rework"
            value={drafts + reverted}
            caption={`${reverted} reverted • ${drafts} drafts`}
            progress={((drafts + reverted) / Math.max(total, 1)) * 100}
          />
          <PastelStat
            tone="lavender"
            icon={<ClipboardCheck className="h-3.5 w-3.5" />}
            label="Assessments Yet to Create"
            value={assessments.filter((a) => a.status === "Not yet started").length}
            caption="not yet started"
            progress={
              (assessments.filter((a) => a.status === "Not yet started").length /
                Math.max(total, 1)) *
              100
            }
          />
        </div>
      ) : isHOD ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PastelStat
            tone="sky"
            icon={<FileSearch className="h-3.5 w-3.5" />}
            label="Submitted to teacher"
            value={review}
            caption="awaiting teacher action"
            progress={(review / Math.max(total, 1)) * 100}
          />
          <PastelStat
            tone="lavender"
            icon={<ClipboardCheck className="h-3.5 w-3.5" />}
            label="Waiting for approval"
            value={drafts}
            caption="pending your review"
            progress={(drafts / Math.max(total, 1)) * 100}
          />
          <PastelStat
            tone="peach"
            icon={<FilePlus2 className="h-3.5 w-3.5" />}
            label="Reverted for revision"
            value={reverted}
            caption="sent back to teacher"
            progress={(reverted / Math.max(total, 1)) * 100}
          />
          <PastelStat
            tone="mint"
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="Accepted"
            value={completed}
            caption={`${completionPct}% completion rate`}
            progress={completionPct}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PastelStat
            tone="lavender"
            icon={<ClipboardCheck className="h-3.5 w-3.5" />}
            label="Total Assessments"
            value={total}
            caption="across all subjects"
            progress={100}
          />
          <PastelStat
            tone="peach"
            icon={<FilePlus2 className="h-3.5 w-3.5" />}
            label="Drafts"
            value={drafts}
            caption="waiting for finalisation"
            progress={(drafts / Math.max(total, 1)) * 100}
          />
          <PastelStat
            tone="sky"
            icon={<FileSearch className="h-3.5 w-3.5" />}
            label="Not yet received"
            value={review}
            caption="needs your sign-off"
            progress={(review / Math.max(total, 1)) * 100}
          />
          <PastelStat
            tone="mint"
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="Accepted"
            value={completed}
            caption={`${completionPct}% completion rate`}
            progress={completionPct}
          />
        </div>
      )}

      {/* Bento: calendar + review queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 rounded-3xl border border-border/70 bg-card shadow-soft-xs">
          <AssessmentCalendar assessments={assessments} />
        </Card>

        <InboxPanel
          showRequests={role === "HOD"}
          teacherView={isTeacher}
          filterAssessments={inboxFilter}
        />
      </div>

      {/* Assessments grid */}

      {!isHM && (
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-[18px] text-foreground tracking-tight">Your Assessments</h2>
            <p className="text-sm text-muted-foreground">
              PA1, PA2, Mid-term, Final Exam, Unit Tests
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-sm rounded-full group">
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Status filter pills */}
        <div
          role="tablist"
          aria-label="Filter assessments by status"
          className="flex flex-wrap items-center gap-2 mb-5"
        >
          {filterOptions.map((opt) => {
            const active = statusFilter === opt;
            const count = statusCounts[opt];
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
                <span className="font-medium">{getFilterLabel(opt)}</span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-medium tabular-nums",
                    active
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {assessments.length === 0 ? (
          <EmptyState onCreate={() => navigate("/create")} />
        ) : filteredAssessments.length === 0 ? (
          <Card className="p-10 rounded-3xl border border-dashed border-border text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
              <Inbox className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-[15px] text-foreground">
              No assessments in "{getFilterLabel(statusFilter)}"
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different status filter to see more.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssessments.map((a) => (
              <AssessmentCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type Tone = "lavender" | "peach" | "sky" | "mint" | "rose";

const toneMap: Record<Tone, { bg: string; ink: string; bar: string; barTrack: string }> = {
  lavender: {
    bg: "bg-[hsl(var(--pastel-lavender))]",
    ink: "text-[hsl(var(--pastel-lavender-ink))]",
    bar: "bg-[hsl(var(--pastel-lavender-ink))]",
    barTrack: "bg-white/70",
  },
  peach: {
    bg: "bg-[hsl(var(--pastel-peach))]",
    ink: "text-[hsl(var(--pastel-peach-ink))]",
    bar: "bg-[hsl(var(--pastel-peach-ink))]",
    barTrack: "bg-white/70",
  },
  sky: {
    bg: "bg-[hsl(var(--pastel-sky))]",
    ink: "text-[hsl(var(--pastel-sky-ink))]",
    bar: "bg-[hsl(var(--pastel-sky-ink))]",
    barTrack: "bg-white/70",
  },
  mint: {
    bg: "bg-[hsl(var(--pastel-mint))]",
    ink: "text-[hsl(var(--pastel-mint-ink))]",
    bar: "bg-[hsl(var(--pastel-mint-ink))]",
    barTrack: "bg-white/70",
  },
  rose: {
    bg: "bg-[hsl(var(--pastel-rose))]",
    ink: "text-[hsl(var(--pastel-rose-ink))]",
    bar: "bg-[hsl(var(--pastel-rose-ink))]",
    barTrack: "bg-white/70",
  },
};

function PastelStat({
  tone,
  icon,
  label,
  value,
  caption,
  progress,
}: {
  tone: Tone;
  icon: React.ReactNode;
  label: string;
  value: number;
  caption: string;
  progress: number;
}) {
  const t = toneMap[tone];
  const pct = Math.max(4, Math.min(100, progress));
  const slug = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <Card
      role="group"
      aria-labelledby={`stat-${slug}-label`}
      aria-describedby={`stat-${slug}-caption`}
      className={cn(
        "relative overflow-hidden p-5 rounded-3xl border border-border/70 shadow-soft-xs",
        t.bg
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full bg-white/85",
            t.ink
          )}
        >
          {icon}
        </span>
        <h3
          id={`stat-${slug}-label`}
          className={cn("text-[15px] font-medium tracking-tight", t.ink)}
        >
          {label}
        </h3>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <div
          className={cn("text-[44px] leading-none font-medium tracking-tight", t.ink)}
          aria-label={`${label}: ${value}`}
        >
          {value}
        </div>
        <div className={cn("text-sm opacity-75", t.ink)} aria-hidden="true">
          / {label === "Accepted" ? "100%" : "total"}
        </div>
      </div>

      <p id={`stat-${slug}-caption`} className={cn("mt-1.5 text-sm opacity-90", t.ink)}>
        {caption}
      </p>

      {/* Modern progress bar */}
      <div className="mt-5 flex items-center gap-3">
        <div
          className={cn(
            "relative h-2.5 flex-1 rounded-full overflow-hidden",
            "bg-white/60 ring-1 ring-inset ring-black/5",
            "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
          )}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} progress`}
        >
          <div
            className={cn(
              "relative h-full rounded-full animate-progress-grow",
              t.bar,
              "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_2px_8px_-1px_currentColor]"
            )}
            style={
              {
                ["--progress-target" as string]: `${pct}%`,
                width: `${pct}%`,
              } as React.CSSProperties
            }
          >
            {/* glossy top highlight */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/35"
            />
            {/* glow tip */}
            <span
              aria-hidden="true"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)]"
            />
          </div>
        </div>
        <span
          className={cn(
            "text-sm font-medium tabular-nums min-w-[3ch] text-right",
            t.ink
          )}
          aria-hidden="true"
        >
          {Math.round(pct)}%
        </span>
      </div>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="p-12 rounded-3xl border border-dashed border-border text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-[15px] text-foreground">No assessments yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first assessment to get started.
      </p>
      <Button
        className="mt-5"
        onClick={onCreate}
      >
        <Plus className="h-4 w-4 mr-2" /> Create Assessment
      </Button>
    </Card>
  );
}
