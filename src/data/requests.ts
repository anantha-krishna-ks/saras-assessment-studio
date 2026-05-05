export type RequestStatus = "Pending" | "Accepted" | "Rejected";

export interface ReassignmentRequest {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  subject: string;
  grade: string;
  originalTeacher: string;
  requestingTeacher: string;
  requestingTeacherInitials: string;
  reason: string;
  requestedAt: string;
  status: RequestStatus;
}

export const reassignmentRequests: ReassignmentRequest[] = [
  {
    id: "r1",
    assessmentId: "a1",
    assessmentTitle: "Periodic Assessment 1 — Mathematics",
    subject: "Mathematics",
    grade: "Class 9",
    originalTeacher: "Rajesh Kumar",
    requestingTeacher: "Arun Verma",
    requestingTeacherInitials: "AV",
    reason: "Rajesh is on medical leave this week.",
    requestedAt: "2026-04-27",
    status: "Pending",
  },
  {
    id: "r2",
    assessmentId: "a2",
    assessmentTitle: "Unit Test 1 — Physics",
    subject: "Physics",
    grade: "Class 10",
    originalTeacher: "Sneha Iyer",
    requestingTeacher: "Vikram Singh",
    requestingTeacherInitials: "VS",
    reason: "Covering Sneha's section during her workshop.",
    requestedAt: "2026-04-28",
    status: "Pending",
  },
];
