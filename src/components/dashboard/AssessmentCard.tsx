import { useState } from "react";
import { Assessment, AssessmentStatus } from "@/data/assessments";
import { useRole } from "@/context/RoleContext";
import { TransferToColleagueModal } from "./TransferToColleagueModal";
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
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  AssessmentStatus,
  { chip: string; dot: string; bar: string; iconWrap: string; iconColor: string }
> = {
  "Not yet started": {
    chip: "bg-muted/60 text-muted-foreground",
    dot: "bg-muted-foreground/40",
    bar: "bg-muted-foreground/40",
    iconWrap: "bg-muted/70",
    iconColor: "text-muted-foreground",
  },
  Draft: {
    chip: "bg-warning/10 text-warning",
    dot: "bg-warning/80",
    bar: "bg-warning",
    iconWrap: "bg-warning/10",
    iconColor: "text-warning",
  },
  "Not yet received": {
    chip: "bg-primary-soft text-primary",
    dot: "bg-primary/80",
    bar: "bg-primary",
    iconWrap: "bg-primary-soft",
    iconColor: "text-primary",
  },
  Reverted: {
    chip: "bg-destructive/10 text-destructive",
    dot: "bg-destructive/80",
    bar: "bg-destructive",
    iconWrap: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  Accepted: {
    chip: "bg-success/10 text-success",
    dot: "bg-success/80",
    bar: "bg-success",
    iconWrap: "bg-success/10",
    iconColor: "text-success",
  },
  "Submitted to HM": {
    chip: "bg-primary/10 text-primary",
    dot: "bg-primary/80",
    bar: "bg-primary",
    iconWrap: "bg-primary/10",
    iconColor: "text-primary",
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
    case "Not yet started":
      return "Submitted to HM";
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
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <>
    <Card className="group relative overflow-hidden p-0 border border-border/60 bg-card hover:border-border hover:shadow-soft-sm transition-all duration-200 rounded-xl">
      {/* Status accent bar */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-16 flex justify-center" aria-hidden="true">
        <span className={cn("h-full w-full rounded-b-full opacity-90", styles.bar)} />
      </div>

      <div className="relative p-5 space-y-4">
        {/* Header: icon + title + menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset ring-border/40",
                styles.iconWrap,
              )}
            >
              <FileText className={cn("h-5 w-5", styles.iconColor)} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-medium text-foreground leading-snug truncate">
                {a.title}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
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
                className="h-8 w-8 shrink-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              {role === "Teacher" ? (
                <>
                  <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                  <DropdownMenuItem><UserPlus className="h-4 w-4 mr-2" />Transfer to colleague</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View results</DropdownMenuItem>
                  <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                  <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status pill */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 h-6 rounded-full",
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
          <div className="flex items-stretch rounded-2xl bg-secondary/40 px-2 py-2">
            <Stat icon={<HelpCircle className="h-3 w-3" />} label="Questions" value={a.questions} />
            <div className="w-px bg-border/60 mx-1" aria-hidden="true" />
            <Stat icon={<Layers className="h-3 w-3" />} label="Sections" value={a.sections} />
            <div className="w-px bg-border/60 mx-1" aria-hidden="true" />
            <Stat icon={<Target className="h-3 w-3" />} label="Marks" value={a.totalMarks} />
          </div>
        )}

        {/* Footer dates */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-3 w-3" />
            <span>
              Scheduled <span className="text-foreground/80 font-medium">{formatDate(a.scheduledAt)}</span>
            </span>
          </div>
          <span>
            Due <span className="text-foreground/80 font-medium">{formatDate(a.dueAt)}</span>
          </span>
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
    <div className="flex-1 text-center">
      <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-[15px] font-medium text-foreground tabular-nums leading-tight">{value}</div>
    </div>
  );
}
