export type TrackerStageKey =
  | "created"
  | "subCoordinatorReview"
  | "subTeacherRework"
  | "subCoordinatorApproved"
  | "hmApproved"
  | "printing";

export interface TrackerStage {
  key: TrackerStageKey;
  label: string;
  actor?: string;
  timestamp?: string;
  status: "complete" | "current" | "pending";
}

export interface TrackerItem {
  id: string;
  title: string;
  grade: string;
  subject: string;
  type: string;
  teacher: string;
  stages: TrackerStage[];
}

const baseStages = (
  vals: Partial<Record<TrackerStageKey, { actor?: string; timestamp?: string; status: TrackerStage["status"] }>>
): TrackerStage[] => {
  const defs: { key: TrackerStageKey; label: string }[] = [
    { key: "created", label: "QP created" },
    { key: "subCoordinatorReview", label: "QP with Sub-Coordinator for review" },
    { key: "subTeacherRework", label: "QP with Sub-Teacher for rework" },
    { key: "subCoordinatorApproved", label: "QP approved by Sub-Coordinator" },
    { key: "hmApproved", label: "QP approved by HM" },
    { key: "printing", label: "QP verified and sent for printing" },
  ];
  return defs.map((d) => ({
    key: d.key,
    label: d.label,
    status: vals[d.key]?.status ?? "pending",
    actor: vals[d.key]?.actor,
    timestamp: vals[d.key]?.timestamp,
  }));
};

export const trackerItems: TrackerItem[] = [
  {
    id: "tr-001",
    title: "Class 6 Mathematics — PA1",
    grade: "Class 6",
    subject: "Mathematics",
    type: "PA1",
    teacher: "Mr. Rajesh Kumar",
    stages: baseStages({
      created: { actor: "Mr. Rajesh Kumar", timestamp: "22 Apr 2026, 10:14 AM", status: "complete" },
      subCoordinatorReview: { actor: "Ms. Anita Sharma", timestamp: "23 Apr 2026, 09:00 AM", status: "complete" },
      subTeacherRework: { actor: "Mr. Rajesh Kumar", timestamp: "24 Apr 2026, 02:30 PM", status: "complete" },
      subCoordinatorApproved: { actor: "Ms. Anita Sharma", timestamp: "26 Apr 2026, 11:20 AM", status: "complete" },
      hmApproved: { actor: "Dr. Meera Iyer", timestamp: "28 Apr 2026, 04:05 PM", status: "current" },
    }),
  },
  {
    id: "tr-002",
    title: "Class 7 Science — PA2",
    grade: "Class 7",
    subject: "Science",
    type: "PA2",
    teacher: "Ms. Anita Sharma",
    stages: baseStages({
      created: { actor: "Ms. Anita Sharma", timestamp: "20 Apr 2026, 09:42 AM", status: "complete" },
      subCoordinatorReview: { actor: "Mr. Suresh Menon", timestamp: "21 Apr 2026, 10:10 AM", status: "complete" },
      subCoordinatorApproved: { actor: "Mr. Suresh Menon", timestamp: "23 Apr 2026, 03:48 PM", status: "complete" },
      hmApproved: { actor: "Dr. Meera Iyer", timestamp: "25 Apr 2026, 11:00 AM", status: "complete" },
      printing: { actor: "Print Cell", timestamp: "27 Apr 2026, 09:30 AM", status: "complete" },
    }),
  },
  {
    id: "tr-003",
    title: "Class 8 English — Mid Term",
    grade: "Class 8",
    subject: "English",
    type: "Mid Term",
    teacher: "Mrs. Priya Nair",
    stages: baseStages({
      created: { actor: "Mrs. Priya Nair", timestamp: "18 Apr 2026, 12:00 PM", status: "complete" },
      subCoordinatorReview: { actor: "Mr. Karthik Rao", timestamp: "19 Apr 2026, 10:30 AM", status: "complete" },
      subTeacherRework: { actor: "Mrs. Priya Nair", timestamp: "21 Apr 2026, 02:15 PM", status: "current" },
    }),
  },
  {
    id: "tr-004",
    title: "Class 9 Social Studies — Unit Test",
    grade: "Class 9",
    subject: "Social Studies",
    type: "Unit Test",
    teacher: "Mr. Vikram Singh",
    stages: baseStages({
      created: { actor: "Mr. Vikram Singh", timestamp: "25 Apr 2026, 08:50 AM", status: "complete" },
      subCoordinatorReview: { actor: "Ms. Anita Sharma", timestamp: "26 Apr 2026, 09:15 AM", status: "current" },
    }),
  },
  {
    id: "tr-005",
    title: "Class 10 Mathematics — PA1",
    grade: "Class 10",
    subject: "Mathematics",
    type: "PA1",
    teacher: "Ms. Kavya Iyer",
    stages: baseStages({
      created: { actor: "Ms. Kavya Iyer", timestamp: "15 Apr 2026, 10:00 AM", status: "complete" },
      subCoordinatorReview: { actor: "Mr. Suresh Menon", timestamp: "16 Apr 2026, 11:20 AM", status: "complete" },
      subCoordinatorApproved: { actor: "Mr. Suresh Menon", timestamp: "18 Apr 2026, 04:00 PM", status: "complete" },
      hmApproved: { actor: "Dr. Meera Iyer", timestamp: "20 Apr 2026, 09:30 AM", status: "complete" },
      printing: { actor: "Print Cell", timestamp: "22 Apr 2026, 10:00 AM", status: "complete" },
    }),
  },
  {
    id: "tr-006",
    title: "Class 11 Physics — PA1",
    grade: "Class 11",
    subject: "Physics",
    type: "PA1",
    teacher: "Dr. Sameer Khan",
    stages: baseStages({
      created: { actor: "Dr. Sameer Khan", timestamp: "29 Apr 2026, 09:00 AM", status: "complete" },
      subCoordinatorReview: { actor: "Mr. Karthik Rao", timestamp: "30 Apr 2026, 10:45 AM", status: "current" },
    }),
  },
];
