import { Assessment, AssessmentStatus } from "@/data/assessments";
import { useRole } from "@/context/RoleContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar as CalendarIcon,
  Copy,
  Eye,
  FileText,
  HelpCircle,
  Layers,
  MoreHorizontal,
  Pencil,
  Target,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<AssessmentStatus, { chip: string; dot: string; accent: string }> = {
  "Not yet started": {
    chip: "bg-secondary text-muted-foreground border-border/60",
    dot: "bg-muted-foreground/50",
    accent: "bg-muted-foreground/30",
  },
  Draft: {
    chip: "bg-warning/10 text-warning border-warning/20",
    dot: "bg-warning",
    accent: "bg-warning/60",
  },
  "Not yet received": {
    chip: "bg-primary-soft text-primary border-primary/20",
    dot: "bg-primary",
    accent: "bg-primary/60",
  },
  Reverted: {
    chip: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
    accent: "bg-destructive/60",
  },
  Accepted: {
    chip: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
    accent: "bg-success/60",
  },
  "Submitted to HM": {
    chip: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
    accent: "bg-primary/60",
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getHODLabel(status: AssessmentStatus): string {
  switch (status) {
    case "Not yet received":
      return "Submitted to teacher";
    case "Draft":
      return "Waiting for approval";
    case "Reverted":
      return "Reverted for revision";
    default:
      return status;
  }
}

export function AssessmentCard({ a }: { a: Assessment }) {
  const { role } = useRole();
  const isHOD = role === "HOD";
  const styles = statusStyles[a.status];
  const statusLabel = isHOD ? getHODLabel(a.status) : a.status;

  return (
    <Card className="group relative overflow-hidden p-0 border border-border shadow-soft-xs hover:shadow-soft-sm hover:border-border transition-all rounded-2xl">
      {/* Status accent bar */}
      <div className={cn("absolute inset-x-0 top-0 h-0.5", styles.accent)} aria-hidden="true" />

      <div className="p-5 space-y-4">
        {/* Header: icon + title + menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft">
              <FileText className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[14.5px] font-medium text-foreground leading-snug truncate">
                {a.title}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/70">{a.type}</span>
                <span className="text-muted-foreground/40">•</span>
                <span>{a.grade}</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="truncate">{a.subject}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View results</DropdownMenuItem>
              <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
              <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 h-6 rounded-full border",
              styles.chip,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} aria-hidden="true" />
            {statusLabel}
          </span>
          {a.reviewer && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground truncate">
              <UserIcon className="h-3 w-3" />
              {a.reviewer}
            </span>
          )}
        </div>

        {/* Quick stats */}
        {!isHOD && (
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-secondary/50 p-2.5">
            <Stat icon={<HelpCircle className="h-3 w-3" />} label="Questions" value={a.questions} />
            <Stat icon={<Layers className="h-3 w-3" />} label="Sections" value={a.sections} />
            <Stat icon={<Target className="h-3 w-3" />} label="Marks" value={a.totalMarks} />
          </div>
        )}

        {/* Footer dates */}
        <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-3 w-3" />
            <span>Scheduled <span className="text-foreground/80 font-medium">{formatDate(a.scheduledAt)}</span></span>
          </div>
          <span>Due <span className="text-foreground/80 font-medium">{formatDate(a.dueAt)}</span></span>
        </div>
      </div>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-[15px] font-medium text-foreground tabular-nums">{value}</div>
    </div>
  );
}
