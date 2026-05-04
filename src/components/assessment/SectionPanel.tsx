import { useState, useCallback, useRef, useMemo } from "react";
import { Shuffle, Trash2, Plus, MoreHorizontal, Pencil, Copy, X, Check, Split, GitBranch, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import SectionItemsTable from "./SectionItemsTable";
import AddItemsModal from "./AddItemsModal";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  createSection, createSectionItem, SECTION_LABELS,
  deepUpdateItem, deepRemoveItem, addSubItem, addOrItem, linkAsOr, makeSubItemsOf, createParentWithSubItems,
  type Section, type SectionItem, type ItemType,
} from "@/constants/assessmentSectionData";

interface SectionPanelProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

const shuffleArray = <T,>(arr: T[]): T[] => {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s;
};

const DESCRIPTION_MAX = 255;

const InlineDescriptionPill = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex w-full items-center gap-2 border-b border-border bg-transparent px-0 py-2 transition-colors focus-within:border-primary/50">
      <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
      <input type="text" value={value}
        onChange={(e) => { if (e.target.value.length <= DESCRIPTION_MAX) onChange(e.target.value); }}
        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
        placeholder="Add description…" autoComplete="off" aria-label="Section description"
        className="flex-1 min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
      />
      <span className={`text-[10px] text-muted-foreground tabular-nums transition-opacity ${isFocused ? "opacity-100" : "opacity-0"}`}>
        {value.length}/{DESCRIPTION_MAX}
      </span>
    </div>
  );
};

