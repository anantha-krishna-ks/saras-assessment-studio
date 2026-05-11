import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, CalendarClock, Eye, Info, X, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SectionPanel from "@/components/assessment/SectionPanel";
import AssessmentBlueprintDrawer from "@/components/assessment/AssessmentBlueprintDrawer";
import AssessmentPreviewModal from "@/components/assessment/AssessmentPreviewModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { createSection, type Section, type SectionItem } from "@/constants/assessmentSectionData";
import { assessments as allAssessments, type Assessment } from "@/data/assessments";

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

  const [sendOpen, setSendOpen] = useState(false);

  const handleSubmit = () => {
    setSendOpen(true);
  };

  const handleConfirmSend = () => {
    setSendOpen(false);
    toast.success("Assessment sent to HOD for review");
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
          <h1 className="text-xl font-medium text-foreground truncate">
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
            onChange={(e) => {
              setInstructions(e.target.value);
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }
            }}
            placeholder="Enter any instructions for students..."
            className="bg-background resize-none overflow-hidden"
            maxLength={2000}
          />
          <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              These instructions will appear at the beginning of the question paper.
            </p>
          </div>
        </div>

        <div
          aria-hidden
          className="-mx-6 h-2 bg-muted/30 border-y border-border/80 shadow-[inset_0_2px_3px_hsl(var(--border)/0.45),inset_0_-2px_3px_hsl(var(--background)/0.9)]"
        />

        <SectionPanel sections={sections} onChange={setSections} />

        <div className="flex justify-end gap-2 pt-6 mt-6 border-t border-border">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button variant="outline" onClick={() => toast.success("Saved to draft")}>
            <Save className="w-4 h-4" />
            Save to draft
          </Button>
          <Button onClick={handleSubmit} className="px-8">
            <CheckCircle2 className="w-4 h-4" />
            Create Assessment
          </Button>
        </div>
      </div>

      <AssessmentPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} data={previewData} />

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Send to HOD for review?</DialogTitle>
            <DialogDescription className="text-center">
              Your assessment will be submitted to the HOD for approval. You won't be able to edit it
              until it's reviewed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={() => setSendOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSend}>
              <Send className="w-4 h-4" />
              Send to HOD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
