import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SectionPanel from "@/components/assessment/SectionPanel";
import { createSection, type Section } from "@/constants/assessmentSectionData";

export default function CreateAssessmentV2() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([createSection("A")]);

  const handleSubmit = () => {
    toast.success("Assessment created successfully");
    navigate("/dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/dashboard")} aria-label="Go back">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Create Assessment</h1>
          <p className="text-sm text-muted-foreground">Build the sections and questions for your assessment</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <SectionPanel sections={sections} onChange={setSections} />

        <div className="flex justify-end pt-6 mt-6 border-t border-border">
          <Button onClick={handleSubmit} className="px-8">Create Assessment</Button>
        </div>
      </div>
    </div>
  );
}
