export interface QPQuestion {
  number: string;
  text: string;
  marks: number;
  type?: "MCQ" | "Short Answer" | "Long Answer" | "Case Study";
  options?: string[];
}

export interface QPSection {
  name: string;
  description: string;
  questions: QPQuestion[];
}

export interface QPDocument {
  title: string;
  subject: string;
  grade: string;
  type: string;
  totalMarks: number;
  duration: string;
  teacher: string;
  createdOn: string;
  generalInstructions: string[];
  sections: QPSection[];
}

export const sampleQP: QPDocument = {
  title: "Periodic Assessment 1 — Mathematics",
  subject: "Mathematics",
  grade: "Class 11",
  type: "PA1",
  totalMarks: 40,
  duration: "1 hour 30 minutes",
  teacher: "Mr. Rajesh Kumar",
  createdOn: "24 Apr 2026",
  generalInstructions: [
    "All questions are compulsory.",
    "The question paper consists of 4 sections — A, B, C, and D.",
    "Section A contains multiple choice questions of 1 mark each.",
    "Section B contains short answer questions of 2 marks each.",
    "Section C contains short answer questions of 3 marks each.",
    "Section D contains long answer questions of 5 marks each.",
    "Use of calculator is not permitted.",
  ],
  sections: [
    {
      name: "Section A",
      description: "Multiple Choice Questions · 1 mark each",
      questions: [
        {
          number: "1",
          type: "MCQ",
          marks: 1,
          text: "If A = {1, 2, 3} and B = {3, 4}, then A ∪ B is:",
          options: ["{1, 2}", "{3}", "{1, 2, 3, 4}", "{1, 2, 3}"],
        },
        {
          number: "2",
          type: "MCQ",
          marks: 1,
          text: "The value of sin 30° + cos 60° is:",
          options: ["0", "1", "½", "√3/2"],
        },
        {
          number: "3",
          type: "MCQ",
          marks: 1,
          text: "The number of subsets of a set containing 4 elements is:",
          options: ["8", "12", "16", "32"],
        },
        {
          number: "4",
          type: "MCQ",
          marks: 1,
          text: "If f(x) = x² + 1, then f(−2) equals:",
          options: ["3", "5", "−3", "−5"],
        },
      ],
    },
    {
      name: "Section B",
      description: "Short Answer Questions · 2 marks each",
      questions: [
        {
          number: "5",
          type: "Short Answer",
          marks: 2,
          text: "If A = {x : x is a natural number less than 6}, write A in roster form and find n(A).",
        },
        {
          number: "6",
          type: "Short Answer",
          marks: 2,
          text: "Convert 5π/3 radians into degree measure.",
        },
        {
          number: "7",
          type: "Short Answer",
          marks: 2,
          text: "Find the domain of the function f(x) = 1 / (x² − 4).",
        },
      ],
    },
    {
      name: "Section C",
      description: "Short Answer Questions · 3 marks each",
      questions: [
        {
          number: "8",
          type: "Short Answer",
          marks: 3,
          text: "Prove that sin(60° + x) · sin(60° − x) = ¾ − sin²x.",
        },
        {
          number: "9",
          type: "Short Answer",
          marks: 3,
          text: "Let A = {1, 2, 3, 4}, B = {2, 4, 6}. Find A ∩ B, A − B, and B − A.",
        },
        {
          number: "10",
          type: "Short Answer",
          marks: 3,
          text: "If tan x = 3/4 and x lies in the third quadrant, find sin x and cos x.",
        },
      ],
    },
    {
      name: "Section D",
      description: "Long Answer Questions · 5 marks each",
      questions: [
        {
          number: "11",
          type: "Long Answer",
          marks: 5,
          text: "Prove that cos 2x = cos²x − sin²x = 2cos²x − 1 = 1 − 2sin²x. Hence evaluate cos 15°.",
        },
        {
          number: "12",
          type: "Long Answer",
          marks: 5,
          text: "In a survey of 60 people, it was found that 25 read newspaper H, 26 read newspaper T, 26 read newspaper I, 9 read both H and I, 11 read both H and T, 8 read both T and I, and 3 read all three. Find the number of people who read at least one newspaper.",
        },
      ],
    },
  ],
};
