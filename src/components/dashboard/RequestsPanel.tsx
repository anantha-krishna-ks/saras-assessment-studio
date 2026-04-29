import { useState } from "react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check, ChevronDown, Inbox, UserCog, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  reassignmentRequests as seed,
  type ReassignmentRequest,
} from "@/data/requests";

export function RequestsPanel() {
  const [requests, setRequests] = useState<ReassignmentRequest[]>(seed);
  const [open, setOpen] = useState(false);

  const pending = requests.filter((r) => r.status === "Pending");
  const pendingCount = pending.length;

  const handleDecision = (id: string, decision: "Accepted" | "Rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: decision } : r))
    );
    const req = requests.find((r) => r.id === id);
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
    <Card className="rounded-3xl border border-border/70 bg-card shadow-soft-xs overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center justify-between gap-3 p-4 hover:bg-secondary/40 transition-colors"
            aria-label="Toggle teacher reassignment requests"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  pendingCount > 0
                    ? "bg-[hsl(var(--pastel-peach))] text-[hsl(var(--pastel-peach-ink))]"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <UserCog className="h-4 w-4" />
              </span>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-foreground font-medium">
                    Requests
                  </span>
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-medium tabular-nums">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                  {pendingCount > 0
                    ? `${pendingCount} teacher reassignment${pendingCount > 1 ? "s" : ""} awaiting approval`
                    : "No pending requests"}
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                open && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-1 border-t border-border/60 space-y-2.5">
            {pending.length === 0 ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                  <Inbox className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  You're all caught up on requests.
                </p>
              </div>
            ) : (
              pending.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl bg-secondary/40 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--pastel-lavender))] text-[hsl(var(--pastel-lavender-ink))] text-[12px] font-medium">
                      {r.requestingTeacherInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground">
                        <span className="font-medium">{r.requestingTeacher}</span>{" "}
                        <span className="text-muted-foreground">
                          requests to take over from
                        </span>{" "}
                        <span className="font-medium">{r.originalTeacher}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <span className="truncate">{r.assessmentTitle}</span>
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
