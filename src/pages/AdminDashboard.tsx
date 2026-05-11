import { useMemo, useState } from "react";
import { useRole } from "@/context/RoleContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Printer,
  History,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Hash,
  Calendar as CalendarIcon,
  GraduationCap,
  BookOpen,
  Timer,
  User as UserIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { sampleQP } from "@/data/sampleQP";

type PrintJob = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  copies: number;
  sentBy: string;
  sentAt: string; // ISO
  printedAt?: string;
};

const initialQueue: PrintJob[] = [
  {
    id: "qp-1042",
    title: "Periodic Assessment 1 — Mathematics",
    subject: "Mathematics",
    grade: "Class 9",
    copies: 120,
    sentBy: "Anita Sharma (HM)",
    sentAt: "2026-05-10T09:24:00",
  },
  {
    id: "qp-1043",
    title: "Mid-term — English",
    subject: "English",
    grade: "Class 9",
    copies: 95,
    sentBy: "Anita Sharma (HM)",
    sentAt: "2026-05-10T11:02:00",
  },
  {
    id: "qp-1044",
    title: "Unit Test 2 — Biology",
    subject: "Biology",
    grade: "Class 9",
    copies: 60,
    sentBy: "Anita Sharma (HM)",
    sentAt: "2026-05-11T08:15:00",
  },
];

const initialLogs: PrintJob[] = [
  {
    id: "qp-1039",
    title: "PA2 — Chemistry",
    subject: "Chemistry",
    grade: "Class 10",
    copies: 110,
    sentBy: "Anita Sharma (HM)",
    sentAt: "2026-05-08T10:00:00",
    printedAt: "2026-05-08T14:32:00",
  },
  {
    id: "qp-1040",
    title: "Unit Test 1 — Physics",
    subject: "Physics",
    grade: "Class 10",
    copies: 85,
    sentBy: "Anita Sharma (HM)",
    sentAt: "2026-05-09T09:10:00",
    printedAt: "2026-05-09T15:48:00",
  },
];

