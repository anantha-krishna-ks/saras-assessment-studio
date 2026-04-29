import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  Check,
  FileSearch,
  Inbox,
  UserCog,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { assessments as allAssessments } from "@/data/assessments";
import {
  reassignmentRequests as seed,
  type ReassignmentRequest,
} from "@/data/requests";

type Tab = "queue" | "requests";

interface Props {
  showRequests?: boolean;
}

export function InboxPanel({ showRequests = true }: Props) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("queue");
  const [requests, setRequests] = useState<ReassignmentRequest[]>(seed);

  const queueItems = allAssessments
    .filter((a) => a.status === "In Review" || a.status === "Draft")
    .slice(0, 5);
  const queueCount = queueItems.length;

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

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "queue", label: "Review Queue", count: queueCount },
  ];
  if (showRequests) {
    tabs.push({ key: "requests", label: "Requests", count: pendingCount });
  }

  const activeMeta =
    tab === "queue"
      ? {
          icon: <FileSearch className="h-4 w-4" />,
          title: "Review Queue",
          subtitle: "Papers awaiting your review",
          tone: "bg-primary-soft text-primary",
        }
      : {
          icon: <UserCog className="h-4 w-4" />,
          title: "Requests",
          subtitle: "Teacher reassignment approvals",
          tone: "bg-[hsl(var(--pastel-peach))] text-[hsl(var(--pastel-peach-ink))]",
        };

  return (
    <Card className="rounded-3xl border border-border/70 bg-card shadow-soft-xs overflow-hidden flex flex-col">
      {/* Header: contextual title + underline tabs */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
              activeMeta.tone
            )}
          >
            {activeMeta.icon}
          </span>
          <div className="min-w-0">
            <h2 className="text-[15px] text-foreground font-medium leading-tight truncate">
              {activeMeta.title}
            </h2>
            <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
              {activeMeta.subtitle}
            </p>
          </div>
        </div>

        {tabs.length > 1 && (
          <div
            role="tablist"
            aria-label="Inbox sections"
            className="relative flex items-center gap-1 shrink-0"
          >
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 h-8 px-2.5 text-[13px] transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="font-medium">{t.label}</span>
                  {t.count > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-medium tabular-nums transition-colors",
                        active
                          ? t.key === "requests"
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary-soft text-primary"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {t.count}
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-2 right-2 -bottom-[7px] h-[2px] rounded-full transition-all",
                      active ? "bg-primary opacity-100" : "opacity-0"
                    )}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Subtle divider under header */}
      <div className="mx-5 h-px bg-border/60" />

      {/* Body — fixed height, internal scroll keeps layout stable */}
      <div className="p-4 pt-3 flex-1">
        {tab === "queue" ? (
          <div>
            <p className="text-[12px] text-muted-foreground px-1 mb-2">
              Papers awaiting your review
            </p>
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
          </div>
        ) : (
          <div>
            <p className="text-[12px] text-muted-foreground px-1 mb-2 flex items-center gap-1.5">
              <UserCog className="h-3 w-3" />
              Teacher reassignment approvals
            </p>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 -mr-1">
              {pending.length === 0 ? (
                <EmptyBlock label="No pending requests." />
              ) : (
                pending.map((r) => (
                  <div key={r.id} className="rounded-2xl bg-secondary/40 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--pastel-lavender))] text-[hsl(var(--pastel-lavender-ink))] text-[12px] font-medium">
                        {r.requestingTeacherInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-foreground leading-snug">
                          <span className="font-medium">
                            {r.requestingTeacher}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            wants to take over from
                          </span>{" "}
                          <span className="font-medium">
                            {r.originalTeacher}
                          </span>
                        </div>
                        <div className="mt-1 text-[12px] text-muted-foreground truncate">
                          {r.assessmentTitle}
                        </div>
                        <p className="mt-1.5 text-[12px] text-muted-foreground italic">
                          "{r.reason}"
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDecision(r.id, "Rejected")}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 px-3"
                        onClick={() => handleDecision(r.id, "Accepted")}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
