import { useState, useMemo, useCallback } from "react";
import {
  Search, ChevronDown, ChevronRight, Folder, FolderOpen, Plus, FileText, PlusCircle, X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  REPOSITORY_FOLDERS, type RepositoryFolder, type RepositoryQuestion,
} from "@/constants/questionRepositoryData";
import { ITEM_TYPES, type SectionItem, type ItemType } from "@/constants/assessmentSectionData";
import { toast } from "sonner";
import MCQOptionsEditor from "@/components/question-repository/MCQOptionsEditor";
import FillInBlankEditor from "@/components/question-repository/FillInBlankEditor";
import MatchTheFollowingEditor, { type MatchPair } from "@/components/question-repository/MatchTheFollowingEditor";
import { cn } from "@/lib/utils";

interface AddItemsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionLabel: string;
  onAddItems: (items: SectionItem[]) => void;
}

function countQuestions(folder: RepositoryFolder): number {
  let count = folder.questions.length;
  if (folder.children) for (const c of folder.children) count += countQuestions(c);
  return count;
}
function findFolder(folders: RepositoryFolder[], id: string): RepositoryFolder | null {
  for (const f of folders) {
    if (f.id === id) return f;
    if (f.children) { const found = findFolder(f.children, id); if (found) return found; }
  }
  return null;
}
function collectQuestions(folder: RepositoryFolder): RepositoryQuestion[] {
  let qs = [...folder.questions];
  if (folder.children) for (const c of folder.children) qs = qs.concat(collectQuestions(c));
  return qs;
}

