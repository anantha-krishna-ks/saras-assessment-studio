import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext";
import { assessments } from "@/data/assessments";
import { AssessmentCard } from "@/components/dashboard/AssessmentCard";
import { AssessmentCalendar } from "@/components/dashboard/AssessmentCalendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  FilePlus2,
  FileSearch,
  Inbox,
  Plus,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const { role, user } = useRole();
  const navigate = useNavigate();

  const drafts = assessments.filter((a) => a.status === "Draft").length;
  const review = assessments.filter((a) => a.status === "In Review").length;
  const completed = assessments.filter((a) => a.status === "Completed").length;
  const total = assessments.length;

  const greeting = `Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}`;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">{role} Workspace</div>
          <h1 className="text-[28px] text-foreground mt-1">{greeting}, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what needs your attention today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl bg-background hover:bg-background"
            onClick={() => navigate("/review-qp")}
          >
            <FileSearch className="h-4 w-4 mr-2" />
            Review QP
          </Button>
          <Button className="rounded-xl bg-primary hover:bg-primary-hover" onClick={() => navigate("/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>
      </div>

      {/* Stats — bento row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Assessments" value={total} icon={<ClipboardCheck className="h-4 w-4" />} />
        <StatCard label="Drafts" value={drafts} icon={<FilePlus2 className="h-4 w-4" />} tone="warning" />
        <StatCard label="In Review" value={review} icon={<FileSearch className="h-4 w-4" />} tone="primary" />
        <StatCard label="Completed" value={completed} icon={<TrendingUp className="h-4 w-4" />} tone="success" />
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar takes 2 cols */}
        <Card className="lg:col-span-2 p-6 rounded-2xl border border-border shadow-soft-xs">
          <AssessmentCalendar assessments={assessments} />
        </Card>

        {/* Side: Review queue */}
        <Card className="p-6 rounded-2xl border border-border shadow-soft-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] text-foreground">Review Queue</h2>
              <p className="text-sm text-muted-foreground">Question papers awaiting your review</p>
            </div>
          </div>
          <div className="space-y-3">
            {assessments
              .filter((a) => a.status === "In Review" || a.status === "Draft")
              .slice(0, 4)
              .map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                    <FileSearch className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground truncate">{a.title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {a.subject} · Due {new Date(a.dueAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-sm h-7 text-primary hover:text-primary hover:bg-primary-soft"
                    onClick={() => navigate(`/review-qp/${a.id}`)}
                  >
                    Review
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Assessments grid */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-[18px] text-foreground">Your Assessments</h2>
            <p className="text-sm text-muted-foreground">PA1, PA2, Mid-term, Final Exam, Unit Tests</p>
          </div>
          <Button variant="ghost" size="sm" className="text-sm">View all</Button>
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

function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "default" | "primary" | "success" | "warning";
}) {
  const toneClass = {
    default: "bg-secondary text-foreground",
    primary: "bg-primary-soft text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  }[tone];

  return (
    <Card className="p-5 rounded-2xl border border-border shadow-soft-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneClass}`}>
          {icon}
        </div>
      </div>
      <div className="text-[26px] text-foreground mt-2">{value}</div>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="p-12 rounded-2xl border border-dashed border-border text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-[15px] text-foreground">No assessments yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Create your first assessment to get started.</p>
      <Button className="mt-5 rounded-xl bg-primary hover:bg-primary-hover" onClick={onCreate}>
        <Plus className="h-4 w-4 mr-2" /> Create Assessment
      </Button>
    </Card>
  );
}
