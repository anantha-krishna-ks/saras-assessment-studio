import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Section, SectionItem } from "@/constants/assessmentSectionData";

interface AssessmentBlueprintDrawerProps {
  chapters: string[];
  sections: Section[];
}

const getItemMarks = (item: SectionItem): number => {
  const subTotal = item.subItems?.reduce((sum, subItem) => sum + getItemMarks(subItem), 0) ?? 0;
  const orTotal = item.orItem ? getItemMarks(item.orItem) : 0;
  return item.score + subTotal + orTotal;
};

const getSectionMarks = (section: Section): number =>
  section.items.reduce((sum, item) => sum + getItemMarks(item), 0);

const AssessmentBlueprintDrawer = ({ chapters, sections }: AssessmentBlueprintDrawerProps) => {
  const sectionSummaries = sections.map((section) => ({
    id: section.id,
    label: section.label,
    description: section.description,
    itemCount: section.items.length,
    marks: getSectionMarks(section),
  }));
  const totalMarks = sectionSummaries.reduce((sum, section) => sum + section.marks, 0);
  const chapterCount = Math.max(chapters.length, 1);
  const baseChapterMarks = chapters.length ? Math.floor(totalMarks / chapterCount) : 0;
  const remainderMarks = chapters.length ? totalMarks % chapterCount : 0;

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
          <SheetDescription>Chapters, sections, and live marks distribution.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <section className="grid grid-cols-3 gap-3" aria-label="Blueprint totals">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">Chapters</p>
              <p className="mt-1 text-2xl font-medium text-foreground">{chapters.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">Sections</p>
              <p className="mt-1 text-2xl font-medium text-foreground">{sections.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs font-medium text-muted-foreground">Marks</p>
              <p className="mt-1 text-2xl font-medium text-foreground">{totalMarks}</p>
            </div>
          </section>

          <section className="space-y-3" aria-label="Selected chapters">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Selected Chapters</h3>
              <span className="text-xs text-muted-foreground">Chapter-wise total</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {chapters.length ? (
                chapters.map((chapter, index) => {
                  const marks = baseChapterMarks + (index < remainderMarks ? 1 : 0);
                  return (
                    <div key={chapter} className="grid grid-cols-[1fr_72px] items-center border-b border-border px-3 py-2.5 last:border-b-0">
                      <span className="truncate text-sm text-foreground">{chapter}</span>
                      <span className="text-right text-sm font-medium text-primary">{marks}</span>
                    </div>
                  );
                })
              ) : (
                <p className="px-3 py-4 text-sm text-muted-foreground">No chapters selected.</p>
              )}
            </div>
          </section>

          <section className="space-y-3" aria-label="Section marks distribution">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Sections Included</h3>
              <span className="text-xs text-muted-foreground">Marks per section</span>
            </div>
            <div className="space-y-2">
              {sectionSummaries.map((section) => (
                <div key={section.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Section {section.label}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {section.description || `${section.itemCount} item${section.itemCount !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
                      {section.marks} marks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AssessmentBlueprintDrawer;
