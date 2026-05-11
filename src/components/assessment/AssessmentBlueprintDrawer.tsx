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

interface SectionStats {
  section: Section;
  chapters: ChapterStats[];
  itemCount: number;
  marks: number;
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

const buildSectionStats = (sections: Section[]): SectionStats[] =>
  sections.map((section) => {
    const map = new Map<string, ChapterStats>();
    let itemCount = 0;
    let marks = 0;

    for (const item of flattenItems(section.items)) {
      const key = item.chapter ?? UNTAGGED;
      let stats = map.get(key);
      if (!stats) {
        stats = {
          chapter: key,
          itemCount: 0,
          marks: 0,
          taxonomy: { knowledge: 0, understand: 0, application: 0 },
        };
        map.set(key, stats);
      }
      stats.itemCount += 1;
      stats.marks += item.score;
      itemCount += 1;
      marks += item.score;
      const tax = TAXONOMY_MAP[(item.taxonomy ?? "").toLowerCase()];
      if (tax) stats.taxonomy[tax] += item.score;
    }

    const chapters = [...map.values()].sort((a, b) => {
      if (a.chapter === UNTAGGED) return 1;
      if (b.chapter === UNTAGGED) return -1;
      return b.marks - a.marks;
    });

    return { section, chapters, itemCount, marks };
  });

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

const ChapterBlock = ({ stats }: { stats: ChapterStats }) => {
  const isUntagged = stats.chapter === UNTAGGED;
  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
          <span className="text-sm font-medium text-foreground truncate">
            {isUntagged ? "Untagged questions" : stats.chapter}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0">
            · {stats.itemCount} item{stats.itemCount !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary tabular-nums shrink-0">
          {stats.marks} marks
        </span>
      </div>
      <div className="space-y-3 px-3 py-3">
        <TaxonomyBar label="Knowledge" value={stats.taxonomy.knowledge} total={stats.marks} tone="knowledge" />
        <TaxonomyBar label="Understand" value={stats.taxonomy.understand} total={stats.marks} tone="understand" />
        <TaxonomyBar label="Application" value={stats.taxonomy.application} total={stats.marks} tone="application" />
      </div>
    </div>
  );
};

const AssessmentBlueprintDrawer = ({ sections }: AssessmentBlueprintDrawerProps) => {
  const sectionStats = buildSectionStats(sections);
  const totalMarks = sectionStats.reduce((a, s) => a + s.marks, 0);
  const totalItems = sectionStats.reduce((a, s) => a + s.itemCount, 0);
  const uniqueChapters = new Set(
    sectionStats.flatMap((s) => s.chapters.filter((c) => c.chapter !== UNTAGGED).map((c) => c.chapter))
  ).size;

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
            Sections with their chapters and Bloom's taxonomy breakdown.
          </SheetDescription>
        </SheetHeader>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Chapters</p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">{uniqueChapters}</p>
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
          {sectionStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sections added yet.</p>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={sectionStats.map((s) => s.section.id)}
              className="space-y-3"
            >
              {sectionStats.map((stats, idx) => (
                <AccordionItem
                  key={stats.section.id}
                  value={stats.section.id}
                  className="rounded-xl border border-border bg-card overflow-hidden data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40 [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
                    <div className="flex flex-1 items-center justify-between gap-3 pr-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            Section {stats.section.label}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <BookOpen className="h-3 w-3" />
                            {stats.chapters.length} chapter{stats.chapters.length !== 1 ? "s" : ""}
                            <span className="text-muted-foreground/60">·</span>
                            <FileText className="h-3 w-3" />
                            {stats.itemCount} item{stats.itemCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary tabular-nums shrink-0">
                        {stats.marks} marks
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-4 pb-4 space-y-3">
                    {stats.chapters.length === 0 ? (
                      <p className="rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
                        No questions added to this section yet.
                      </p>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <Layers className="h-3.5 w-3.5" />
                          Chapters in this section
                        </div>
                        <div className="space-y-2.5">
                          {stats.chapters.map((c) => (
                            <ChapterBlock key={c.chapter} stats={c} />
                          ))}
                        </div>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AssessmentBlueprintDrawer;
