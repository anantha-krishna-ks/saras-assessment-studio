import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SectionPanel from "@/components/assessment/SectionPanel";
import { createSection, type Section } from "@/constants/assessmentSectionData";

interface AssessmentContext {
  assessmentId?: string;
  title?: string;
  grade?: string;
  subject?: string;
  scheduledAt?: string;
}

export default function CreateAssessmentV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = (location.state ?? {}) as AssessmentContext;

  const [sections, setSections] = useState<Section[]>([createSection("A")]);

  const handleSubmit = () => {
    toast.success("Assessment created successfully");
    navigate("/dashboard");
  };

  const scheduledLabel = ctx.scheduledAt
    ? new Date(ctx.scheduledAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to dashboard"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-foreground truncate">
            {ctx.title ?? "Create Assessment"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {ctx.grade && (
              <Badge variant="secondary" className="font-normal">
                {ctx.grade}
              </Badge>
            )}
            {ctx.subject && (
              <Badge variant="secondary" className="font-normal">
                {ctx.subject}
              </Badge>
            )}
            {scheduledLabel && (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                Scheduled {scheduledLabel}
              </span>
            )}
            {!ctx.title && (
              <p className="text-sm text-muted-foreground">
                Build the sections and questions for your assessment
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <SectionPanel sections={sections} onChange={setSections} />

        <div className="flex justify-end gap-2 pt-6 mt-6 border-t border-border">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="px-8">
            Create Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
