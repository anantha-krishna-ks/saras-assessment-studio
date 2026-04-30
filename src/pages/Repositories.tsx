import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  FolderPlus,
  BookOpen,
  FlaskConical,
  Calculator,
  Globe2,
  Atom,
  TestTube,
  Leaf,
  Languages,
  ChevronRight,
  FileQuestion,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Repository {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  chapterCount: number;
  lastUpdated: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "violet" | "mint" | "amber" | "sky" | "rose" | "indigo" | "emerald" | "peach";
}

const REPOSITORIES: Repository[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Algebra, Geometry, Trigonometry & more",
    questionCount: 248,
    chapterCount: 12,
    lastUpdated: "2 days ago",
    icon: Calculator,
    tone: "violet",
  },
  {
    id: "science",
    name: "Science",
    description: "General science fundamentals & concepts",
    questionCount: 186,
    chapterCount: 9,
    lastUpdated: "5 days ago",
    icon: FlaskConical,
    tone: "mint",
  },
  {
    id: "physics",
    name: "Physics",
    description: "Mechanics, Optics, Electricity & Magnetism",
    questionCount: 142,
    chapterCount: 8,
    lastUpdated: "1 week ago",
    icon: Atom,
    tone: "sky",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Organic, Inorganic & Physical chemistry",
    questionCount: 128,
    chapterCount: 7,
    lastUpdated: "3 days ago",
    icon: TestTube,
    tone: "amber",
  },
  {
    id: "biology",
    name: "Biology",
    description: "Botany, Zoology & Human physiology",
    questionCount: 96,
    chapterCount: 6,
    lastUpdated: "Yesterday",
    icon: Leaf,
    tone: "emerald",
  },
  {
    id: "english",
    name: "English",
    description: "Grammar, Literature & Comprehension",
    questionCount: 112,
    chapterCount: 10,
    lastUpdated: "4 days ago",
    icon: BookOpen,
    tone: "rose",
  },
  {
    id: "social-studies",
    name: "Social Studies",
    description: "History, Civics & Geography",
    questionCount: 88,
    chapterCount: 8,
    lastUpdated: "1 week ago",
    icon: Globe2,
    tone: "indigo",
  },
  {
    id: "hindi",
    name: "Hindi",
    description: "व्याकरण, साहित्य एवं रचनात्मक लेखन",
    questionCount: 74,
    chapterCount: 6,
    lastUpdated: "2 weeks ago",
    icon: Languages,
    tone: "peach",
  },
];

const TONE_STYLES: Record<
  Repository["tone"],
  { bg: string; iconBg: string; iconText: string; ring: string }
> = {
  violet: {
    bg: "from-violet-50 to-white",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    ring: "group-hover:ring-violet-200",
  },
  mint: {
    bg: "from-emerald-50 to-white",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    ring: "group-hover:ring-emerald-200",
  },
  amber: {
    bg: "from-amber-50 to-white",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    ring: "group-hover:ring-amber-200",
  },
  sky: {
    bg: "from-sky-50 to-white",
    iconBg: "bg-sky-100",
    iconText: "text-sky-600",
    ring: "group-hover:ring-sky-200",
  },
  rose: {
    bg: "from-rose-50 to-white",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    ring: "group-hover:ring-rose-200",
  },
  indigo: {
    bg: "from-indigo-50 to-white",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    ring: "group-hover:ring-indigo-200",
  },
  emerald: {
    bg: "from-teal-50 to-white",
    iconBg: "bg-teal-100",
    iconText: "text-teal-600",
    ring: "group-hover:ring-teal-200",
  },
  peach: {
    bg: "from-orange-50 to-white",
    iconBg: "bg-orange-100",
    iconText: "text-orange-600",
    ring: "group-hover:ring-orange-200",
  },
};

export default function Repositories() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return REPOSITORIES;
    return REPOSITORIES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [search]);

  const totals = useMemo(
    () => ({
      repos: REPOSITORIES.length,
      questions: REPOSITORIES.reduce((s, r) => s + r.questionCount, 0),
      chapters: REPOSITORIES.reduce((s, r) => s + r.chapterCount, 0),
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-medium tracking-tight text-foreground leading-tight">
                Question Repositories
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Choose a subject repository to browse, edit, or add questions
              </p>
            </div>

            <Button size="sm" className="h-10 gap-1.5 w-fit">
              <FolderPlus className="h-4 w-4" />
              New Repository
            </Button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatTile label="Repositories" value={totals.repos} />
          <StatTile label="Total Questions" value={totals.questions} />
          <StatTile label="Total Chapters" value={totals.chapters} />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories…"
            className="h-11 pl-10 rounded-xl bg-background border-border"
          />
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center text-center gap-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No repositories found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search query
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((repo) => {
              const tone = TONE_STYLES[repo.tone];
              const Icon = repo.icon;
              return (
                <button
                  key={repo.id}
                  onClick={() =>
                    navigate(`/question-repository?folder=${repo.id}`)
                  }
                  className={cn(
                    "group relative text-left rounded-2xl border border-border/70 bg-gradient-to-br p-5 ring-1 ring-transparent transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-soft-md",
                    tone.bg,
                    tone.ring,
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center",
                        tone.iconBg,
                      )}
                    >
                      <Icon className={cn("h-5 w-5", tone.iconText)} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>

                  <div className="mt-4">
                    <h3 className="text-[16px] font-medium text-foreground leading-tight">
                      {repo.name}
                    </h3>
                    <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2 leading-snug">
                      {repo.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="h-6 gap-1 bg-background/80 border border-border/60 text-foreground font-medium"
                    >
                      <FileQuestion className="h-3 w-3" />
                      {repo.questionCount} Qs
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="h-6 gap-1 bg-background/80 border border-border/60 text-foreground font-medium"
                    >
                      <BookOpen className="h-3 w-3" />
                      {repo.chapterCount} chapters
                    </Badge>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Updated {repo.lastUpdated}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 flex items-center justify-between bg-background border-border/60">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xl font-medium text-foreground tabular-nums">
        {value.toLocaleString()}
      </span>
    </Card>
  );
}
