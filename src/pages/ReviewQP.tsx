import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Clock,
  FileText,
  MessageSquarePlus,
  RotateCcw,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sampleQP } from "@/data/sampleQP";
import { cn } from "@/lib/utils";

export default function ReviewQP() {
  const navigate = useNavigate();
  const qp = sampleQP;

  const [comments, setComments] = useState<Record<string, string>>({});
  const [openCommentFor, setOpenCommentFor] = useState<string | null>(null);
  const [draftComment, setDraftComment] = useState("");
  const [revertOpen, setRevertOpen] = useState(false);
  const [revertNote, setRevertNote] = useState("");

  const totalQuestions = qp.sections.reduce((s, sec) => s + sec.questions.length, 0);
  const commentCount = Object.values(comments).filter((c) => c.trim().length > 0).length;

  const openComment = (qid: string) => {
    setDraftComment(comments[qid] ?? "");
    setOpenCommentFor(qid);
  };

  const saveComment = () => {
    if (!openCommentFor) return;
    setComments((prev) => ({ ...prev, [openCommentFor]: draftComment.trim() }));
    setOpenCommentFor(null);
    setDraftComment("");
    toast.success("Comment saved", { description: "Your feedback has been attached to this question." });
  };

  const handleAccept = () => {
    toast.success("Question paper accepted", {
      description: `${qp.title} has been approved and is ready to be scheduled.`,
    });
    navigate("/dashboard");
  };

  const handleRevert = () => {
    if (!revertNote.trim() && commentCount === 0) {
      toast.error("Please add a note or comment", {
        description: "Share what needs revision so the teacher can act on it.",
      });
      return;
    }
    toast.success("Sent back to subject teacher", {
      description: `${qp.teacher} will be notified with your ${commentCount} comment${commentCount === 1 ? "" : "s"} and revision note.`,
    });
    setRevertOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to dashboard
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl bg-background"
            onClick={() => setRevertOpen(true)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Revert to teacher
          </Button>
          <Button
            className="rounded-xl bg-primary hover:bg-primary-hover"
            onClick={handleAccept}
          >
            <Check className="h-4 w-4 mr-2" />
            Accept QP
          </Button>
        </div>
      </div>

      {/* Header card */}
      <Card className="p-6 rounded-2xl border border-border shadow-soft-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full font-normal">
                {qp.type}
              </Badge>
              <Badge variant="secondary" className="rounded-full font-normal">
                {qp.grade}
              </Badge>
              <Badge className="rounded-full font-normal bg-primary-soft text-primary hover:bg-primary-soft">
                In Review
              </Badge>
            </div>
            <h1 className="text-[22px] text-foreground mt-3">{qp.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {qp.teacher}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {qp.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> {totalQuestions} questions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5" /> {qp.totalMarks} marks
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Comments added</div>
            <div className="text-[26px] text-foreground leading-tight">
              {commentCount}
              <span className="text-base text-muted-foreground"> / {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 pt-5 border-t border-border">
          <div className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
            General Instructions
          </div>
          <ul className="space-y-1 text-sm text-foreground/80 list-decimal list-inside marker:text-muted-foreground">
            {qp.generalInstructions.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {qp.sections.map((section) => (
          <div key={section.name}>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-[16px] text-foreground">{section.name}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {section.questions.length} questions
              </div>
            </div>

            <Card className="rounded-2xl border border-border shadow-soft-xs divide-y divide-border overflow-hidden">
              {section.questions.map((q) => {
                const qid = `${section.name}-${q.number}`;
                const hasComment = comments[qid]?.trim().length > 0;
                return (
                  <div
                    key={qid}
                    className={cn(
                      "p-5 transition-colors",
                      hasComment ? "bg-primary-soft/30" : "hover:bg-secondary/40"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm text-foreground">
                        {q.number}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {q.type && (
                            <span className="text-sm uppercase tracking-wide text-muted-foreground">
                              {q.type}
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground">
                            · {q.marks} mark{q.marks > 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-[14.5px] text-foreground leading-relaxed">
                          {q.text}
                        </p>

                        {q.options && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className="text-sm text-foreground/80 px-3 py-2 rounded-lg border border-border bg-background"
                              >
                                <span className="text-muted-foreground mr-2">
                                  {String.fromCharCode(65 + i)}.
                                </span>
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {hasComment && (
                          <div className="mt-3 p-3 rounded-lg border border-primary/20 bg-background">
                            <div className="text-sm uppercase tracking-wide text-primary mb-1">
                              HOD Comment
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                              {comments[qid]}
                            </p>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-muted-foreground hover:text-primary shrink-0"
                        onClick={() => openComment(qid)}
                      >
                        <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                        {hasComment ? "Edit" : "Comment"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        ))}
      </div>

      {/* Sticky bottom action bar */}
      <div className="sticky bottom-4 z-10">
        <Card className="p-3 pl-5 rounded-2xl border border-border shadow-soft-sm flex items-center justify-between gap-4 bg-background/95 backdrop-blur">
          <div className="text-sm text-muted-foreground">
            {commentCount > 0
              ? `${commentCount} comment${commentCount === 1 ? "" : "s"} added — ready to share with ${qp.teacher.split(" ").slice(-1)[0]}.`
              : "Review each question, add comments, then accept or revert."}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl bg-background"
              onClick={() => setRevertOpen(true)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Revert
            </Button>
            <Button
              className="rounded-xl bg-primary hover:bg-primary-hover"
              onClick={handleAccept}
            >
              <Check className="h-4 w-4 mr-2" />
              Accept QP
            </Button>
          </div>
        </Card>
      </div>

      {/* Comment dialog */}
      <Dialog open={openCommentFor !== null} onOpenChange={(o) => !o && setOpenCommentFor(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add comment</DialogTitle>
            <DialogDescription>
              Share specific feedback for the subject teacher on this question.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={draftComment}
            onChange={(e) => setDraftComment(e.target.value)}
            placeholder="e.g. Rephrase the question for clarity, or adjust difficulty…"
            className="min-h-[120px] rounded-xl"
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenCommentFor(null)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary-hover"
              onClick={saveComment}
              disabled={!draftComment.trim()}
            >
              Save comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revert dialog */}
      <Dialog open={revertOpen} onOpenChange={setRevertOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Revert to subject teacher</DialogTitle>
            <DialogDescription>
              {qp.teacher} will receive your {commentCount} per-question comment
              {commentCount === 1 ? "" : "s"} along with an overall revision note.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={revertNote}
            onChange={(e) => setRevertNote(e.target.value)}
            placeholder="Overall feedback or revision instructions…"
            className="min-h-[120px] rounded-xl"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRevertOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary-hover" onClick={handleRevert}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Send back for revision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