const FolderNode = ({ folder, activeFolderId, onSelect, depth = 0 }: {
  folder: RepositoryFolder; activeFolderId: string | null; onSelect: (id: string) => void; depth?: number;
}) => {
  const [expanded, setExpanded] = useState(depth === 0);
  const isActive = activeFolderId === folder.id;
  const hasChildren = folder.children && folder.children.length > 0;
  const totalQ = countQuestions(folder);
  return (
    <div>
      <button
        type="button"
        onClick={() => { onSelect(folder.id); if (hasChildren) setExpanded((p) => !p); }}
        className={`w-full flex items-center gap-2 py-1.5 text-[13px] rounded-md transition-colors
          ${isActive ? "bg-primary/8 text-primary font-medium" : "text-foreground hover:bg-muted/60"}`}
        style={{ paddingLeft: `${depth * 14 + 10}px`, paddingRight: "10px" }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3 h-3 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 shrink-0 text-muted-foreground" />
        ) : <span className="w-3" />}
        {isActive ? <FolderOpen className="w-3.5 h-3.5 shrink-0 text-primary" /> : <Folder className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />}
        <span className="truncate flex-1 text-left">{folder.name}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">{totalQ}</span>
      </button>
      {expanded && hasChildren && folder.children!.map((child) => (
        <FolderNode key={child.id} folder={child} activeFolderId={activeFolderId} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  );
};

const QuestionPreview = ({ q }: { q: RepositoryQuestion }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[13px] text-foreground leading-snug">{q.question}</span>
    {q.type === "Multiple Choice" && q.options && (
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 pl-0.5">
        {q.options.map((opt, i) => (
          <span key={i} className={`text-[11px] ${opt === q.correctAnswer ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {String.fromCharCode(65 + i)}. {opt}
          </span>
        ))}
      </div>
    )}
    {q.type === "True / False" && (
      <div className="flex gap-3 pl-0.5">
        {["True", "False"].map((val) => (
          <span key={val} className={`text-[11px] ${val === q.correctAnswer ? "text-primary font-medium" : "text-muted-foreground"}`}>{val}</span>
        ))}
      </div>
    )}
    {(q.type === "Fill in the Blank" || q.type === "Short Answer") && q.correctAnswer && (
      <span className="text-[11px] text-muted-foreground pl-0.5 italic line-clamp-1">
        Ans: <span className="text-foreground font-medium not-italic">{q.correctAnswer}</span>
      </span>
    )}
  </div>
);

type ModalTab = "repository" | "create";

const createDefaultPairs = (): MatchPair[] =>
  Array.from({ length: 4 }, () => ({ id: crypto.randomUUID(), left: "", right: "" }));

const CreateNewItemForm = ({ onAddItem, activeFolderId }: { onAddItem: (item: SectionItem) => void; activeFolderId: string }) => {
  const [type, setType] = useState<ItemType>("Short Answer");
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState("1.00");
  const [answerText, setAnswerText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [includeWordBank, setIncludeWordBank] = useState(false);
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>(createDefaultPairs());
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);

  const selectedFolderName = useMemo(() => {
    const find = (folders: RepositoryFolder[]): string | null => {
      for (const f of folders) {
        if (f.id === activeFolderId) return f.name;
        if (f.children) { const r = find(f.children); if (r) return r; }
      }
      return null;
    };
    return find(REPOSITORY_FOLDERS) ?? "repository";
  }, [activeFolderId]);

  const reset = () => {
    setQuestion(""); setScore("1.00"); setAnswerText(""); setCorrectAnswer("");
    setIncludeWordBank(false); setMatchPairs(createDefaultPairs()); setTrueFalseAnswer(null);
  };

  const handleSubmit = () => {
    if (!question.trim() && type !== "Matching") {
      toast.error("Question text is required."); return;
    }
    const item: SectionItem = {
      id: crypto.randomUUID(),
      question: question.trim(),
      score: Math.max(0, parseFloat(score) || 1),
      type,
    };
    if (type === "True / False" && trueFalseAnswer !== null) item.correctAnswer = trueFalseAnswer ? "True" : "False";
    if (type === "Short Answer" && answerText.trim()) item.correctAnswer = answerText.trim();
    if (type === "Fill in the Blank" && correctAnswer.trim()) item.correctAnswer = correctAnswer.trim();
    onAddItem(item);
    reset();
    toast.success(`Item created and saved to "${selectedFolderName}".`);
  };

  const renderQuestionContent = () => {
    if (type === "Fill in the Blank") {
      return <FillInBlankEditor value={question} onChange={setQuestion} includeWordBank={includeWordBank} onWordBankChange={setIncludeWordBank} />;
    }
    if (type === "True / False") {
      return (
        <div className="space-y-5">
          <Textarea placeholder="Type your true/false statement here..." value={question}
            onChange={(e) => setQuestion(e.target.value)} className="min-h-[100px] resize-y text-sm" />
          <div className="space-y-3">
            <Label className="text-sm font-medium">Correct Answer</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: true, label: "True", color: "emerald" },
                { val: false, label: "False", color: "red" },
              ].map((opt) => (
                <button key={opt.label} type="button" onClick={() => setTrueFalseAnswer(opt.val)}
                  className={cn(
                    "relative flex items-center justify-center gap-2.5 rounded-xl border-2 py-4 text-sm font-semibold transition-all",
                    trueFalseAnswer === opt.val
                      ? opt.val
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/60"
                        : "border-red-500 bg-red-50 text-red-700 shadow-sm dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/60"
                      : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                  )}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (type === "Matching") {
      return <MatchTheFollowingEditor pairs={matchPairs} onChange={setMatchPairs} />;
    }
    return (
      <div className="space-y-3">
        <Textarea placeholder="Type your question here..." value={question}
          onChange={(e) => setQuestion(e.target.value)} className="min-h-[120px] resize-y text-sm" />
        {type === "Multiple Choice" && <MCQOptionsEditor />}
        {type === "Short Answer" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Answer (optional)</Label>
            <Textarea placeholder="Type the answer here..." value={answerText}
              onChange={(e) => setAnswerText(e.target.value)} className="min-h-[100px] resize-y text-sm" />
          </div>
        )}
        {type === "Fill in the Blank" && (
          <Input placeholder="Correct answer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="h-9 text-sm" />
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto py-8 px-6 space-y-6">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-primary/[0.06] border border-primary/15">
          <Folder className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm text-foreground">
            Saving to: <span className="font-semibold text-primary">{selectedFolderName}</span>
          </span>
        </div>

        <div className="flex items-end gap-4">
          <div className="space-y-2 flex-1">
            <Label className="text-sm font-medium">Question Type</Label>
            <Select value={type} onValueChange={(v) => { setType(v as ItemType); setTrueFalseAnswer(null); setMatchPairs(createDefaultPairs()); }}>
              <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ITEM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-32">
            <Label className="text-sm font-medium">Marks</Label>
            <Input type="number" min="0" step="0.01" value={score}
              onChange={(e) => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setScore(e.target.value); }}
              onBlur={() => { const n = parseFloat(score); setScore(!isNaN(n) ? n.toFixed(2) : "1.00"); }}
              className="h-10 text-sm" />
          </div>
        </div>

        <div className="min-h-[200px]">{renderQuestionContent()}</div>

        <div className="pt-2">
          <Button type="button" onClick={handleSubmit} className="h-10 text-sm gap-2 px-6">
            <Plus className="w-4 h-4" /> Create & Add to Section
          </Button>
        </div>
      </div>
    </div>
  );
};

const AddItemsModal = ({ open, onOpenChange, sectionLabel, onAddItems }: AddItemsModalProps) => {
  const [activeTab, setActiveTab] = useState<ModalTab>("repository");
  const [activeFolderId, setActiveFolderId] = useState<string | null>(REPOSITORY_FOLDERS[0]?.id ?? null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [createFolderId, setCreateFolderId] = useState<string>(REPOSITORY_FOLDERS[0]?.id ?? "");

  const activeFolder = activeFolderId ? findFolder(REPOSITORY_FOLDERS, activeFolderId) : null;

  const questions = useMemo(() => {
    if (!activeFolder) return [];
    let qs = collectQuestions(activeFolder);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      qs = qs.filter((it) => it.question.toLowerCase().includes(q) || it.type.toLowerCase().includes(q));
    }
    if (typeFilter !== "all") qs = qs.filter((it) => it.type === typeFilter);
    return qs;
  }, [activeFolder, searchQuery, typeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    const allIds = questions.map((q) => q.id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(allIds));
  };

  const handleAdd = useCallback(() => {
    const allQuestions = REPOSITORY_FOLDERS.flatMap((f) => collectQuestions(f));
    const items: SectionItem[] = allQuestions
      .filter((q) => selectedIds.has(q.id))
      .map((q) => ({ id: crypto.randomUUID(), question: q.question, options: q.options, correctAnswer: q.correctAnswer, score: q.score, type: q.type }));
    onAddItems(items);
    setSelectedIds(new Set());
    onOpenChange(false);
  }, [selectedIds, onAddItems, onOpenChange]);

  const handleCreateItem = useCallback((item: SectionItem) => onAddItems([item]), [onAddItems]);

  const handleClose = () => { setSelectedIds(new Set()); setSearchQuery(""); setTypeFilter("all"); onOpenChange(false); };

  const allSelected = questions.length > 0 && questions.every((q) => selectedIds.has(q.id));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[96vw] w-[1400px] h-[94vh] flex flex-col p-0 gap-0 rounded-xl overflow-hidden [&>button:last-child]:hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">Add Items to Section</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Browse your repository or create new questions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full bg-muted/50 p-1 border border-border/60">
              {([
                { id: "repository" as const, label: "From Repository", icon: FileText },
                { id: "create" as const, label: "Create New", icon: PlusCircle },
              ]).map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${activeTab === id ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
            <Badge variant="outline" className="text-xs font-medium h-7 px-3">Section {sectionLabel}</Badge>
            <button type="button" onClick={handleClose} aria-label="Close"
              className="w-8 h-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeTab === "repository" ? (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-56 border-r border-border flex flex-col bg-muted/20 shrink-0">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Folders</span>
              </div>
              <ScrollArea className="flex-1 py-1.5 px-1.5">
                {REPOSITORY_FOLDERS.map((folder) => (
                  <FolderNode key={folder.id} folder={folder} activeFolderId={activeFolderId} onSelect={setActiveFolderId} />
                ))}
              </ScrollArea>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border shrink-0">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions..." className="h-9 pl-9 text-sm" />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9 w-[140px] text-sm"><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {ITEM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60">
                      <span className="font-semibold text-foreground tabular-nums">{selectedIds.size}</span> selected
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60">
                      <span className="font-semibold text-foreground tabular-nums">{questions.length}</span> total
                    </span>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-[40px_44px_1fr_72px_130px] items-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30 sticky top-0 z-10">
                  <div className="flex justify-center"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></div>
                  <span className="text-center">#</span>
                  <span className="pl-1">Question</span>
                  <span className="text-center">Score</span>
                  <span className="text-center">Type</span>
                </div>
                {questions.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="w-8 h-8 text-muted-foreground/40" />
                    <span className="text-sm">{searchQuery || typeFilter !== "all" ? "No questions match your filters." : "No questions in this folder."}</span>
                  </div>
                ) : (
                  questions.map((q, i) => (
                    <div key={q.id}
                      className={`grid grid-cols-[40px_44px_1fr_72px_130px] items-start px-5 py-3.5 border-b border-border/60 transition-colors cursor-pointer
                        ${selectedIds.has(q.id) ? "bg-primary/[0.04]" : "hover:bg-muted/20"}`}
                      onClick={() => toggleSelect(q.id)}
                    >
                      <div className="flex justify-center pt-0.5">
                        <Checkbox checked={selectedIds.has(q.id)} onCheckedChange={() => toggleSelect(q.id)} />
                      </div>
                      <span className="text-sm text-muted-foreground text-center pt-0.5 tabular-nums">{i + 1}</span>
                      <div className="pl-1 pr-4"><QuestionPreview q={q} /></div>
                      <span className="text-sm text-foreground text-center font-medium pt-0.5 tabular-nums">{q.score}</span>
                      <div className="flex justify-center pt-0.5">
                        <Badge variant="secondary" className="text-[11px] font-normal px-2.5 py-0.5 rounded-md">{q.type}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-56 border-r border-border flex flex-col bg-muted/20 shrink-0">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Save to Folder</span>
              </div>
              <ScrollArea className="flex-1 py-1.5 px-1.5">
                {REPOSITORY_FOLDERS.map((folder) => (
                  <FolderNode key={folder.id} folder={folder} activeFolderId={createFolderId} onSelect={setCreateFolderId} />
                ))}
              </ScrollArea>
            </div>
            <CreateNewItemForm onAddItem={handleCreateItem} activeFolderId={createFolderId} />
          </div>
        )}

        {activeTab === "repository" && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-card shrink-0">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size > 0 ? `${selectedIds.size} question${selectedIds.size !== 1 ? "s" : ""} ready to add` : "Select questions to add them to the section"}
            </span>
            <div className="flex items-center gap-2.5">
              <Button type="button" variant="ghost" size="sm" className="h-9 text-sm px-4" onClick={handleClose}>Cancel</Button>
              <Button type="button" size="sm" className="h-9 text-sm gap-1.5 px-4" onClick={handleAdd} disabled={selectedIds.size === 0}>
                <Plus className="w-4 h-4" /> Add {selectedIds.size > 0 ? `(${selectedIds.size})` : "Items"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddItemsModal;
