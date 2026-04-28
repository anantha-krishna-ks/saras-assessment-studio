export interface QPQuestion {
  number: string;
  text: string;
  marks: number;
  type?: "MCQ" | "Short Answer" | "Long Answer" | "Case Study";
  options?: string[];
  answer: string;
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
          answer: "C. {1, 2, 3, 4}",
        },
        {
          number: "2",
          type: "MCQ",
          marks: 1,
          text: "The value of sin 30° + cos 60° is:",
          options: ["0", "1", "½", "√3/2"],
          answer: "B. 1",
        },
        {
          number: "3",
          type: "MCQ",
          marks: 1,
          text: "The number of subsets of a set containing 4 elements is:",
          options: ["8", "12", "16", "32"],
          answer: "C. 16  (since 2⁴ = 16)",
        },
        {
          number: "4",
          type: "MCQ",
          marks: 1,
          text: "If f(x) = x² + 1, then f(−2) equals:",
          options: ["3", "5", "−3", "−5"],
          answer: "B. 5  (f(−2) = (−2)² + 1 = 5)",
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
          answer: "A = {1, 2, 3, 4, 5}; n(A) = 5.",
        },
        {
          number: "6",
          type: "Short Answer",
          marks: 2,
          text: "Convert 5π/3 radians into degree measure.",
          answer: "5π/3 × (180°/π) = 300°.",
        },
        {
          number: "7",
          type: "Short Answer",
          marks: 2,
          text: "Find the domain of the function f(x) = 1 / (x² − 4).",
          answer: "x² − 4 ≠ 0 ⇒ x ≠ ±2. Domain: ℝ − {−2, 2}.",
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
          answer:
            "Use sin(A+B)·sin(A−B) = sin²A − sin²B. With A = 60°, B = x: sin²60° − sin²x = 3/4 − sin²x. Hence proved.",
        },
        {
          number: "9",
          type: "Short Answer",
          marks: 3,
          text: "Let A = {1, 2, 3, 4}, B = {2, 4, 6}. Find A ∩ B, A − B, and B − A.",
          answer: "A ∩ B = {2, 4}; A − B = {1, 3}; B − A = {6}.",
        },
        {
          number: "10",
          type: "Short Answer",
          marks: 3,
          text: "If tan x = 3/4 and x lies in the third quadrant, find sin x and cos x.",
          answer:
            "In Q3, both sin and cos are negative. With tan x = 3/4 ⇒ sin x = −3/5, cos x = −4/5.",
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
          answer:
            "Start from cos(x+x) = cos²x − sin²x. Using sin²x = 1 − cos²x and cos²x = 1 − sin²x gives the other forms. For cos 15° = cos(45° − 30°) = cos45°cos30° + sin45°sin30° = (√6 + √2)/4.",
        },
        {
          number: "12",
          type: "Long Answer",
          marks: 5,
          text: "In a survey of 60 people, it was found that 25 read newspaper H, 26 read newspaper T, 26 read newspaper I, 9 read both H and I, 11 read both H and T, 8 read both T and I, and 3 read all three. Find the number of people who read at least one newspaper.",
          answer:
            "By inclusion–exclusion: |H ∪ T ∪ I| = 25 + 26 + 26 − 11 − 9 − 8 + 3 = 52. So 52 people read at least one newspaper.",
        },
      ],
    },
  ],
};
