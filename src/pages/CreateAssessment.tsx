import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const types = ["PA1", "PA2", "Mid-term", "Final Exam", "Unit Test 1", "Unit Test 2", "Unit Test 3"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function CreateAssessment() {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(20);
  const [totalMarks, setTotalMarks] = useState(50);
  const [duration, setDuration] = useState(60);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Assessment saved as draft");
    setTimeout(() => navigate("/dashboard"), 600);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="text-[13px] text-muted-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
        <div className="mt-2 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[26px] text-foreground">Create Assessment</h1>
            <p className="text-[13px] text-muted-foreground mt-1">Set up a new question paper.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="rounded-xl">
              <Save className="h-4 w-4 mr-2" /> Save Draft
            </Button>
            <Button type="submit" className="rounded-xl bg-primary hover:bg-primary-hover">
              Publish for Review
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-6 rounded-2xl border border-border shadow-soft-xs space-y-5">
        <div>
          <h2 className="text-[15px] text-foreground">Basic details</h2>
          <p className="text-[12px] text-muted-foreground">Title, type, subject and grade.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[12px]">Assessment title</Label>
            <Input required placeholder="e.g. Periodic Assessment 1 — Mathematics" className="h-10 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldSelect label="Type" placeholder="Select type" options={types} />
            <FieldSelect label="Subject" placeholder="Select subject" options={subjects} />
            <FieldSelect label="Grade" placeholder="Select grade" options={grades} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px]">Scheduled date</Label>
              <Input required type="date" className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px]">Review deadline</Label>
              <Input required type="date" className="h-10 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px]">No. of questions</Label>
              <Input
                type="number"
                min={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px]">Total marks</Label>
              <Input
                type="number"
                min={1}
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px]">Duration (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px]">Instructions (optional)</Label>
            <Textarea
              rows={4}
              placeholder="Add any instructions for reviewers or students..."
              className="rounded-xl resize-none"
            />
          </div>
        </div>
      </Card>
    </form>
  );
}

function FieldSelect({ label, placeholder, options }: { label: string; placeholder: string; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px]">{label}</Label>
      <Select>
        <SelectTrigger className="h-10 rounded-xl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