const SectionPanel = ({ sections, onChange }: SectionPanelProps) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sections[0]?.id ?? null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [addItemsOpen, setAddItemsOpen] = useState(false);
  const [makeSubOpen, setMakeSubOpen] = useState(false);
  const [parentQuestion, setParentQuestion] = useState("");
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? null;

  const handleAddSection = useCallback(() => {
    const nextLabel = SECTION_LABELS[sections.length] ?? `${sections.length + 1}`;
    const ns = createSection(nextLabel);
    onChange([...sections, ns]);
    setActiveSectionId(ns.id);
  }, [sections, onChange]);

  const handleRemoveSection = useCallback((sectionId: string) => {
    if (sections.length <= 1) { toast.error("At least one section is required."); return; }
    const updated = sections.filter((s) => s.id !== sectionId);
    onChange(updated);
    if (activeSectionId === sectionId) setActiveSectionId(updated[0]?.id ?? null);
    toast.success("Section removed.");
  }, [sections, onChange, activeSectionId]);

  const handleDuplicateSection = useCallback((sectionId: string) => {
    const src = sections.find((s) => s.id === sectionId);
    if (!src) return;
    const nextLabel = SECTION_LABELS[sections.length] ?? `${sections.length + 1}`;
    const dup: Section = {
      id: crypto.randomUUID(), label: nextLabel, description: src.description,
      items: src.items.map((it) => ({ ...it, id: crypto.randomUUID() })),
    };
    const idx = sections.findIndex((s) => s.id === sectionId);
    const updated = [...sections]; updated.splice(idx + 1, 0, dup);
    onChange(updated); setActiveSectionId(dup.id);
    toast.success("Section duplicated.");
  }, [sections, onChange]);

  const handleRenameSection = useCallback((sectionId: string) => {
    const sec = sections.find((s) => s.id === sectionId); if (!sec) return;
    setEditingId(sectionId); setEditingLabel(sec.label);
    setTimeout(() => editInputRef.current?.focus(), 50);
  }, [sections]);

  const commitRename = useCallback(() => {
    if (!editingId || !editingLabel.trim()) { setEditingId(null); return; }
    onChange(sections.map((s) => s.id === editingId ? { ...s, label: editingLabel.trim() } : s));
    setEditingId(null); toast.success("Section renamed.");
  }, [editingId, editingLabel, sections, onChange]);

  const handleUpdateDescription = useCallback((sectionId: string, description: string) => {
    onChange(sections.map((s) => s.id === sectionId ? { ...s, description } : s));
  }, [sections, onChange]);

  const updateSectionItems = useCallback((sectionId: string, items: SectionItem[]) => {
    onChange(sections.map((s) => s.id === sectionId ? { ...s, items } : s));
  }, [sections, onChange]);

  const handleAddItemsFromRepo = useCallback((items: SectionItem[]) => {
    if (!activeSection) return;
    updateSectionItems(activeSection.id, [...activeSection.items, ...items]);
    toast.success(`${items.length} item(s) added.`);
  }, [activeSection, updateSectionItems]);

  const handleUpdateItem = useCallback((id: string, updates: Partial<SectionItem>) => {
    if (!activeSection) return;
    updateSectionItems(activeSection.id, deepUpdateItem(activeSection.items, id, updates));
  }, [activeSection, updateSectionItems]);

  const handleRemoveItem = useCallback((id: string) => {
    if (!activeSection) return;
    updateSectionItems(activeSection.id, deepRemoveItem(activeSection.items, id));
    setSelectedItems((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }, [activeSection, updateSectionItems]);

  const handleAddSubItem = useCallback((parentId: string, type: ItemType) => {
    if (!activeSection) return;
    updateSectionItems(activeSection.id, addSubItem(activeSection.items, parentId, type));
    toast.success("Sub-question added.");
  }, [activeSection, updateSectionItems]);

  const handleAddOrItem = useCallback((targetId: string, type: ItemType) => {
    if (!activeSection) return;
    updateSectionItems(activeSection.id, addOrItem(activeSection.items, targetId, type));
    toast.success("OR alternative added.");
  }, [activeSection, updateSectionItems]);

  const handleLinkAsOr = useCallback(() => {
    if (!activeSection || selectedItems.size !== 2) return;
    const [primaryId, secondaryId] = Array.from(selectedItems);
    updateSectionItems(activeSection.id, linkAsOr(activeSection.items, primaryId, secondaryId));
    setSelectedItems(new Set()); toast.success("Questions linked as OR pair.");
  }, [activeSection, selectedItems, updateSectionItems]);

  const handleOpenMakeSubModal = useCallback(() => { setParentQuestion(""); setMakeSubOpen(true); }, []);

  const handleCreateSubQuestionGroup = useCallback(() => {
    if (!activeSection || selectedItems.size === 0) return;
    const q = parentQuestion.trim();
    if (!q) { toast.error("Please enter a question."); return; }
    const childIds = Array.from(selectedItems);
    updateSectionItems(activeSection.id, createParentWithSubItems(activeSection.items, childIds, q));
    setSelectedItems(new Set()); setMakeSubOpen(false); setParentQuestion("");
    toast.success(`${childIds.length} item(s) added as sub-question(s).`);
  }, [activeSection, selectedItems, parentQuestion, updateSectionItems]);

  const handleReorder = useCallback((from: number, to: number) => {
    if (!activeSection) return;
    const r = [...activeSection.items]; const [m] = r.splice(from, 1); r.splice(to, 0, m);
    updateSectionItems(activeSection.id, r);
  }, [activeSection, updateSectionItems]);

  const handleShuffle = useCallback(() => {
    if (!activeSection || activeSection.items.length < 2) return;
    updateSectionItems(activeSection.id, shuffleArray(activeSection.items));
    toast.success("Items shuffled.");
  }, [activeSection, updateSectionItems]);

  const handleDeleteSelected = useCallback(() => {
    if (!activeSection || selectedItems.size === 0) return;
    updateSectionItems(activeSection.id, activeSection.items.filter((it) => !selectedItems.has(it.id)));
    const n = selectedItems.size; setSelectedItems(new Set());
    toast.success(`${n} item(s) removed.`);
  }, [activeSection, selectedItems, updateSectionItems]);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    if (!activeSection) return;
    const allIds = activeSection.items.map((it) => it.id);
    const allSelected = allIds.every((id) => selectedItems.has(id));
    setSelectedItems(allSelected ? new Set() : new Set(allIds));
  };

  const eligibleParents = useMemo(() => {
    if (!activeSection) return [];
    return activeSection.items.filter((it) => !selectedItems.has(it.id) && !it.orItem);
  }, [activeSection, selectedItems]);

  const canLinkOr = selectedItems.size === 2 && (() => {
    const ids = Array.from(selectedItems);
    const topLevelIds = activeSection?.items.map((it) => it.id) ?? [];
    return ids.every((id) => topLevelIds.includes(id)) &&
      ids.every((id) => !activeSection?.items.find((it) => it.id === id)?.orItem);
  })();

  const canMakeSub = selectedItems.size >= 1 && eligibleParents.length > 0;

  const totalItems = activeSection?.items.length ?? 0;
  const totalScore = activeSection?.items.reduce((sum, it) => sum + it.score, 0) ?? 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {sections.length} Section{sections.length !== 1 ? "s" : ""}
        </span>
        <Button type="button" variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleAddSection}>
          <Plus className="w-3.5 h-3.5" /> Add Section
        </Button>
      </div>

      {/* Section Cards */}
      <div className="flex flex-wrap gap-3">
        {sections.map((sec, idx) => {
          const isActive = activeSectionId === sec.id;
          const isEditing = editingId === sec.id;
          const secItems = sec.items.length;
          const secScore = sec.items.reduce((s, it) => s + it.score, 0);
          return (
            <div key={sec.id}
              onClick={() => { if (!isEditing) { setActiveSectionId(sec.id); setSelectedItems(new Set()); } }}
              className={`relative group w-[164px] rounded-xl cursor-pointer transition-all duration-200 overflow-hidden
                ${isActive
                  ? "bg-card border border-primary/30 shadow-[0_1px_8px_-2px_hsl(var(--primary)/0.12)]"
                  : "bg-card border border-border shadow-sm hover:border-muted-foreground/40 hover:shadow-md"}`}
            >
              <div className={`h-[3px] w-full transition-colors duration-200 ${isActive ? "bg-primary" : "bg-muted"}`} />
              <div className="px-3.5 pt-2.5 pb-3">
                <div className="flex items-start justify-between mb-2.5">
                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1 mr-1">
                      <Input ref={editInputRef} value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setEditingId(null); }}
                        className="h-6 text-xs px-1.5 w-full"
                      />
                      <button type="button" onClick={commitRename} className="text-primary hover:text-primary/80"><Check className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[13px] font-medium leading-tight truncate max-w-[80px] ${isActive ? "text-primary" : "text-foreground"}`}>
                          {sec.label}
                        </span>
                      </div>
                    </div>
                  )}
                  {!isEditing && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1 -mt-0.5 rounded-md hover:bg-muted">
                          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRenameSection(sec.id); }}>
                          <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicateSection(sec.id); }}>
                          <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRemoveSection(sec.id); }}
                          className="text-destructive focus:text-destructive" disabled={sections.length <= 1}>
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-muted/50 px-2.5 py-1.5 text-center">
                    <span className="text-sm font-medium text-foreground leading-none">{String(secItems).padStart(2, "0")}</span>
                    <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Items</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-muted/50 px-2.5 py-1.5 text-center">
                    <span className="text-sm font-medium text-foreground leading-none">{String(secScore).padStart(2, "0")}</span>
                    <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Score</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Section Content */}
      {activeSection && (
        <div className="space-y-4">
          <div className="-mx-6 h-px bg-border/70" />

          {/* Section header — clean, minimal hierarchy */}
          <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1 h-5 rounded-full bg-primary shrink-0" />
                <h3 className="text-sm font-semibold text-foreground truncate">
                  Section {activeSection.label}
                </h3>
              </div>
              <span className="text-border" aria-hidden="true">·</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                <span><span className="font-medium text-foreground">{String(totalItems).padStart(2, "0")}</span> items</span>
                <span><span className="font-medium text-foreground">{String(totalScore).padStart(2, "0")}</span> marks</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button"
                    className="p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Section options">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuItem onClick={() => handleRenameSection(activeSection.id)}>
                    <Pencil className="w-3.5 h-3.5 mr-2" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShuffle} disabled={totalItems < 2}>
                    <Shuffle className="w-3.5 h-3.5 mr-2" /> Shuffle items
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRemoveSection(activeSection.id)}
                    disabled={sections.length <= 1}
                    className="text-destructive focus:text-destructive">
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete section
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button type="button" size="sm" className="h-8 text-xs gap-1.5 self-start sm:self-auto"
              onClick={() => setAddItemsOpen(true)}>
              <Plus className="w-3.5 h-3.5" /> Add Items
            </Button>
          </div>

          {/* Contextual bulk-action bar */}
          {selectedItems.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/[0.04] px-3 py-2 animate-in fade-in slide-in-from-top-1">
              <span className="text-xs font-medium text-primary">
                {selectedItems.size} selected
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {canLinkOr && (
                  <Button type="button" variant="ghost" size="sm"
                    className="h-7 text-xs gap-1.5 text-foreground hover:bg-primary/10"
                    onClick={handleLinkAsOr}>
                    <Split className="w-3.5 h-3.5" /> Link as OR
                  </Button>
                )}
                {canMakeSub && (
                  <Button type="button" variant="ghost" size="sm"
                    className="h-7 text-xs gap-1.5 text-foreground hover:bg-primary/10"
                    onClick={handleOpenMakeSubModal}>
                    <GitBranch className="w-3.5 h-3.5" /> Make Sub-Q
                  </Button>
                )}
                <Button type="button" variant="ghost" size="sm"
                  className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDeleteSelected}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
                <button type="button" onClick={() => setSelectedItems(new Set())}
                  className="ml-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Clear selection">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <InlineDescriptionPill
            value={activeSection.description}
            onChange={(val) => handleUpdateDescription(activeSection.id, val)}
          />

          <SectionItemsTable
            items={activeSection.items}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onReorder={handleReorder}
            selectedIds={selectedItems}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            onAddSubItem={handleAddSubItem}
            onAddOrItem={handleAddOrItem}
          />
        </div>
      )}

      {activeSection && (
        <AddItemsModal
          open={addItemsOpen}
          onOpenChange={setAddItemsOpen}
          sectionLabel={activeSection.label}
          onAddItems={handleAddItemsFromRepo}
        />
      )}

      <Dialog open={makeSubOpen} onOpenChange={setMakeSubOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create sub-question group</DialogTitle>
            <DialogDescription>Add a parent question for the selected items.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label htmlFor="parentQuestion" className="text-sm font-medium text-foreground">
              Question <span className="text-destructive">*</span>
            </label>
            <Input id="parentQuestion" value={parentQuestion}
              onChange={(e) => setParentQuestion(e.target.value)}
              placeholder="Enter parent question text" autoComplete="off" />
            <p className="text-xs text-muted-foreground">
              {selectedItems.size} selected item{selectedItems.size !== 1 ? "s" : ""} will be nested under this question.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setMakeSubOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleCreateSubQuestionGroup}>Add Sub-Questions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionPanel;
