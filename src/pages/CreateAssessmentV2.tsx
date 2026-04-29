import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, Layers, Info, Plus, Trash2, GripVertical, MoreHorizontal, Pencil, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TEST_TYPES = ["PA1", "PA2", "Mid-Term Exam", "Final Exam", "Unit Test"];
const CLASSES = ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"];
const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Hindi", "Computer Science"];
const CHAPTERS = [
  "Chapter 1: Number Systems","Chapter 2: Polynomials","Chapter 3: Coordinate Geometry","Chapter 4: Linear Equations",
  "Chapter 5: Triangles","Chapter 6: Quadrilaterals","Chapter 7: Areas","Chapter 8: Circles","Chapter 9: Constructions","Chapter 10: Statistics",
];
const ITEM_TYPES = ["Short Answer","Multiple Choice","True / False","Matching","Fill in the Blank","Assertion Reasoning"] as const;
type ItemType = typeof ITEM_TYPES[number];
const SECTION_LABELS = ["A","B","C","D","E","F","G","H"];
const INSTRUCTIONS_REQUIRED_TYPES = ["Final Exam", "Mid-Term Exam"];

interface SectionItem { id: string; question: string; score: number; type: ItemType; }
interface Section { id: string; label: string; description: string; items: SectionItem[]; }

const newId = () => crypto.randomUUID();
const createSection = (label: string): Section => ({ id: newId(), label, description: "", items: [] });
const createItem = (type: ItemType): SectionItem => ({ id: newId(), question: "", score: 1, type });

