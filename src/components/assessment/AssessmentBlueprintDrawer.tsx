import { BarChart3, BookOpen, Layers, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Section, SectionItem } from "@/constants/assessmentSectionData";

interface AssessmentBlueprintDrawerProps {
  chapters: string[];
  sections: Section[];
}

type TaxonomyKey = "knowledge" | "understand" | "application";

const TAXONOMY_MAP: Record<string, TaxonomyKey> = {
  remember: "knowledge",
  knowledge: "knowledge",
  understand: "understand",
  understanding: "understand",
  comprehension: "understand",
  apply: "application",
  application: "application",
};

const UNTAGGED = "__untagged__";

interface ChapterStats {
  chapter: string;
  itemCount: number;
  marks: number;
  taxonomy: Record<TaxonomyKey, number>;
}

const flattenItems = (items: SectionItem[]): SectionItem[] => {
  const out: SectionItem[] = [];
  const walk = (arr: SectionItem[]) => {
    for (const it of arr) {
      out.push(it);
      if (it.subItems) walk(it.subItems);
      if (it.orItem) walk([it.orItem]);
    }
  };
  walk(items);
  return out;
};

const buildChapterStats = (sections: Section[], availableChapters: string[]): ChapterStats[] => {
  const map = new Map<string, ChapterStats>();
  const ensure = (name: string): ChapterStats => {
    let s = map.get(name);
    if (!s) {
      s = { chapter: name, itemCount: 0, marks: 0, taxonomy: { knowledge: 0, understand: 0, application: 0 } };
      map.set(name, s);
    }
    return s;
  };

  // Pre-create entries for known chapters so they show with zero stats (helps users see coverage)
  availableChapters.forEach((c) => ensure(c));

  for (const section of sections) {
    for (const item of flattenItems(section.items)) {
      const key = item.chapter ?? UNTAGGED;
      const stats = ensure(key);
      stats.itemCount += 1;
      stats.marks += item.score;
      const tax = TAXONOMY_MAP[(item.taxonomy ?? "").toLowerCase()];
      if (tax) stats.taxonomy[tax] += item.score;
    }
  }

  // Sort: tagged chapters by marks desc, untagged at the end
  return [...map.values()].sort((a, b) => {
    if (a.chapter === UNTAGGED) return 1;
    if (b.chapter === UNTAGGED) return -1;
    return b.marks - a.marks;
  });
};

const TaxonomyBar = ({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: "knowledge" | "understand" | "application";
}) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const toneClasses: Record<typeof tone, string> = {
    knowledge: "bg-sky-500",
    understand: "bg-emerald-500",
    application: "bg-amber-500",
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value} <span className="text-muted-foreground/70">· {pct}%</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${toneClasses[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const AssessmentBlueprintDrawer = ({ chapters, sections }: AssessmentBlueprintDrawerProps) => {
  const chapterStats = buildChapterStats(sections, chapters);
  const usedChapters = chapterStats.filter((c) => c.itemCount > 0);
  const totalMarks = usedChapters.reduce((a, c) => a + c.marks, 0);
  const totalItems = usedChapters.reduce((a, c) => a + c.itemCount, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Blueprint
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle>Assessment Blueprint</SheetTitle>
          <SheetDescription>
            Chapters tagged from your selected questions, with Bloom's taxonomy breakdown.
          </SheetDescription>
        </SheetHeader>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Chapters</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{usedChapters.length}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Items</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{totalItems}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Marks</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-primary">{totalMarks}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {chapterStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chapters yet. Add questions to see the blueprint.</p>
          ) : usedChapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <BookOpen className="h-7 w-7 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No questions selected yet. Add items to a section and their chapters will appear here.
              </p>
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={usedChapters.map((c) => c.chapter)}
              className="space-y-3"
            >
              {chapterStats.map((stats) => {
                const isUntagged = stats.chapter === UNTAGGED;
                if (isUntagged && stats.itemCount === 0) return null;
                const sharePct = totalMarks > 0 ? Math.round((stats.marks / totalMarks) * 100) : 0;

                return (
                  <AccordionItem
                    key={stats.chapter}
                    value={stats.chapter}
                    className="rounded-xl border border-border bg-card overflow-hidden data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40 [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
                      <div className="flex flex-1 items-center justify-between gap-3 pr-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {isUntagged ? "Untagged questions" : stats.chapter}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <FileText className="h-3 w-3" />
                              {stats.itemCount} item{stats.itemCount !== 1 ? "s" : ""}
                              {stats.itemCount === 0 && (
                                <span className="ml-1 text-muted-foreground/70">· not yet used</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {stats.itemCount > 0 && (
                            <span className="text-[11px] tabular-nums text-muted-foreground">{sharePct}%</span>
                          )}
                          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary tabular-nums">
                            {stats.marks} marks
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-4 pb-4 space-y-4">
                      {stats.itemCount === 0 ? (
                        <p className="rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
                          No questions tagged to this chapter yet.
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Layers className="h-3.5 w-3.5" />
                            Bloom's Taxonomy Breakdown
                          </div>
                          <div className="space-y-3 rounded-lg border border-border bg-background px-3 py-3">
                            <TaxonomyBar
                              label="Knowledge"
                              value={stats.taxonomy.knowledge}
                              total={stats.marks}
                              tone="knowledge"
                            />
                            <TaxonomyBar
                              label="Understand"
                              value={stats.taxonomy.understand}
                              total={stats.marks}
                              tone="understand"
                            />
                            <TaxonomyBar
                              label="Application"
                              value={stats.taxonomy.application}
                              total={stats.marks}
                              tone="application"
                            />
                            <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
                              <span className="font-medium text-foreground">Total</span>
                              <span className="tabular-nums font-semibold text-primary">{stats.marks}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AssessmentBlueprintDrawer;
