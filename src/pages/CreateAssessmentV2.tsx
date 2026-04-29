import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, CalendarClock, Eye, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SectionPanel from "@/components/assessment/SectionPanel";
import AssessmentBlueprintDrawer from "@/components/assessment/AssessmentBlueprintDrawer";
import AssessmentPreviewModal from "@/components/assessment/AssessmentPreviewModal";
import { createSection, type Section, type SectionItem } from "@/constants/assessmentSectionData";

interface AssessmentContext {
  assessmentId?: string;
  title?: string;
  grade?: string;
  subject?: string;
  scheduledAt?: string;
  chapters?: string[];
}

const DEFAULT_INSTRUCTIONS = `General Instructions:
i. This question paper contains five sections A, B, C, D, and E. Each section is compulsory.
ii. Section A has 10 MCQs of 1 mark each.
iii. Section B has 3 Very Short Answer (VSA)-type questions of 2 marks each.
iv. Section C has 2 Short Answer (SA) – type questions of 3 marks each.
v. Section D has 2 Long Answer (LA) – type questions of 5 marks each.
vi. Section E has 2 Case study – type questions of 4 marks each.`;

const sumItemMarks = (item: SectionItem): number => {
  const subTotal = item.subItems?.reduce((s, si) => s + sumItemMarks(si), 0) ?? 0;
  const orTotal = item.orItem ? sumItemMarks(item.orItem) : 0;
  return item.score + subTotal + orTotal;
};

export default function CreateAssessmentV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = (location.state ?? {}) as AssessmentContext;

  const [sections, setSections] = useState<Section[]>([createSection("A")]);
  const [instructions, setInstructions] = useState<string>(DEFAULT_INSTRUCTIONS);
  const [previewOpen, setPreviewOpen] = useState(false);

  const totalMarks = useMemo(
    () => sections.reduce((sum, s) => sum + s.items.reduce((a, i) => a + sumItemMarks(i), 0), 0),
    [sections]
  );

  const chapters = ctx.chapters ?? [];

  const scheduledLabel = ctx.scheduledAt
    ? new Date(ctx.scheduledAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const previewData = {
    schoolName: "EXCEL PUBLIC SCHOOL, MYSURU",
    examTitle: ctx.title ? ctx.title.toUpperCase() : "ASSESSMENT PREVIEW",
    className: ctx.grade ?? "",
    subject: ctx.subject ?? "",
    totalMarks: totalMarks ? String(totalMarks) : "",
    duration: "",
    instructions,
    sections,
  };

  const handleSubmit = () => {
    toast.success("Assessment created successfully");
    navigate("/dashboard");
  };

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
        <div className="ml-auto flex items-center gap-2">
          <AssessmentBlueprintDrawer chapters={chapters} sections={sections} />
          <Button variant="outline" onClick={() => setPreviewOpen(true)} className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Instructions */}
        <div className="space-y-1.5">
          <Label htmlFor="instructions" className="text-sm font-medium text-foreground">
            Instructions <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter any instructions for students..."
            className="bg-background min-h-[100px] resize-y"
            maxLength={2000}
          />
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              These instructions will appear at the beginning of the question paper.
            </p>
          </div>
        </div>

        <div className="border-t border-border -mx-6" />

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

      <AssessmentPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} data={previewData} />
    </div>
  );
}