/* ── Lightweight inline multi-select (chapters) ── */
function MultiSelectChapters({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const toggle = (c: string) =>
    onChange(selected.includes(c) ? selected.filter((s) => s !== c) : [...selected, c]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left">
            {selected.length === 0 && <span className="text-muted-foreground">Select chapters</span>}
            {selected.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs px-2 py-0.5 gap-1">
                {c}
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); toggle(c); }}
                  className="cursor-pointer hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            ))}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-1 rounded-xl" align="start" style={{ width: "var(--radix-popover-trigger-width)" }}>
        <div className="max-h-64 overflow-y-auto">
          {CHAPTERS.map((c) => {
            const checked = selected.includes(c);
            return (
              <label key={c} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-accent cursor-pointer text-sm">
                <Checkbox checked={checked} onCheckedChange={() => toggle(c)} />
                <span>{c}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ── Add Items dropdown ── */
function AddItemsDropdown({ onAdd }: { onAdd: (type: ItemType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-1.5 h-8 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Items
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {ITEM_TYPES.map((t) => (
          <DropdownMenuItem key={t} onClick={() => onAdd(t)} className="text-sm">{t}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Single editable item row ── */
function ItemRow({
  item, index, onUpdate, onRemove, dragHandlers,
}: {
  item: SectionItem; index: number;
  onUpdate: (id: string, updates: Partial<SectionItem>) => void;
  onRemove: (id: string) => void;
  dragHandlers: {
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    isOver: boolean;
  };
}) {
  return (
    <div
      draggable
      onDragStart={dragHandlers.onDragStart}
      onDragOver={dragHandlers.onDragOver}
      onDragEnd={dragHandlers.onDragEnd}
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm transition-all",
        dragHandlers.isDragging && "opacity-30",
        dragHandlers.isOver && "border-primary/40 bg-primary/5"
      )}
    >
      <div className="grid grid-cols-[36px_1fr_140px_120px_36px] items-center gap-2 px-3 py-3 group/row">
        <div className="flex items-center gap-0.5">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 cursor-grab active:cursor-grabbing" />
          <span className="text-sm font-semibold text-foreground">{index + 1}</span>
        </div>
        <Input
          value={item.question}
          onChange={(e) => onUpdate(item.id, { question: e.target.value })}
          placeholder="Enter question text..."
          className="h-9 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
        />
        <Select value={item.type} onValueChange={(v: ItemType) => onUpdate(item.id, { type: v })}>
          <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ITEM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={item.score}
            onChange={(e) => onUpdate(item.id, { score: Number(e.target.value) || 0 })}
            min={0}
            max={100}
            className="h-9 text-sm text-center"
          />
          <span className="text-xs text-muted-foreground">marks</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="p-1.5 rounded text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-colors"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Sections panel ── */
function SectionsPanel({ sections, onChange }: { sections: Section[]; onChange: (s: Section[]) => void }) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const active = sections.find((s) => s.id === activeId) ?? null;

  const addSection = () => {
    const label = SECTION_LABELS[sections.length] ?? `${sections.length + 1}`;
    const s = createSection(label);
    onChange([...sections, s]);
    setActiveId(s.id);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) { toast.error("At least one section is required."); return; }
    const next = sections.filter((s) => s.id !== id);
    onChange(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
    toast.success("Section removed.");
  };

  const duplicateSection = (id: string) => {
    const src = sections.find((s) => s.id === id);
    if (!src) return;
    const label = SECTION_LABELS[sections.length] ?? `${sections.length + 1}`;
    const dup: Section = { id: newId(), label, description: src.description, items: src.items.map((it) => ({ ...it, id: newId() })) };
    const idx = sections.findIndex((s) => s.id === id);
    const next = [...sections];
    next.splice(idx + 1, 0, dup);
    onChange(next);
    setActiveId(dup.id);
    toast.success("Section duplicated.");
  };

  const startRename = (id: string) => {
    const s = sections.find((x) => x.id === id);
    if (!s) return;
    setEditingId(id);
    setEditingLabel(s.label);
  };

  const commitRename = () => {
    if (!editingId || !editingLabel.trim()) { setEditingId(null); return; }
    onChange(sections.map((s) => s.id === editingId ? { ...s, label: editingLabel.trim() } : s));
    setEditingId(null);
  };

  const updateActive = (updater: (s: Section) => Section) => {
    if (!active) return;
    onChange(sections.map((s) => s.id === active.id ? updater(s) : s));
  };

  const addItem = (type: ItemType) => updateActive((s) => ({ ...s, items: [...s.items, createItem(type)] }));
  const updateItem = (id: string, updates: Partial<SectionItem>) =>
    updateActive((s) => ({ ...s, items: s.items.map((it) => it.id === id ? { ...it, ...updates } : it) }));
  const removeItem = (id: string) =>
    updateActive((s) => ({ ...s, items: s.items.filter((it) => it.id !== id) }));

  const handleReorder = (from: number, to: number) => {
    if (!active || from === to) return;
    const reordered = [...active.items];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    updateActive((s) => ({ ...s, items: reordered }));
  };

  const totalScore = active?.items.reduce((sum, it) => sum + it.score, 0) ?? 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {sections.length} Section{sections.length !== 1 ? "s" : ""}
        </span>
        <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={addSection}>
          <Plus className="w-3.5 h-3.5" /> Add Section
        </Button>
      </div>

      {/* Section cards */}
      <div className="flex flex-wrap gap-3">
        {sections.map((sec, idx) => {
          const isActive = activeId === sec.id;
          const isEditing = editingId === sec.id;
          const secItems = sec.items.length;
          const secScore = sec.items.reduce((s, it) => s + it.score, 0);
          return (
            <div
              key={sec.id}
              onClick={() => { if (!isEditing) setActiveId(sec.id); }}
              className={cn(
                "relative group w-[164px] rounded-xl cursor-pointer transition-all duration-200 overflow-hidden",
                isActive
                  ? "bg-card border border-primary/30 shadow-[0_1px_8px_-2px_hsl(var(--primary)/0.12)]"
                  : "bg-card border border-border shadow-sm hover:border-muted-foreground/40 hover:shadow-md"
              )}
            >
              <div className={cn("h-[3px] w-full transition-colors", isActive ? "bg-primary" : "bg-muted")} />
              <div className="px-3.5 pt-2.5 pb-3">
                <div className="flex items-start justify-between mb-2.5">
                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1 mr-1">
                      <Input
                        autoFocus
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="h-6 text-xs px-1.5 w-full"
                      />
                      <button type="button" onClick={commitRename} className="text-primary"><Check className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <span className={cn("text-[13px] font-semibold truncate max-w-[80px]", isActive ? "text-primary" : "text-foreground")}>
                        {sec.label}
                      </span>
                    </div>
                  )}
                  {!isEditing && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1 rounded-md hover:bg-muted"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); startRename(sec.id); }}>
                          <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateSection(sec.id); }}>
                          <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); removeSection(sec.id); }}
                          className="text-destructive focus:text-destructive"
                          disabled={sections.length <= 1}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{secItems} item{secItems !== 1 ? "s" : ""}</span>
                  <span className="font-semibold text-foreground">{secScore} marks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active section editor */}
      {active && (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">Section {active.label}</div>
              <Input
                value={active.description}
                onChange={(e) => updateActive((s) => ({ ...s, description: e.target.value }))}
                placeholder="Add description (optional)…"
                className="mt-1 h-8 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-0 text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground tabular-nums">
                {active.items.length} item{active.items.length !== 1 ? "s" : ""} · {totalScore} marks
              </span>
              <AddItemsDropdown onAdd={addItem} />
            </div>
          </div>

          <div className="p-4 space-y-2">
            {active.items.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-foreground">No items yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click <span className="font-medium text-primary">Add Items</span> from the toolbar to get started.
                </p>
              </div>
            ) : (
              active.items.map((it, i) => (
                <ItemRow
                  key={it.id}
                  item={it}
                  index={i}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  dragHandlers={{
                    onDragStart: () => setDragIdx(i),
                    onDragOver: (e) => { e.preventDefault(); setOverIdx(i); },
                    onDragEnd: () => {
                      if (dragIdx !== null && overIdx !== null) handleReorder(dragIdx, overIdx);
                      setDragIdx(null); setOverIdx(null);
                    },
                    isDragging: dragIdx === i,
                    isOver: overIdx === i && dragIdx !== i,
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ── */
export default function CreateAssessmentV2() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("type");
  const [attempted, setAttempted] = useState(false);

  const [typeOfTest, setTypeOfTest] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [subject, setSubject] = useState("");
  const [chapters, setChapters] = useState<string[]>([]);
  const [totalMarks, setTotalMarks] = useState("");
  const [durationHr, setDurationHr] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [instructions, setInstructions] = useState(
    "General Instructions:\ni. This question paper contains five sections A, B, C, D, and E. Each section is compulsory.\nii. Section A has 10 MCQs of 1 mark each.\niii. Section B has 3 Very Short Answer (VSA)-type questions of 2 marks each."
  );
  const [sections, setSections] = useState<Section[]>([createSection("A")]);

  const isInstructionsRequired = INSTRUCTIONS_REQUIRED_TYPES.includes(typeOfTest);
  const hasDuration = !!(durationHr || durationMin);

  const errors = attempted ? {
    typeOfTest: !typeOfTest ? "Please select a test type" : "",
    selectedClass: !selectedClass ? "Please select a class" : "",
    subject: !subject ? "Please select a subject" : "",
    chapters: chapters.length === 0 ? "Please select at least one chapter" : "",
    totalMarks: !totalMarks ? "Please enter total marks" : "",
    duration: !hasDuration ? "Please enter duration" : "",
    instructions: isInstructionsRequired && !instructions.trim() ? "Instructions are mandatory for Final and Mid-Term Exams" : "",
  } : { typeOfTest: "", selectedClass: "", subject: "", chapters: "", totalMarks: "", duration: "", instructions: "" };

  const handleNext = useCallback(() => {
    setAttempted(true);
    if (!typeOfTest || !selectedClass || !subject || chapters.length === 0 || !totalMarks || !hasDuration) return;
    if (isInstructionsRequired && !instructions.trim()) return;
    setActiveTab("sections");
  }, [typeOfTest, selectedClass, subject, chapters, totalMarks, hasDuration, isInstructionsRequired, instructions]);

  const handleSubmit = () => {
    toast.success("Assessment created successfully");
    navigate("/dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => navigate("/dashboard")}
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Create Assessment</h1>
          <p className="text-sm text-muted-foreground">Set up a new assessment for your students</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-muted/30 p-0 h-auto">
            <TabsTrigger
              value="type"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card data-[state=active]:shadow-none"
            >
              <FileText className="w-4 h-4" /> Type of Assessment
            </TabsTrigger>
            <TabsTrigger
              value="sections"
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-card data-[state=active]:shadow-none"
            >
              <Layers className="w-4 h-4" /> Sections
            </TabsTrigger>
          </TabsList>

          {/* Type tab */}
          <TabsContent value="type" className="p-6 mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Type of Test <span className="text-destructive">*</span></Label>
                <Select value={typeOfTest} onValueChange={setTypeOfTest}>
                  <SelectTrigger className={cn("bg-background", errors.typeOfTest && "border-destructive ring-1 ring-destructive/30")}>
                    <SelectValue placeholder="Select type of test" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEST_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.typeOfTest && <p className="text-xs text-destructive">{errors.typeOfTest}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Class <span className="text-destructive">*</span></Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className={cn("bg-background", errors.selectedClass && "border-destructive ring-1 ring-destructive/30")}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.selectedClass && <p className="text-xs text-destructive">{errors.selectedClass}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Subject <span className="text-destructive">*</span></Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className={cn("bg-background", errors.subject && "border-destructive ring-1 ring-destructive/30")}>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Chapters <span className="text-destructive">*</span></Label>
                <MultiSelectChapters selected={chapters} onChange={setChapters} />
                {errors.chapters && <p className="text-xs text-destructive">{errors.chapters}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Total Marks <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  placeholder="Enter total marks"
                  min={0}
                  max={999}
                  className={cn("bg-background", errors.totalMarks && "border-destructive ring-1 ring-destructive/30")}
                />
                {errors.totalMarks && <p className="text-xs text-destructive">{errors.totalMarks}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Duration <span className="text-destructive">*</span></Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={durationHr}
                    onChange={(e) => setDurationHr(e.target.value)}
                    placeholder="0"
                    min={0}
                    max={10}
                    className={cn("bg-background", errors.duration && "border-destructive ring-1 ring-destructive/30")}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">hr</span>
                  <Input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                    placeholder="0"
                    min={0}
                    max={59}
                    className={cn("bg-background", errors.duration && "border-destructive ring-1 ring-destructive/30")}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">min</span>
                </div>
                {errors.duration && <p className="text-xs text-destructive">{errors.duration}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleNext} className="px-8">Next</Button>
            </div>
          </TabsContent>

          {/* Sections tab */}
          <TabsContent value="sections" className="p-6 mt-0 space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Instructions {isInstructionsRequired
                  ? <span className="text-destructive">*</span>
                  : <span className="text-muted-foreground text-xs">(optional)</span>}
              </Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter any instructions for students..."
                className={cn("bg-background min-h-[100px] resize-y", errors.instructions && "border-destructive ring-1 ring-destructive/30")}
                maxLength={2000}
              />
              <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  These instructions will appear at the beginning of the question paper.
                </p>
              </div>
              {errors.instructions && <p className="text-xs text-destructive">{errors.instructions}</p>}
            </div>

            <div className="border-t border-border -mx-6" />

            <SectionsPanel sections={sections} onChange={setSections} />

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setActiveTab("type")}>Back</Button>
              <Button onClick={handleSubmit} className="px-8">Create Assessment</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
