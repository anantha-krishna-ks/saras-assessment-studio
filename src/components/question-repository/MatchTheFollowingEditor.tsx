import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowRight, GripVertical } from "lucide-react";

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface MatchTheFollowingEditorProps {
  pairs: MatchPair[];
  onChange: (pairs: MatchPair[]) => void;
}

const createPair = (): MatchPair => ({
  id: crypto.randomUUID(),
  left: "",
  right: "",
});

const AutoTextarea = ({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "0";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none overflow-hidden text-sm border-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 px-1 py-1 placeholder:text-muted-foreground/50 ${className}`}
    />
  );
};

interface DraggableInputListProps {
  items: { id: string; text: string }[];
  prefix: "number" | "letter";
  placeholder: string;
  onTextChange: (index: number, value: string) => void;
  onReorder: (from: number, to: number) => void;
  label: string;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DraggableInputList = ({
  items,
  prefix,
  placeholder,
  onTextChange,
  onReorder,
  label,
}: DraggableInputListProps) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      onReorder(dragIdx, overIdx);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-2 flex-1 min-w-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const badge = prefix === "letter" ? LETTERS[i] ?? `${i + 1}` : `${i + 1}`;
          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragIdx(i)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIdx(i);
              }}
              onDragEnd={handleDragEnd}
              className={`flex items-start gap-1.5 rounded-lg border border-border bg-background px-1.5 py-1 transition-all group
                ${dragIdx === i ? "opacity-30" : ""}
                ${overIdx === i && dragIdx !== i ? "ring-2 ring-primary/30" : ""}`}
            >
              <GripVertical className="w-3.5 h-3.5 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 group-hover:text-muted-foreground/70 mt-1.5" />
              <span className="text-[11px] font-bold text-muted-foreground/50 shrink-0 w-4 text-center select-none mt-1.5">
                {badge}
              </span>
              <AutoTextarea
                value={item.text}
                onChange={(val) => onTextChange(i, val)}
                placeholder={`${placeholder} ${badge}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MatchTheFollowingEditor = ({ pairs, onChange }: MatchTheFollowingEditorProps) => {
  const [rows, setRows] = useState<MatchPair[]>(() =>
    pairs.length > 0 ? pairs : [createPair(), createPair()]
  );

  const [matchOrder, setMatchOrder] = useState<{ id: string; text: string }[]>(() =>
    rows.map((r) => ({ id: r.id, text: r.right }))
  );

  const syncAll = useCallback(
    (newRows: MatchPair[], newMatchOrder?: { id: string; text: string }[]) => {
      setRows(newRows);
      if (newMatchOrder) setMatchOrder(newMatchOrder);
      onChange(newRows);
    },
    [onChange]
  );

  const items = rows.map((r) => ({ id: r.id, text: r.left }));
  const canDelete = rows.length > 2;

  const handleLeftChange = (index: number, value: string) => {
    const updated = rows.map((r, i) => (i === index ? { ...r, left: value } : r));
    syncAll(updated);
  };

  const handleRightChange = (index: number, value: string) => {
    const newMatch = matchOrder.map((m, i) => (i === index ? { ...m, text: value } : m));
    setMatchOrder(newMatch);
    const updated = rows.map((r) => {
      const match = newMatch.find((m) => m.id === r.id);
      return match ? { ...r, right: match.text } : r;
    });
    syncAll(updated, newMatch);
  };

  const handleReorderItems = (from: number, to: number) => {
    const reordered = [...rows];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    syncAll(reordered);
  };

  const handleReorderMatches = (from: number, to: number) => {
    const reordered = [...matchOrder];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setMatchOrder(reordered);
  };

  const handleAdd = () => {
    const newPair = createPair();
    const newRows = [...rows, newPair];
    const newMatch = [...matchOrder, { id: newPair.id, text: "" }];
    syncAll(newRows, newMatch);
  };

  const handleDeleteItem = (index: number) => {
    if (!canDelete) return;
    const removedId = rows[index].id;
    const newRows = rows.filter((_, i) => i !== index);
    const newMatch = matchOrder.filter((m) => m.id !== removedId);
    syncAll(newRows, newMatch);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <DraggableInputList
          items={items}
          prefix="number"
          placeholder="Item"
          onTextChange={handleLeftChange}
          onReorder={handleReorderItems}
          label="Items"
        />

        <div className="flex flex-col pt-8 gap-[0.45rem]">
          {rows.map((_, i) => (
            <div key={i} className="h-[2.375rem] flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
            </div>
          ))}
        </div>

        <DraggableInputList
          items={matchOrder}
          prefix="letter"
          placeholder="Match"
          onTextChange={handleRightChange}
          onReorder={handleReorderMatches}
          label="Matches"
        />

        <div className="flex flex-col pt-8 gap-[0.45rem]">
          {rows.map((r, i) => (
            <div key={r.id} className="h-[2.375rem] flex items-center justify-center">
              {canDelete ? (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(i)}
                  className="p-1 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title={`Delete pair ${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="w-5" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Button
          type="button"
          variant="default"
          size="sm"
          className="h-10 text-sm gap-2 font-medium px-8"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Add Pair
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {rows.length} {rows.length === 1 ? "pair" : "pairs"} · Drag to reorder
      </p>
    </div>
  );
};

export default MatchTheFollowingEditor;
