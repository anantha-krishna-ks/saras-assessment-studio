import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id: string;
  title: string;
  questionCount: number;
  marks: number;
}

const types = ["PA1", "PA2", "Mid-term", "Final Exam", "Unit Test 1", "Unit Test 2", "Unit Test 3"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function CreateAssessment() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([
    { id: crypto.randomUUID(), title: "Section A", questionCount: 5, marks: 10 },
  ]);

  const totalQuestions = sections.reduce((s, x) => s + x.questionCount, 0);
  const totalMarks = sections.reduce((s, x) => s + x.marks, 0);

  function addSection() {
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        title: `Section ${String.fromCharCode(65 + sections.length)}`,
        questionCount: 5,
        marks: 10,
      },
    ]);
  }

  function updateSection(id: string, patch: Partial<Section>) {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function removeSection(id: string) {
    setSections(sections.filter((s) => s.id !== id));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Assessment saved as draft");
    setTimeout(() => navigate("/dashboard"), 600);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto">
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
            <p className="text-[13px] text-muted-foreground mt-1">Set up a new question paper with sections.</p>
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

          <div className="space-y-1.5">
            <Label className="text-[12px]">Instructions (optional)</Label>
            <Textarea rows={3} placeholder="Add any instructions for reviewers or students..." className="rounded-xl resize-none" />
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border border-border shadow-soft-xs">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[15px] text-foreground">Sections</h2>
            <p className="text-[12px] text-muted-foreground">Break the paper into sections.</p>
          </div>

          <div className="flex items-center gap-5">
            <InlineStat label="Sections" value={sections.length.toString()} />
            <div className="h-8 w-px bg-border" />
            <InlineStat label="Questions" value={totalQuestions.toString()} />
            <div className="h-8 w-px bg-border" />
            <InlineStat label="Marks" value={totalMarks.toString()} />
            <Button type="button" variant="outline" size="sm" className="rounded-lg h-9 ml-2" onClick={addSection}>
              <Plus className="h-4 w-4 mr-1.5" /> Add section
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {sections.map((s, idx) => (
            <div
              key={s.id}
              className="grid grid-cols-12 gap-3 items-end p-3 rounded-xl border border-border bg-secondary/30"
            >
              <div className="col-span-12 md:col-span-1 flex md:block items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary text-[13px]">
                  {idx + 1}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 space-y-1">
                <Label className="text-[11px]">Section title</Label>
                <Input
                  value={s.title}
                  onChange={(e) => updateSection(s.id, { title: e.target.value })}
                  className="h-9 rounded-lg bg-card"
                />
              </div>
              <div className="col-span-6 md:col-span-2 space-y-1">
                <Label className="text-[11px]">Questions</Label>
                <Input
                  type="number"
                  min={1}
                  value={s.questionCount}
                  onChange={(e) => updateSection(s.id, { questionCount: Number(e.target.value) })}
                  className="h-9 rounded-lg bg-card"
                />
              </div>
              <div className="col-span-6 md:col-span-2 space-y-1">
                <Label className="text-[11px]">Marks</Label>
                <Input
                  type="number"
                  min={1}
                  value={s.marks}
                  onChange={(e) => updateSection(s.id, { marks: Number(e.target.value) })}
                  className="h-9 rounded-lg bg-card"
                />
              </div>
              <div className="col-span-12 md:col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeSection(s.id)}
                  disabled={sections.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
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

function InlineStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-[18px] text-foreground leading-tight">{value}</div>
    </div>
  );
}
