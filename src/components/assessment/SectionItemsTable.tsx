import { useState } from "react";
import Lottie from "lottie-react";
import emptyAnimation from "@/assets/empty-section-lottie.json";
import { GripVertical, Trash2, GitBranch, Split, MoreHorizontal, CornerDownRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SectionItem, ItemType } from "@/constants/assessmentSectionData";
import { ITEM_TYPES } from "@/constants/assessmentSectionData";

interface SectionItemsTableProps {
  items: SectionItem[];
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onAddSubItem?: (parentId: string, type: ItemType) => void;
  onAddOrItem?: (targetId: string, type: ItemType) => void;
}

const toRoman = (value: number) => {
  const numerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  return numerals[value - 1] ?? `${value}`;
};

const getSubQuestionLabel = (index: number, style: SectionItem["subQuestionStyle"] = "alpha") =>
  style === "roman" ? `${toRoman(index + 1)}.` : `${String.fromCharCode(97 + index)}.`;

const ItemActions = ({
  hasOr,
  onRemove,
  onAddSub,
  onAddOr,
}: {
  hasOr: boolean;
  onRemove: () => void;
  onAddSub?: (type: ItemType) => void;
  onAddOr?: (type: ItemType) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="p-1 rounded text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover/row:opacity-100"
        title="Actions"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      {onAddSub && (
        <>
          <DropdownMenuItem disabled className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-1">
            Add Sub Question
          </DropdownMenuItem>
          {ITEM_TYPES.map((type) => (
            <DropdownMenuItem key={`sub-${type}`} onClick={() => onAddSub(type)} className="text-sm pl-6">
              <GitBranch className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              {type}
            </DropdownMenuItem>
          ))}
        </>
      )}
      {onAddOr && !hasOr && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-xs font-medium text-muted-foreground uppercase tracking-wider py-1">
            Add OR Alternative
          </DropdownMenuItem>
          {ITEM_TYPES.map((type) => (
            <DropdownMenuItem key={`or-${type}`} onClick={() => onAddOr(type)} className="text-sm pl-6">
              <Split className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              {type}
            </DropdownMenuItem>
          ))}
        </>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive text-sm">
        <Trash2 className="w-3.5 h-3.5 mr-2" />
        Remove
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const InlineRow = ({
  item,
  label,
  onUpdateItem,
  onRemoveItem,
  selectedIds,
  onToggleSelect,
}: {
  item: SectionItem;
  label: string;
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}) => (
  <div className="grid grid-cols-[32px_40px_1fr_74px_36px] items-center gap-2 px-2 py-2 group/row">
    <div className="flex justify-center">
      <Checkbox
        checked={selectedIds.has(item.id)}
        onCheckedChange={() => onToggleSelect(item.id)}
        className="h-3.5 w-3.5"
      />
    </div>
    <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    <div className="pr-2">
      <Input
        value={item.question}
        onChange={(e) => onUpdateItem(item.id, { question: e.target.value })}
        placeholder="Enter question text..."
        className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
      />
    </div>
    <div className="flex justify-center">
      <Input
        type="number"
        value={item.score}
        onChange={(e) => onUpdateItem(item.id, { score: Number(e.target.value) || 0 })}
        className="h-7 w-14 text-xs text-center bg-transparent border-border"
        min={0}
        max={100}
      />
    </div>
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => onRemoveItem(item.id)}
        className="p-0.5 rounded text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover/row:opacity-100"
        title="Remove"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
);

const QuestionRow = ({
  item,
  label,
  hasOr = false,
  onUpdateItem,
  onRemoveItem,
  selectedIds,
  onToggleSelect,
  onAddSubItem,
  onAddOrItem,
  showDragHandle = false,
}: {
  item: SectionItem;
  label: string;
  hasOr?: boolean;
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onAddSubItem?: (parentId: string, type: ItemType) => void;
  onAddOrItem?: (targetId: string, type: ItemType) => void;
  showDragHandle?: boolean;
}) => (
  <div className="grid grid-cols-[36px_52px_1fr_88px_112px_40px] items-center gap-2 px-3 py-3 group/row hover:bg-muted/20 transition-colors">
    <div className="flex justify-center">
      <Checkbox checked={selectedIds.has(item.id)} onCheckedChange={() => onToggleSelect(item.id)} />
    </div>
    <div className="flex items-center gap-0.5 justify-start">
      <GripVertical className={`w-3.5 h-3.5 -ml-1 ${showDragHandle ? "text-muted-foreground/30 cursor-grab active:cursor-grabbing group-hover/row:text-muted-foreground/60" : "text-muted-foreground/20"}`} aria-hidden="true" focusable="false" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
    <div className="pl-2 pr-2 min-w-0">
      <Input
        value={item.question}
        onChange={(e) => onUpdateItem(item.id, { question: e.target.value })}
        placeholder="Enter question text..."
        className="h-8 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
      />
      {item.taxonomy && (
        <div className="mt-1">
          <span className="inline-flex items-center text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 uppercase tracking-wide">
            {item.taxonomy}
          </span>
        </div>
      )}
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium text-muted-foreground">Marks</span>
      <Input
        type="number"
        value={item.score}
        onChange={(e) => onUpdateItem(item.id, { score: Number(e.target.value) || 0 })}
        className="h-8 w-16 text-sm text-center bg-transparent border-border"
        min={0}
        max={100}
      />
    </div>
    <div className="flex justify-center min-w-0">
      <span className="text-xs text-muted-foreground bg-muted/60 rounded-md px-2 py-1 truncate max-w-[110px]">
        {item.type}
      </span>
    </div>
    <div className="flex justify-center">
      <ItemActions
        hasOr={hasOr}
        onRemove={() => onRemoveItem(item.id)}
        onAddSub={onAddSubItem ? (type) => onAddSubItem(item.id, type) : undefined}
        onAddOr={onAddOrItem ? (type) => onAddOrItem(item.id, type) : undefined}
      />
    </div>
  </div>
);

const QuestionBlock = ({
  item,
  index,
  onUpdateItem,
  onRemoveItem,
  selectedIds,
  onToggleSelect,
  onAddSubItem,
  onAddOrItem,
  dragHandlers,
}: {
  item: SectionItem;
  index: number;
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onRemoveItem: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onAddSubItem?: (parentId: string, type: ItemType) => void;
  onAddOrItem?: (targetId: string, type: ItemType) => void;
  dragHandlers: {
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isOver: boolean;
  };
}) => {
  const hasSubs = item.subItems && item.subItems.length > 0;
  const hasOr = !!item.orItem;

  return (
    <div
      draggable
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDragEnd={dragHandlers.onDragEnd}
      className={`rounded-lg border border-border bg-card shadow-sm transition-all overflow-hidden
        ${dragHandlers.isDragging ? "opacity-30" : ""}
        ${dragHandlers.isOver ? "border-primary/40 bg-primary/5" : ""}`}
    >
      <QuestionRow
        item={item}
        label={hasOr ? `${index + 1}.A` : `${index + 1}`}
        hasOr={hasOr}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
        onAddSubItem={onAddSubItem}
        onAddOrItem={onAddOrItem}
        showDragHandle
      />

      {hasSubs && (
        <div className="ml-12 mr-4 mb-3 space-y-2">
          {hasSubs && (
            <div className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-3 py-1.5 bg-muted/40 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-3 h-3 text-muted-foreground" aria-hidden="true" focusable="false" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Sub-Questions
                  </span>
                </div>
                <Select
                  value={item.subQuestionStyle ?? "alpha"}
                  onValueChange={(value: "alpha" | "roman") => onUpdateItem(item.id, { subQuestionStyle: value })}
                >
                  <SelectTrigger className="h-7 w-36 bg-background text-xs" aria-label="Sub-question numbering style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alpha">a, b, c...</SelectItem>
                    <SelectItem value="roman">i, ii, iii...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="divide-y divide-border/30">
                {item.subItems!.map((sub, si) => (
                  <InlineRow
                    key={sub.id}
                    item={sub}
                    label={getSubQuestionLabel(si, item.subQuestionStyle)}
                    onUpdateItem={onUpdateItem}
                    onRemoveItem={onRemoveItem}
                    selectedIds={selectedIds}
                    onToggleSelect={onToggleSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hasOr && (
        <div className="border-t border-border/70 bg-primary/[0.02]">
          <div className="flex items-center gap-3 px-4 py-2" aria-label="OR divider">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/35 to-primary/10" />
            <span className="rounded-sm border border-primary/25 bg-background px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary shadow-[inset_0_1px_3px_hsl(var(--primary)/0.12)]">
              OR
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/35 to-primary/10" />
          </div>
          <div className="pb-1">
            <QuestionRow
              item={item.orItem!}
              label={`${index + 1}.B`}
              hasOr
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
              onAddSubItem={onAddSubItem}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SectionItemsTable = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onReorder,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onAddSubItem,
  onAddOrItem,
}: SectionItemsTableProps) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      onReorder(dragIdx, overIdx);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  if (items.length === 0) {
    return (
      <div className="py-10 flex flex-col items-center justify-center gap-2">
        <Lottie
          animationData={emptyAnimation}
          loop
          autoplay
          style={{ width: 180, height: 130 }}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">No items yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click <span className="font-medium text-primary">Add Items</span> from the toolbar to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 px-1">
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Checkbox checked={items.every((it) => selectedIds.has(it.id))} onCheckedChange={onToggleAll} />
          Select all items
        </label>
        <span className="text-xs text-muted-foreground tabular-nums">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>
      {items.map((item, i) => (
        <QuestionBlock
          key={item.id}
          item={item}
          index={i}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          onAddSubItem={onAddSubItem}
          onAddOrItem={onAddOrItem}
          dragHandlers={{
            onDragStart: () => setDragIdx(i),
            onDragOver: (e) => { e.preventDefault(); setOverIdx(i); },
            onDragEnd: handleDragEnd,
            isDragging: dragIdx === i,
            isOver: overIdx === i && dragIdx !== i,
          }}
        />
      ))}
    </div>
  );
};

export default SectionItemsTable;
