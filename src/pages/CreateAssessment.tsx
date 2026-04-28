import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

const types = ["PA1", "PA2", "Mid-term", "Final Exam", "Unit Test 1", "Unit Test 2", "Unit Test 3"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
const classes = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const chapterOptions = [
  "Chapter 1 — Real Numbers",
  "Chapter 2 — Polynomials",
  "Chapter 3 — Pair of Linear Equations",
  "Chapter 4 — Quadratic Equations",
  "Chapter 5 — Arithmetic Progressions",
  "Chapter 6 — Triangles",
];
const teachers = [
  "Mr. Rajesh Kumar",
  "Ms. Priya Menon",
  "Mr. Arun Verma",
  "Ms. Kavita Iyer",
  "Mr. Sandeep Patel",
  "Ms. Neha Reddy",
  "Mr. Vikram Singh",
];

export default function CreateAssessment() {
  const navigate = useNavigate();
  const [hours, setHours] = useState<number | "">(1);
  const [minutes, setMinutes] = useState<number | "">(30);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Assessment created successfully", {
      description:
        "The question paper has been assigned to the selected teacher. They’ll be notified to begin preparation.",
    });
    navigate("/dashboard");
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-6xl mx-auto">
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="text-sm text-muted-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
        <div className="mt-2 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[26px] text-foreground">Create Assessment</h1>
            <p className="text-sm text-muted-foreground mt-1">Set up a new question paper.</p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-xl bg-primary hover:bg-primary-hover">
              <Send className="h-4 w-4 mr-2" /> Assign Assessment
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-8 rounded-2xl border border-border shadow-soft-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
          <FieldSelect label="Type of Test" required placeholder="Select type of test" options={types} />
          <FieldSelect label="Class" required placeholder="Select class" options={classes} />
          <FieldSelect label="Subject" required placeholder="Select subject" options={subjects} />

          <FieldSelect label="Chapters" required placeholder="Select chapters" options={chapterOptions} />

          <Field label="Total Marks" required>
            <Input
              type="number"
              min={1}
              placeholder="Enter total marks"
              className="h-11 rounded-xl"
              required
            />
          </Field>

          <Field label="Duration" required>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  min={0}
                  value={hours}
                  onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
                  className="h-11 rounded-xl pr-10"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  hr
                </span>
              </div>
              <div className="relative flex-1">
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value === "" ? "" : Number(e.target.value))}
                  className="h-11 rounded-xl pr-12"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  min
                </span>
              </div>
            </div>
          </Field>

          <FieldSelect
            label="Teacher assigned for QP"
            required
            placeholder="Select teacher"
            options={teachers}
          />

        </div>
      </Card>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

function FieldSelect({
  label,
  required,
  placeholder,
  options,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  options: string[];
}) {
  return (
    <Field label={label} required={required}>
      <Select>
        <SelectTrigger className="h-11 rounded-xl">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
