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
  MoreHorizontal,
  Pencil,
  Trash2,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<AssessmentStatus, string> = {
  "Not yet started": "bg-secondary text-muted-foreground",
  Draft: "bg-warning/10 text-warning",
  "Not yet received": "bg-primary-soft text-primary",
  Reverted: "bg-destructive/10 text-destructive",
  Accepted: "bg-success/10 text-success",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function AssessmentCard({ a }: { a: Assessment }) {
  const { role } = useRole();
  const isHOD = role === "HOD";
  return (
    <Card className="group p-5 border border-border shadow-soft-xs hover:shadow-soft-sm transition-shadow rounded-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-sm uppercase tracking-wide text-muted-foreground">
              {a.type} · {a.grade}
            </div>
            <h3 className="text-[14px] text-foreground truncate">{a.title}</h3>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View results</DropdownMenuItem>
            <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
            <DropdownMenuItem><Copy className="h-4 w-4 mr-2" />Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={cn("inline-flex items-center text-sm px-2 h-5 rounded-full", statusStyles[a.status])}>
          {a.status}
        </span>
        <span className="text-sm text-muted-foreground">{a.subject}</span>
      </div>

      {!isHOD && (
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-border">
          <Stat label="Questions" value={a.questions.toString()} />
          <Stat label="Sections" value={a.sections.toString()} icon={<Layers className="h-3 w-3" />} />
          <Stat label="Marks" value={a.totalMarks.toString()} />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="h-3 w-3" />
          <span>Due {formatDate(a.dueAt)}</span>
        </div>
        <span>Scheduled {formatDate(a.scheduledAt)}</span>
      </div>
    </Card>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-sm uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-[15px] text-foreground">{value}</div>
    </div>
  );
}
