import { BarChart3, BookOpen, FileText, Layers } from "lucide-react";
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

// Map all 6 Bloom levels into 3 buckets so taxonomy marks reconcile with totals.
const TAXONOMY_MAP: Record<string, TaxonomyKey> = {
  remember: "knowledge",
  knowledge: "knowledge",
  understand: "understand",
  understanding: "understand",
  comprehension: "understand",
  apply: "application",
  application: "application",
  analyze: "application",
  analyse: "application",
  evaluate: "application",
  create: "application",
};

const TAXONOMY_META: Record<
  TaxonomyKey,
  { label: string; bar: string; dot: string; chip: string }
> = {
  knowledge: {
    label: "Knowledge",
    bar: "bg-sky-500",
    dot: "bg-sky-500",
    chip: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  understand: {
    label: "Understand",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  application: {
    label: "Application",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
};

const TAX_ORDER: TaxonomyKey[] = ["knowledge", "understand", "application"];

const UNTAGGED = "__untagged__";

interface BucketStats {
  marks: number;
  count: number;
}

interface ChapterStats {
  chapter: string;
  itemCount: number;
  marks: number;
  taxonomy: Record<TaxonomyKey, BucketStats>;
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

const emptyBuckets = (): Record<TaxonomyKey, BucketStats> => ({
  knowledge: { marks: 0, count: 0 },
  understand: { marks: 0, count: 0 },
  application: { marks: 0, count: 0 },
});

const buildSectionStats = (sections: Section[]): SectionStats[] =>
  sections.map((section) => {
    const map = new Map<string, ChapterStats>();
    let itemCount = 0;
    let marks = 0;

    for (const item of flattenItems(section.items)) {
      const key = item.chapter ?? UNTAGGED;
      let stats = map.get(key);
      if (!stats) {
        stats = { chapter: key, itemCount: 0, marks: 0, taxonomy: emptyBuckets() };
        map.set(key, stats);
      }
      stats.itemCount += 1;
      stats.marks += item.score;
      itemCount += 1;
      marks += item.score;
      // Default any unknown/missing taxonomy to "knowledge" so totals always reconcile.
      const tax = TAXONOMY_MAP[(item.taxonomy ?? "").toLowerCase()] ?? "knowledge";
      stats.taxonomy[tax].marks += item.score;
      stats.taxonomy[tax].count += 1;
    }

    const chapters = [...map.values()].sort((a, b) => {
      if (a.chapter === UNTAGGED) return 1;
      if (b.chapter === UNTAGGED) return -1;
      return b.marks - a.marks;
    });

    return { section, chapters, itemCount, marks };
  });

const StackedBar = ({ stats }: { stats: ChapterStats }) => {
  if (stats.marks === 0) {
    return (
      <div className="h-1 w-full rounded-full bg-muted" aria-hidden />
    );
  }
  return (
    <div
      className="flex h-1 w-full overflow-hidden rounded-full bg-muted"
      role="img"
      aria-label="Taxonomy distribution"
    >
      {TAX_ORDER.map((k) => {
        const pct = (stats.taxonomy[k].marks / stats.marks) * 100;
        if (pct === 0) return null;
        return (
          <div
            key={k}
            className={`${TAXONOMY_META[k].bar} h-full transition-all`}
            style={{ width: `${pct}%` }}
            title={`${TAXONOMY_META[k].label}: ${stats.taxonomy[k].marks} marks`}
          />
        );
      })}
    </div>
  );
};

const ChapterCard = ({ stats, sectionTotalMarks }: { stats: ChapterStats; sectionTotalMarks: number }) => {
  const isUntagged = stats.chapter === UNTAGGED;
  const sharePct = sectionTotalMarks > 0 ? Math.round((stats.marks / sectionTotalMarks) * 100) : 0;

  return (
    <div className="rounded-lg border border-border bg-background p-3 space-y-3 transition-colors hover:border-primary/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <BookOpen
            className={`h-4 w-4 mt-0.5 shrink-0 ${isUntagged ? "text-muted-foreground" : "text-primary"}`}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {isUntagged ? "Untagged questions" : stats.chapter}
            </p>
            <p className="text-[11px] text-muted-foreground tabular-nums">
              {stats.itemCount} item{stats.itemCount !== 1 ? "s" : ""} · {sharePct}% of section
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary tabular-nums">
          {stats.marks} marks
        </span>
      </div>

      {/* Stacked distribution bar */}
      <StackedBar stats={stats} />

      {/* Per-bucket chips */}
      <div className="grid grid-cols-3 gap-1.5">
        {TAX_ORDER.map((k) => {
          const bucket = stats.taxonomy[k];
          const pct = stats.marks > 0 ? Math.round((bucket.marks / stats.marks) * 100) : 0;
          return (
            <div
              key={k}
              className="rounded-md border border-border bg-card px-2 py-1.5 flex flex-col gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${TAXONOMY_META[k].dot}`} />
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {TAXONOMY_META[k].label}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {bucket.marks}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {bucket.count} Q · {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AssessmentBlueprintDrawer = ({ sections }: AssessmentBlueprintDrawerProps) => {
  const sectionStats = buildSectionStats(sections);
  const totalMarks = sectionStats.reduce((a, s) => a + s.marks, 0);
  const totalItems = sectionStats.reduce((a, s) => a + s.itemCount, 0);
  const uniqueChapters = new Set(
    sectionStats.flatMap((s) =>
      s.chapters.filter((c) => c.chapter !== UNTAGGED).map((c) => c.chapter)
    )
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

        {/* Summary */}
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Layers className="h-3.5 w-3.5" />
                            Chapters in this section
                          </div>
                          <div className="flex items-center gap-2.5">
                            {TAX_ORDER.map((k) => (
                              <div key={k} className="flex items-center gap-1">
                                <span className={`h-1.5 w-1.5 rounded-full ${TAXONOMY_META[k].dot}`} />
                                <span className="text-[10px] text-muted-foreground">
                                  {TAXONOMY_META[k].label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          {stats.chapters.map((c) => (
                            <ChapterCard
                              key={c.chapter}
                              stats={c}
                              sectionTotalMarks={stats.marks}
                            />
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
