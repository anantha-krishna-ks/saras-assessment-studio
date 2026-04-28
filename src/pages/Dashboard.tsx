import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext";
import type { AssessmentStatus } from "@/data/assessments";
import { assessments } from "@/data/assessments";
import { AssessmentCard } from "@/components/dashboard/AssessmentCard";
import { AssessmentCalendar } from "@/components/dashboard/AssessmentCalendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ClipboardCheck,
  FilePlus2,
  FileSearch,
  Inbox,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { role, user } = useRole();
  const navigate = useNavigate();

  const drafts = assessments.filter((a) => a.status === "Draft").length;
  const review = assessments.filter((a) => a.status === "In Review").length;
  const completed = assessments.filter((a) => a.status === "Completed").length;
  const total = assessments.length;
  const completionPct = Math.round((completed / Math.max(total, 1)) * 100);

  const greeting = `Good ${
    new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"
  }`;

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
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full bg-card hover:bg-secondary/60 border-border h-10 px-5"
            onClick={() => navigate("/review-qp")}
          >
            <FileSearch className="h-4 w-4 mr-2" />
            Review QP
          </Button>
          <Button
            className="h-10 px-5"
            onClick={() => navigate("/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>
      </div>

      {/* Hero pastel stat tiles */}
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
          label="In Review"
          value={review}
          caption="needs your sign-off"
          progress={(review / Math.max(total, 1)) * 100}
        />
        <PastelStat
          tone="mint"
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="Completed"
          value={completed}
          caption={`${completionPct}% completion rate`}
          progress={completionPct}
        />
      </div>

      {/* Bento: calendar + review queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 rounded-3xl border border-border/70 bg-card shadow-soft-xs">
          <AssessmentCalendar assessments={assessments} />
        </Card>

        <Card className="p-6 rounded-3xl border border-border/70 bg-card shadow-soft-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[15px] text-foreground">Review Queue</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Papers awaiting your review
              </p>
            </div>
            <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-primary-soft text-primary text-sm">
              {review + drafts}
            </span>
          </div>
          <div className="space-y-2.5">
            {assessments
              .filter((a) => a.status === "In Review" || a.status === "Draft")
              .slice(0, 4)
              .map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/review-qp/${a.id}`)}
                  className="group w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 hover:bg-secondary transition-colors"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm",
                      i % 2 === 0
                        ? "bg-[hsl(var(--pastel-lavender))] text-[hsl(var(--pastel-lavender-ink))]"
                        : "bg-[hsl(var(--pastel-peach))] text-[hsl(var(--pastel-peach-ink))]"
                    )}
                  >
                    {a.subject[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground truncate">{a.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5 truncate">
                      {a.subject} ·{" "}
                      {new Date(a.dueAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            {review + drafts === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">
                You're all caught up ✨
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Assessments grid */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-[18px] text-foreground tracking-tight">Your Assessments</h2>
            <p className="text-sm text-muted-foreground">
              PA1, PA2, Mid-term, Final Exam, Unit Tests
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-sm rounded-full">
            View all
          </Button>
        </div>

        {assessments.length === 0 ? (
          <EmptyState onCreate={() => navigate("/create")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessments.map((a) => (
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
          / {label === "Completed" ? "100%" : "total"}
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