function formatDateTime(s: string) {
  return new Date(s).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const { user } = useRole();
  const [tab, setTab] = useState<"queue" | "logs">("queue");
  const [queue, setQueue] = useState<PrintJob[]>(initialQueue);
  const [logs, setLogs] = useState<PrintJob[]>(initialLogs);
  const [search, setSearch] = useState("");

  const filteredQueue = useMemo(
    () =>
      queue.filter((j) =>
        [j.title, j.subject, j.grade, j.id]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [queue, search]
  );
  const filteredLogs = useMemo(
    () =>
      logs.filter((j) =>
        [j.title, j.subject, j.grade, j.id]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [logs, search]
  );

  const totalCopies = queue.reduce((s, j) => s + j.copies, 0);

  const handlePrint = (job: PrintJob) => {
    setQueue((q) => q.filter((j) => j.id !== job.id));
    setLogs((l) => [{ ...job, printedAt: new Date().toISOString() }, ...l]);
    toast.success("Sent to print", {
      description: `${job.title} • ${job.copies} copies`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight text-foreground tracking-tight">
            Hello, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Question papers awaiting print from the Head Master.
          </p>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile
          tone="lavender"
          icon={<Printer className="h-3.5 w-3.5" />}
          label="To be printed"
          value={queue.length}
          caption={`${totalCopies} copies in total`}
        />
        <StatTile
          tone="sky"
          icon={<Hash className="h-3.5 w-3.5" />}
          label="Total copies queued"
          value={totalCopies}
          caption="across all papers"
        />
        <StatTile
          tone="mint"
          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          label="Sent to print"
          value={logs.length}
          caption="completed print jobs"
        />
      </div>

      {/* Tabs + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Admin print sections"
          className="inline-flex items-center gap-2"
        >
          <TabPill
            active={tab === "queue"}
            onClick={() => setTab("queue")}
            icon={<Printer className="h-4 w-4" />}
            label="To be Printed"
            count={queue.length}
          />
          <TabPill
            active={tab === "logs"}
            onClick={() => setTab("logs")}
            icon={<History className="h-4 w-4" />}
            label="Sent to Print"
            count={logs.length}
          />
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, subject, ID…"
            className="h-10 pl-9 rounded-full bg-card text-sm"
          />
        </div>
      </div>

      {/* Tab content */}
      {tab === "queue" ? (
        <Card className="rounded-3xl border border-border/70 bg-card shadow-soft-xs overflow-hidden">
          {filteredQueue.length === 0 ? (
            <EmptyRow
              icon={<Printer className="h-5 w-5 text-muted-foreground" />}
              title="Nothing in the print queue"
              subtitle="Question papers sent by the HM will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Question Paper</TableHead>
                  <TableHead>Class / Subject</TableHead>
                  <TableHead>Copies</TableHead>
                  <TableHead>Sent by</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueue.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {job.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">{job.grade}</div>
                      <div className="text-xs text-muted-foreground">
                        {job.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-secondary text-foreground text-xs font-medium tabular-nums">
                        <Hash className="h-3 w-3" />
                        {job.copies}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {job.sentBy}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDateTime(job.sentAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="h-9"
                        onClick={() => handlePrint(job)}
                      >
                        <Printer className="h-4 w-4 mr-1.5" />
                        Send to print
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      ) : (
        <Card className="rounded-3xl border border-border/70 bg-card shadow-soft-xs overflow-hidden">
          {filteredLogs.length === 0 ? (
            <EmptyRow
              icon={<History className="h-5 w-5 text-muted-foreground" />}
              title="No print history yet"
              subtitle="Once you send papers to print they will be logged here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Question Paper</TableHead>
                  <TableHead>Class / Subject</TableHead>
                  <TableHead>Copies</TableHead>
                  <TableHead>Sent by</TableHead>
                  <TableHead>Printed at</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success/10 text-success">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {job.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">{job.grade}</div>
                      <div className="text-xs text-muted-foreground">
                        {job.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-secondary text-foreground text-xs font-medium tabular-nums">
                        <Hash className="h-3 w-3" />
                        {job.copies}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {job.sentBy}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {job.printedAt ? formatDateTime(job.printedAt) : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-success/10 text-success text-[11.5px] font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Sent to print
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}
    </div>
  );
}

function TabPill({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm transition-all ring-1",
        active
          ? "bg-primary text-primary-foreground ring-primary shadow-soft-xs"
          : "bg-card text-foreground ring-border/70 hover:ring-primary/40 hover:bg-primary-soft/40"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-medium tabular-nums",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
        {icon}
      </div>
      <h3 className="mt-4 text-[15px] text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

type Tone = "lavender" | "peach" | "sky" | "mint";
const toneMap: Record<Tone, { bg: string; ink: string }> = {
  lavender: {
    bg: "bg-[hsl(var(--pastel-lavender))]",
    ink: "text-[hsl(var(--pastel-lavender-ink))]",
  },
  peach: {
    bg: "bg-[hsl(var(--pastel-peach))]",
    ink: "text-[hsl(var(--pastel-peach-ink))]",
  },
  sky: {
    bg: "bg-[hsl(var(--pastel-sky))]",
    ink: "text-[hsl(var(--pastel-sky-ink))]",
  },
  mint: {
    bg: "bg-[hsl(var(--pastel-mint))]",
    ink: "text-[hsl(var(--pastel-mint-ink))]",
  },
};

function StatTile({
  tone,
  icon,
  label,
  value,
  caption,
}: {
  tone: Tone;
  icon: React.ReactNode;
  label: string;
  value: number;
  caption: string;
}) {
  const t = toneMap[tone];
  return (
    <Card
      className={cn(
        "p-5 rounded-3xl border-0 shadow-soft-xs",
        t.bg
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-medium",
            t.ink
          )}
        >
          {icon}
          {label}
        </span>
      </div>
      <div className={cn("mt-3 text-3xl font-medium tabular-nums", t.ink)}>
        {value}
      </div>
      <div className={cn("mt-1 text-xs opacity-75", t.ink)}>{caption}</div>
    </Card>
  );
}
