import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  X,
  GripVertical,
  LayoutGrid,
  Columns2,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LayoutMode = "grid" | "split" | "list";

interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const LAYOUT_OPTIONS: { mode: LayoutMode; label: string; icon: React.ElementType }[] = [
  { mode: "grid", label: "Grid (4-Col)", icon: LayoutGrid },
  { mode: "split", label: "Split (2-Col)", icon: Columns2 },
  { mode: "list", label: "List", icon: List },
];

const MCQOptionsEditor = () => {
  const [layout, setLayout] = useState<LayoutMode>("list");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [options, setOptions] = useState<MCQOption[]>(() =>
    Array.from({ length: 4 }, () => ({
      id: crypto.randomUUID(),
      text: "",
      isCorrect: false,
    }))
  );

  const handleTextChange = useCallback((id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  }, []);

  const handleToggleCorrect = useCallback(
    (id: string) => {
      setOptions((prev) =>
        prev.map((o) => {
          if (o.id === id) return { ...o, isCorrect: !o.isCorrect };
          if (!allowMultiple) return { ...o, isCorrect: false };
          return o;
        })
      );
    },
    [allowMultiple]
  );

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    if (dragIndex === dropIndex) return;
    setOptions((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setOptions((prev) => (prev.length <= 2 ? prev : prev.filter((o) => o.id !== id)));
  }, []);

  const handleAdd = useCallback(() => {
    setOptions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "", isCorrect: false },
    ]);
  }, []);

  const optionLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
          <Checkbox
            checked={allowMultiple}
            onCheckedChange={(v) => setAllowMultiple(!!v)}
          />
          Multiple correct answers
        </label>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {LAYOUT_OPTIONS.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                layout === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "gap-3",
          layout === "grid" && "grid grid-cols-2 xl:grid-cols-4",
          layout === "split" && "grid grid-cols-1 sm:grid-cols-2",
          layout === "list" && "flex flex-col"
        )}
      >
        {options.map((opt, i) => (
          <div
            key={opt.id}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
            className={cn(
              "flex items-center gap-2 group/opt rounded-lg border p-2 transition-colors",
              opt.isCorrect
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-background"
            )}
          >
            <div className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              <GripVertical className="w-4 h-4" />
            </div>
            <button
              onClick={() => handleToggleCorrect(opt.id)}
              className={cn(
                "shrink-0 w-7 h-7 rounded-md border-2 flex items-center justify-center text-xs font-bold transition-colors",
                opt.isCorrect
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground hover:border-primary/50"
              )}
              title="Mark as correct"
            >
              {optionLabels[i]}
            </button>
            <Input
              value={opt.text}
              onChange={(e) => handleTextChange(opt.id, e.target.value)}
              placeholder={`Option ${optionLabels[i]}`}
              className="flex-1 h-8 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-2"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive/70 hover:text-destructive opacity-0 group-hover/opt:opacity-100 transition-opacity"
              onClick={() => handleRemove(opt.id)}
              disabled={options.length <= 2}
              title="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={handleAdd}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Option
      </Button>
    </div>
  );
};

export default MCQOptionsEditor;
