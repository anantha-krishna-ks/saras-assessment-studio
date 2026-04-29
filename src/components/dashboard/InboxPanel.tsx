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

interface Props {
  showRequests?: boolean;
}

export function InboxPanel({ showRequests = true }: Props) {
  const navigate = useNavigate();
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

  return (
    <Card className="rounded-3xl border border-border/70 bg-card shadow-soft-xs overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-4 border-b border-border/60">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Inbox className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[15px] text-foreground font-medium leading-tight truncate">
              Action Center
            </h2>
            <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
              Reviews and teacher handover decisions
            </p>
          </div>
        </div>
        {showRequests && pendingCount > 0 && (
          <span className="inline-flex h-7 items-center rounded-full bg-primary text-primary-foreground px-2.5 text-[12px] font-medium tabular-nums">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1">
        {showRequests && (
          <section
            aria-labelledby="requests-heading"
            className={cn(
              "rounded-2xl border p-3.5",
              pendingCount > 0
                ? "border-primary/25 bg-primary-soft/70"
                : "border-border/70 bg-secondary/35"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    pendingCount > 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <UserCog className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 id="requests-heading" className="text-sm text-foreground font-medium leading-tight">
                    Teacher Requests
                  </h3>
                  <p className="mt-1 text-[12px] text-muted-foreground leading-snug">
                    {pendingCount > 0
                      ? "Approve or decline reassignment requests before review ownership changes."
                      : "No handover approvals pending."}
                  </p>
                </div>
              </div>
              {pendingCount > 0 && (
                <span className="shrink-0 rounded-full bg-card px-2.5 py-1 text-[12px] text-primary font-medium tabular-nums shadow-soft-xs">
                  {pendingCount}
                </span>
              )}
            </div>

            {pendingCount > 0 && (
              <div className="mt-3 space-y-2 max-h-[220px] overflow-y-auto pr-1 -mr-1">
                {pending.map((r) => (
                  <div key={r.id} className="rounded-2xl bg-card border border-border/70 p-3 shadow-soft-xs">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--pastel-peach))] text-[hsl(var(--pastel-peach-ink))] text-[12px] font-medium">
                        {r.requestingTeacherInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-foreground leading-snug">
                          <span className="font-medium">{r.requestingTeacher}</span>{" "}
                          <span className="text-muted-foreground">for</span>{" "}
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
                ))}
              </div>
            )}
          </section>
        )}

        <section aria-labelledby="review-queue-heading">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <FileSearch className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h3 id="review-queue-heading" className="text-sm text-foreground font-medium leading-tight">
                  Review Queue
                </h3>
                <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                  Papers awaiting your review
                </p>
              </div>
            </div>
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-[11px] text-muted-foreground font-medium tabular-nums">
              {queueCount}
            </span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 -mr-1">
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
        </section>
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
