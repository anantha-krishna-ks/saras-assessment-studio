import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  FileSearch,
  Inbox,
  RotateCcw,
  UserCog,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { assessments as allAssessments, type Assessment } from "@/data/assessments";
import {
  reassignmentRequests as seed,
  type ReassignmentRequest,
} from "@/data/requests";

interface Props {
  showRequests?: boolean;
  teacherView?: boolean;
  filterAssessments?: (a: Assessment) => boolean;
}

type TabKey = "queue" | "requests" | "upcoming" | "rework";

export function InboxPanel({ showRequests = true, teacherView = false, filterAssessments }: Props) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ReassignmentRequest[]>(seed);
  const [tab, setTab] = useState<TabKey>(teacherView ? "upcoming" : "queue");

  const scoped = filterAssessments ? allAssessments.filter(filterAssessments) : allAssessments;

  const queueItems = scoped
    .filter((a) => a.status === "Not yet received" || a.status === "Draft")
    .slice(0, 5);
  const queueCount = queueItems.length;

  const upcomingItems = scoped
    .filter((a) => a.status === "Not yet started")
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
    .slice(0, 5);
  const upcomingCount = upcomingItems.length;

  const reworkItems = scoped.filter((a) => a.status === "Reverted").slice(0, 5);
  const reworkCount = reworkItems.length;

  const pending = requests.filter((r) => r.status === "Pending");
  const pendingCount = pending.length;

  const handleDecision = (id: string, decision: "Accepted" | "Rejected") => {
    const req = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: decision } : r))
    );
    if (!req) return;
    if (decision === "Accepted") {
      toast.success(`Reassigned to ${req.requestingTeacher}`, {
        description: `${req.assessmentTitle} is now owned by ${req.requestingTeacher}.`,
      });
    } else {
      toast(`Request from ${req.requestingTeacher} declined`, {
        description: `${req.originalTeacher} remains assigned to ${req.assessmentTitle}.`,
      });
    }
  };

  const tabs = teacherView
    ? [
        {
          key: "upcoming" as TabKey,
          label: "Upcoming",
          fullLabel: "Upcoming Assessments",
          icon: <CalendarClock className="h-4 w-4" />,
          count: upcomingCount,
          show: true,
        },
        {
          key: "rework" as TabKey,
          label: "Rework",
          fullLabel: "Rework on Assessments",
          icon: <RotateCcw className="h-4 w-4" />,
          count: reworkCount,
          show: true,
        },
      ]
    : [
        {
          key: "queue" as TabKey,
          label: "Review Queue",
          fullLabel: "Review Queue",
          icon: <FileSearch className="h-4 w-4" />,
          count: queueCount,
          show: true,
        },
        {
          key: "requests" as TabKey,
          label: "Requests",
          fullLabel: "Requests",
          icon: <UserCog className="h-4 w-4" />,
          count: pendingCount,
          show: showRequests,
        },
      ].filter((t) => t.show);

  return (
    <Card className="rounded-3xl border border-border/70 bg-card shadow-soft-xs overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Inbox className="h-4 w-4" />
          </span>
          <h2 className="text-[15px] text-foreground font-medium leading-tight truncate">
            Action Center
          </h2>
        </div>
      </div>

      {/* Segmented pills — equal width, scale to any label length */}
      <div className="px-4 pb-3">
        <div
          role="tablist"
          aria-label="Action Center sections"
          className="flex gap-1 p-1 rounded-2xl bg-secondary/60 border border-border/60"
        >
          {tabs.map((t) => {
            const active = tab === t.key;
            const isAlert = (t.key === "requests" || t.key === "rework") && t.count > 0;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                title={t.fullLabel}
                className={cn(
                  "relative flex-1 min-w-0 flex items-center justify-center gap-1.5 h-9 px-2 rounded-xl text-[13px] font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "shrink-0 flex items-center justify-center",
                    active ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {t.icon}
                </span>
                <span className="truncate">{t.label}</span>
                {t.count > 0 && (
                  <span
                    className={cn(
                      "shrink-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : isAlert
                          ? "bg-primary/15 text-primary"
                          : "bg-card text-muted-foreground border border-border/60"
                    )}
                  >
                    {t.count}
                  </span>
                )}
                {isAlert && !active && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-4 flex-1">
        {tab === "queue" && (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 -mr-1">
            {queueItems.length === 0 ? (
              <EmptyBlock label="You're all caught up ✨" />
            ) : (
              queueItems.map((a, i) => (
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
                    <div className="text-sm text-foreground truncate">
                      {a.title}
                    </div>
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
              ))
            )}
          </div>
        )}

        {tab === "requests" && (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 -mr-1">
            {pending.length === 0 ? (
              <EmptyBlock label="No handover approvals pending" />
            ) : (
              pending.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-secondary/40 border border-border/60 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--pastel-peach))] text-[hsl(var(--pastel-peach-ink))] text-[12px] font-medium">
                      {r.requestingTeacherInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground leading-snug">
                        <span className="font-medium">{r.requestingTeacher}</span>{" "}
                        <span className="text-muted-foreground">to cover for</span>{" "}
                        <span className="font-medium">{r.originalTeacher}</span>
                      </div>
                      <div className="mt-1 text-[12px] text-muted-foreground truncate">
                        {r.assessmentTitle}
                      </div>
                      <p className="mt-1.5 text-[12px] text-muted-foreground italic leading-snug">
                        “{r.reason}”
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDecision(r.id, "Rejected")}
                    >
                      <X className="h-3.5 w-3.5" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => handleDecision(r.id, "Accepted")}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {(tab === "upcoming" || tab === "rework") && (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 -mr-1">
            {(tab === "upcoming" ? upcomingItems : reworkItems).length === 0 ? (
              <EmptyBlock
                label={
                  tab === "upcoming"
                    ? "No upcoming assessments"
                    : "Nothing to rework right now ✨"
                }
              />
            ) : (
              (tab === "upcoming" ? upcomingItems : reworkItems).map((a, i) => (
                <button
                  key={a.id}
                  onClick={() =>
                    tab === "upcoming"
                      ? navigate(`/create-v2`, {
                          state: {
                            assessmentId: a.id,
                            title: a.title,
                            grade: a.grade,
                            subject: a.subject,
                            scheduledAt: a.scheduledAt,
                          },
                        })
                      : navigate(`/review-qp/${a.id}`)
                  }
                  className="group w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 hover:bg-secondary transition-colors"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm",
                      tab === "rework"
                        ? "bg-[hsl(var(--pastel-rose))] text-[hsl(var(--pastel-rose-ink))]"
                        : i % 2 === 0
                          ? "bg-[hsl(var(--pastel-sky))] text-[hsl(var(--pastel-sky-ink))]"
                          : "bg-[hsl(var(--pastel-mint))] text-[hsl(var(--pastel-mint-ink))]"
                    )}
                  >
                    {a.subject[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground truncate">{a.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5 truncate">
                      {a.grade} · {a.subject} ·{" "}
                      {new Date(
                        tab === "upcoming" ? a.scheduledAt : a.dueAt
                      ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
        <Inbox className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
