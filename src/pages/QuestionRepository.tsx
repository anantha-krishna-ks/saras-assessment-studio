import { useNavigate } from "react-router-dom";
import { ChevronLeft, BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function QuestionRepository() {
  const navigate = useNavigate();

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
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Question Repository</h1>
          <p className="text-sm text-muted-foreground">
            Browse, organize, and reuse your saved questions
          </p>
        </div>
        <Button className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      <Card className="p-12 rounded-3xl border border-border/70 bg-card shadow-soft-xs">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-base font-medium text-foreground">
            Your repository is empty
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Saved questions from your assessments will appear here. You can also add
            questions directly to build a reusable bank.
          </p>
        </div>
      </Card>
    </div>
  );
}
