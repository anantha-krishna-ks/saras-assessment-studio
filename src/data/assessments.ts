export type AssessmentStatus = "Not yet started" | "Draft" | "Not yet received" | "Reverted" | "Accepted";

export interface Assessment {
  id: string;
  title: string;
  type: "PA1" | "PA2" | "Mid-term" | "Final Exam" | "Unit Test 1" | "Unit Test 2" | "Unit Test 3";
  subject: string;
  grade: string;
  status: AssessmentStatus;
  createdAt: string;
  scheduledAt: string;
  dueAt: string;
  questions: number;
  sections: number;
  totalMarks: number;
  reviewer?: string;
}

export const assessments: Assessment[] = [
  {
    id: "a1",
    title: "Periodic Assessment 1 — Mathematics",
    type: "PA1",
    subject: "Mathematics",
    grade: "Grade 9",
    status: "Not yet received",
    createdAt: "2026-04-02",
    scheduledAt: "2026-05-04",
    dueAt: "2026-05-01",
    questions: 24,
    sections: 4,
    totalMarks: 50,
    reviewer: "Mr. Rao",
  },
  {
    id: "a2",
    title: "Unit Test 1 — Physics",
    type: "Unit Test 1",
    subject: "Physics",
    grade: "Grade 10",
    status: "Draft",
    createdAt: "2026-04-15",
    scheduledAt: "2026-05-12",
    dueAt: "2026-05-08",
    questions: 15,
    sections: 3,
    totalMarks: 30,
  },
  {
    id: "a3",
    title: "Mid-term — English",
    type: "Mid-term",
    subject: "English",
    grade: "Grade 9",
    status: "Not yet started",
    createdAt: "2026-04-20",
    scheduledAt: "2026-06-10",
    dueAt: "2026-06-05",
    questions: 30,
    sections: 5,
    totalMarks: 80,
  },
  {
    id: "a4",
    title: "PA2 — Chemistry",
    type: "PA2",
    subject: "Chemistry",
    grade: "Grade 10",
    status: "Accepted",
    createdAt: "2026-02-10",
    scheduledAt: "2026-03-15",
    dueAt: "2026-03-12",
    questions: 22,
    sections: 4,
    totalMarks: 50,
  },
  {
    id: "a5",
    title: "Unit Test 2 — Biology",
    type: "Unit Test 2",
    subject: "Biology",
    grade: "Grade 9",
    status: "Not yet started",
    createdAt: "2026-04-22",
    scheduledAt: "2026-05-22",
    dueAt: "2026-05-18",
    questions: 18,
    sections: 3,
    totalMarks: 30,
  },
  {
    id: "a6",
    title: "Final Exam — Mathematics",
    type: "Final Exam",
    subject: "Mathematics",
    grade: "Grade 10",
    status: "Not yet started",
    createdAt: "2026-04-25",
    scheduledAt: "2026-06-28",
    dueAt: "2026-06-20",
    questions: 40,
    sections: 6,
    totalMarks: 100,
  },
];
