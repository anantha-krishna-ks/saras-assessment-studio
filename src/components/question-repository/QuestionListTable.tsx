import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, Image, Pencil, Trash2 } from "lucide-react";
import type { QuestionData } from "./QuestionEditorDialog";
import { QUESTION_TYPE_LABELS } from "./QuestionCard";
import { cn } from "@/lib/utils";

interface QuestionListTableProps {
  questions: QuestionData[];
  taxonomy?: string;
  onEdit: (question: QuestionData) => void;
  onDelete: (id: string) => void;
  onReorder: (questions: QuestionData[]) => void;
}

const QuestionListTable = ({
  questions,
  taxonomy,
  onEdit,
  onDelete,
  onReorder,
}: QuestionListTableProps) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    requestAnimationFrame(() => {
      if (dragNodeRef.current) dragNodeRef.current.style.opacity = "0.4";
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = "1";
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      const reordered = [...questions];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(overIndex, 0, moved);
      onReorder(reordered);
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNodeRef.current = null;
  }, [dragIndex, overIndex, questions, onReorder]);

  if (questions.length === 0) return null;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-[48px_1fr_80px_140px_120px_100px] items-center bg-primary text-primary-foreground px-3 py-2.5 text-xs font-medium uppercase tracking-wider">
        <span className="text-center">Sl No.</span>
        <span>Question</span>
        <span className="text-center">Marks</span>
        <span className="text-center">Type</span>
        <span className="text-center">Taxonomy</span>
        <span className="text-center">Action</span>
      </div>

      {questions.map((q, i) => (
        <div
          key={q.id}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          className={cn(
            "grid grid-cols-[48px_1fr_80px_140px_120px_100px] items-center px-3 py-3 border-b border-border last:border-b-0 transition-colors group cursor-grab active:cursor-grabbing",
            dragIndex === i && "opacity-40",
            overIndex === i && dragIndex !== i && "border-t-2 border-t-primary"
          )}
        >
          <span className="text-sm text-muted-foreground text-center font-medium">{i + 1}</span>
          <div className="flex items-start gap-2 pr-4">
            <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-sm text-foreground line-clamp-2">
              {q.questionText || (
                <span className="italic text-muted-foreground">No question text</span>
              )}
            </p>
            {q.hasImage && (
              <span className="shrink-0 ml-auto" title="Image attached">
                <Image className="w-4 h-4 text-primary" />
              </span>
            )}
          </div>
          <span className="text-sm text-foreground text-center font-medium">{q.marks}</span>
          <span className="text-xs text-muted-foreground text-center">
            {QUESTION_TYPE_LABELS[q.type] ?? q.type}
          </span>
          <span className="text-xs text-center">
            {taxonomy ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {taxonomy}
              </span>
            ) : (
              <span className="text-muted-foreground italic">—</span>
            )}
          </span>
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(q)}
              aria-label="Edit question"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive/70 hover:text-destructive"
              onClick={() => onDelete(q.id)}
              aria-label="Delete question"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionListTable;
