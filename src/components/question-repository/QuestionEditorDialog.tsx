import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MCQOptionsEditor from "./MCQOptionsEditor";
import ImageUploadEditor from "./ImageUploadEditor";
import FillInBlankEditor from "./FillInBlankEditor";
import MatchTheFollowingEditor, { type MatchPair } from "./MatchTheFollowingEditor";
import AssertionReasoningEditor, { type AssertionReasonPair, createDefaultPair } from "./AssertionReasoningEditor";
import { QUESTION_TYPE_LABELS, type QuestionType } from "./QuestionCard";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_MARKS = "1.00";

const createDefaultPairs = (): MatchPair[] =>
  Array.from({ length: 4 }, () => ({ id: crypto.randomUUID(), left: "", right: "" }));

export interface QuestionData {
  id: string;
  type: QuestionType;
  questionText: string;
  answerText?: string;
  trueFalseAnswer?: boolean | null;
  hasImage?: boolean;
  imageData?: string | null;
  marks: string;
  label: string;
  includeWordBank?: boolean;
  matchPairs?: MatchPair[];
  assertionPairs?: AssertionReasonPair[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: QuestionType;
  onSave: (data: QuestionData) => void;
  editData?: QuestionData | null;
}

const QuestionEditorDialog = ({ open, onOpenChange, type, onSave, editData }: Props) => {
  const [questionText, setQuestionText] = useState(editData?.questionText ?? "");
  const [marks, setMarks] = useState(editData?.marks ?? INITIAL_MARKS);
  const [activeTab, setActiveTab] = useState<"question" | "answer" | "image">("question");
  const [answerText, setAnswerText] = useState(editData?.answerText ?? "");
  const [hasImage, setHasImage] = useState(editData?.hasImage ?? false);
  const [imageData, setImageData] = useState<string | null>(editData?.imageData ?? null);
  const [includeWordBank, setIncludeWordBank] = useState(editData?.includeWordBank ?? false);
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>(editData?.matchPairs ?? createDefaultPairs());
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(editData?.trueFalseAnswer ?? null);
  const [assertionPairs, setAssertionPairs] = useState<AssertionReasonPair[]>(
    editData?.assertionPairs ?? [createDefaultPair()]
  );

  const handleImageChange = useCallback((newHasImage: boolean, newImageData: string | null) => {
    setHasImage(newHasImage);
    setImageData(newImageData);
  }, []);

  const resetState = useCallback(() => {
    setQuestionText("");
    setAnswerText("");
    setMarks(INITIAL_MARKS);
    setActiveTab("question");
    setHasImage(false);
    setImageData(null);
    setIncludeWordBank(false);
    setMatchPairs(createDefaultPairs());
    setTrueFalseAnswer(null);
    setAssertionPairs([createDefaultPair()]);
  }, []);

  const handleSave = useCallback(() => {
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    onSave({
      id: editData?.id ?? crypto.randomUUID(),
      type,
      questionText,
      answerText,
      trueFalseAnswer: type === "true-false" ? trueFalseAnswer : undefined,
      hasImage,
      imageData,
      marks,
      label: editData?.label ?? labels[0],
      includeWordBank: type === "fill-blank" ? includeWordBank : undefined,
      matchPairs: type === "matching" ? matchPairs : undefined,
      assertionPairs: type === "assertion-reasoning" ? assertionPairs : undefined,
    });
    resetState();
  }, [type, questionText, answerText, trueFalseAnswer, hasImage, imageData, marks, editData, onSave, includeWordBank, matchPairs, assertionPairs, resetState]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (!val) resetState();
      onOpenChange(val);
    },
    [onOpenChange, resetState]
  );

  const renderQuestionContent = () => {
    if (type === "fill-blank") {
      return (
        <FillInBlankEditor
          value={questionText}
          onChange={setQuestionText}
          includeWordBank={includeWordBank}
          onWordBankChange={setIncludeWordBank}
        />
      );
    }
    if (type === "true-false") {
      return (
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="tf-statement" className="text-sm font-medium text-foreground">Statement</Label>
            <Textarea
              id="tf-statement"
              placeholder="Type your true/false statement here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="min-h-[100px] resize-y text-sm"
            />
          </div>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Correct Answer</legend>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: true, label: "True" },
                { value: false, label: "False" },
              ].map(({ value, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTrueFalseAnswer(value)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border-2 py-4 text-sm font-semibold transition-all",
                    trueFalseAnswer === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      );
    }
    if (type === "matching") {
      return <MatchTheFollowingEditor pairs={matchPairs} onChange={setMatchPairs} />;
    }
    if (type === "assertion-reasoning") {
      return <AssertionReasoningEditor pairs={assertionPairs} onPairsChange={setAssertionPairs} />;
    }
    return (
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="question-text" className="text-sm font-medium text-foreground">Question</Label>
          <Textarea
            id="question-text"
            placeholder="Type your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="min-h-[120px] resize-y text-sm"
          />
        </div>
        {type === "multiple-choice" && <MCQOptionsEditor />}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editData ? "Edit" : "Add"} {QUESTION_TYPE_LABELS[type]} Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex items-center gap-4">
            <div className="space-y-1.5 w-32">
              <Label htmlFor="marks-input" className="text-sm font-medium text-foreground">Marks</Label>
              <Input
                id="marks-input"
                type="number"
                min="0"
                step="0.01"
                value={marks}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(val)) setMarks(val);
                }}
                onBlur={() => {
                  const num = parseFloat(marks);
                  setMarks(!isNaN(num) ? num.toFixed(2) : "1.00");
                }}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-foreground block">Type</span>
              <div className="h-9 px-3 flex items-center rounded-md border border-input bg-muted/40 text-sm text-foreground">
                {QUESTION_TYPE_LABELS[type]}
              </div>
            </div>
          </div>

          {type !== "assertion-reasoning" && (
            <div className="flex items-center gap-1 border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab("question")}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === "question" ? "border-primary text-primary" : "border-transparent text-foreground/70 hover:text-foreground"
                )}
              >
                {QUESTION_TYPE_LABELS[type]}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("image")}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5",
                  activeTab === "image" ? "border-primary text-primary" : "border-transparent text-foreground/70 hover:text-foreground"
                )}
              >
                <ImagePlus className="w-4 h-4" />
                Image
                {hasImage && <span className="w-2 h-2 rounded-full bg-primary" />}
              </button>
              {type !== "fill-blank" && type !== "true-false" && type !== "matching" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("answer")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                    activeTab === "answer" ? "border-primary text-primary" : "border-transparent text-foreground/70 hover:text-foreground"
                  )}
                >
                  Answer
                </button>
              )}
            </div>
          )}

          {activeTab === "image" ? (
            <ImageUploadEditor initialImage={imageData} onImageChange={handleImageChange} />
          ) : activeTab === "answer" ? (
            <div className="space-y-2">
              <Label htmlFor="answer-text" className="text-sm font-medium text-foreground">Answer</Label>
              <Textarea
                id="answer-text"
                placeholder="Type the answer here..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="min-h-[180px] resize-y text-sm"
              />
            </div>
          ) : (
            renderQuestionContent()
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {editData ? "Update" : "Save"} Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionEditorDialog;
