import { BarChart3, BookOpen } from "lucide-react";
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

const getItemMarks = (item: SectionItem): number => {
  const subTotal = item.subItems?.reduce((sum, subItem) => sum + getItemMarks(subItem), 0) ?? 0;
  const orTotal = item.orItem ? getItemMarks(item.orItem) : 0;
  return item.score + subTotal + orTotal;
};

const accumulateTaxonomy = (
  item: SectionItem,
  acc: Record<TaxonomyKey, number>
) => {
  const key = TAXONOMY_MAP[(item.taxonomy ?? "").toLowerCase()];
  if (key) acc[key] += item.score;
  item.subItems?.forEach((s) => accumulateTaxonomy(s, acc));
  if (item.orItem) accumulateTaxonomy(item.orItem, acc);
};

const getSectionTaxonomy = (section: Section) => {
  const acc: Record<TaxonomyKey, number> = { knowledge: 0, understand: 0, application: 0 };
  section.items.forEach((it) => accumulateTaxonomy(it, acc));
  return acc;
};

const getSectionMarks = (section: Section) =>
  section.items.reduce((sum, item) => sum + getItemMarks(item), 0);

// Distribute chapters across sections (round-robin) since data has no explicit mapping.
const distributeChapters = (chapters: string[], sectionCount: number): string[][] => {
  const buckets: string[][] = Array.from({ length: Math.max(sectionCount, 1) }, () => []);
  chapters.forEach((c, i) => buckets[i % buckets.length].push(c));
  return buckets;
};

const TaxonomyTile = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
  <div
    className={`rounded-lg border px-3 py-2.5 ${
      accent ? "border-primary/30 bg-primary/5" : "border-border bg-background"
    }`}
  >
    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={`mt-1 text-lg font-semibold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>
      {value}
    </p>
  </div>
);

const AssessmentBlueprintDrawer = ({ chapters, sections }: AssessmentBlueprintDrawerProps) => {
  const chapterBuckets = distributeChapters(chapters, sections.length);

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
          <SheetDescription>Sections with their chapters and Bloom's taxonomy breakdown.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {sections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sections added yet.</p>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={sections.map((s) => s.id)}
              className="space-y-3"
            >
              {sections.map((section, idx) => {
                const taxonomy = getSectionTaxonomy(section);
                const total = getSectionMarks(section);
                const sectionChapters = chapterBuckets[idx] ?? [];

                return (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40 [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
                      <div className="flex flex-1 items-center justify-between gap-3 pr-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              Section {section.label}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {sectionChapters.length} chapter{sectionChapters.length !== 1 ? "s" : ""} · {section.items.length} item{section.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary tabular-nums shrink-0">
                          {total} marks
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-4 pb-4 space-y-4">
                      {/* Chapters */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" />
                          Chapters
                        </div>
                        {sectionChapters.length ? (
                          <ul className="space-y-1.5">
                            {sectionChapters.map((chapter) => (
                              <li
                                key={chapter}
                                className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                                <span className="truncate">{chapter}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="rounded-md border border-dashed border-border px-2.5 py-2 text-xs text-muted-foreground">
                            No chapters mapped to this section.
                          </p>
                        )}
                      </div>

                      {/* Bloom's Taxonomy */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          Bloom's Taxonomy Breakdown
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <TaxonomyTile label="Knowledge" value={taxonomy.knowledge} />
                          <TaxonomyTile label="Understand" value={taxonomy.understand} />
                          <TaxonomyTile label="Application" value={taxonomy.application} />
                          <TaxonomyTile label="Total" value={total} accent />
                        </div>
                      </div>
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
