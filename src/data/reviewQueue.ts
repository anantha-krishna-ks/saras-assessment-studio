export type ReviewStatus =
  | "Submitted to teacher"
  | "Waiting for approval"
  | "Reverted for revision"
  | "Approved";

export interface ReviewQPItem {
  id: string;
  title: string;
  grade: string;
  subject: string;
  type: string;
  teacher: string;
  teacherInitials: string;
  submittedOn: string;
  dueBy: string;
  totalMarks: number;
  totalQuestions: number;
  duration: string;
  status: ReviewStatus;
}

export const reviewQueue: ReviewQPItem[] = [
  {
    id: "qp-001",
    title: "Class 6 — PA1",
    grade: "Class 6",
    subject: "Mathematics",
    type: "PA1",
    teacher: "Mr. Rajesh Kumar",
    teacherInitials: "RK",
    submittedOn: "28 Apr 2026",
    dueBy: "02 May 2026",
    totalMarks: 40,
    totalQuestions: 12,
    duration: "1h 30m",
    status: "Waiting for approval",
  },
  {
    id: "qp-002",
    title: "Class 7 — PA2",
    grade: "Class 7",
    subject: "Science",
    type: "PA2",
    teacher: "Ms. Anita Sharma",
    teacherInitials: "AS",
    submittedOn: "27 Apr 2026",
    dueBy: "01 May 2026",
    totalMarks: 50,
    totalQuestions: 15,
    duration: "2h",
    status: "Waiting for approval",
  },
  {
    id: "qp-003",
    title: "Class 8 — Mid Term",
    grade: "Class 8",
    subject: "English",
    type: "Mid Term",
    teacher: "Mrs. Priya Nair",
    teacherInitials: "PN",
    submittedOn: "26 Apr 2026",
    dueBy: "30 Apr 2026",
    totalMarks: 80,
    totalQuestions: 20,
    duration: "3h",
    status: "Reverted for revision",
  },
  {
    id: "qp-004",
    title: "Class 9 — Unit Test 2",
    grade: "Class 9",
    subject: "Social Studies",
    type: "Unit Test",
    teacher: "Mr. Vikram Singh",
    teacherInitials: "VS",
    submittedOn: "25 Apr 2026",
    dueBy: "29 Apr 2026",
    totalMarks: 25,
    totalQuestions: 10,
    duration: "45m",
    status: "Submitted to teacher",
  },
  {
    id: "qp-005",
    title: "Class 10 — PA1",
    grade: "Class 10",
    subject: "Mathematics",
    type: "PA1",
    teacher: "Ms. Kavya Iyer",
    teacherInitials: "KI",
    submittedOn: "22 Apr 2026",
    dueBy: "26 Apr 2026",
    totalMarks: 40,
    totalQuestions: 14,
    duration: "1h 30m",
    status: "Approved",
  },
  {
    id: "qp-006",
    title: "Class 11 — PA1",
    grade: "Class 11",
    subject: "Physics",
    type: "PA1",
    teacher: "Dr. Sameer Khan",
    teacherInitials: "SK",
    submittedOn: "29 Apr 2026",
    dueBy: "03 May 2026",
    totalMarks: 40,
    totalQuestions: 12,
    duration: "1h 30m",
    status: "Waiting for approval",
  },
];
