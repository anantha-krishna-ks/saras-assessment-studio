import type { ItemType } from "./assessmentSectionData";

export interface RepositoryQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  score: number;
  type: ItemType;
}

export interface RepositoryFolder {
  id: string;
  name: string;
  children?: RepositoryFolder[];
  questions: RepositoryQuestion[];
}

export const REPOSITORY_FOLDERS: RepositoryFolder[] = [
  {
    id: "folder-1",
    name: "Mathematics",
    questions: [
      { id: "q-m-1", question: "What is the value of π (pi) rounded to two decimal places?", score: 1, type: "Short Answer", correctAnswer: "3.14" },
      { id: "q-m-2", question: "Which of the following is a prime number?", options: ["4", "6", "7", "9"], correctAnswer: "7", score: 1, type: "Multiple Choice" },
      { id: "q-m-3", question: "The square root of 144 is 12.", correctAnswer: "True", score: 1, type: "True / False" },
    ],
    children: [
      {
        id: "folder-1-1",
        name: "Algebra",
        questions: [
          { id: "q-a-1", question: "Solve for x: 2x + 5 = 15", score: 2, type: "Short Answer", correctAnswer: "5" },
          { id: "q-a-2", question: "The ______ of a quadratic equation ax² + bx + c = 0 is given by b² - 4ac.", score: 1, type: "Fill in the Blank", correctAnswer: "discriminant" },
        ],
        children: [],
      },
      {
        id: "folder-1-2",
        name: "Geometry",
        questions: [
          { id: "q-g-1", question: "What is the sum of interior angles of a triangle?", options: ["90°", "180°", "270°", "360°"], correctAnswer: "180°", score: 1, type: "Multiple Choice" },
          { id: "q-g-2", question: "A circle has ______ degrees.", score: 1, type: "Fill in the Blank", correctAnswer: "360" },
        ],
        children: [],
      },
    ],
  },
  {
    id: "folder-2",
    name: "Science",
    questions: [
      { id: "q-s-1", question: "Water boils at 100°C at sea level.", correctAnswer: "True", score: 1, type: "True / False" },
      { id: "q-s-2", question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: "Mars", score: 1, type: "Multiple Choice" },
    ],
    children: [
      {
        id: "folder-2-1",
        name: "Physics",
        questions: [
          { id: "q-p-1", question: "The SI unit of force is ______.", score: 1, type: "Fill in the Blank", correctAnswer: "Newton" },
          { id: "q-p-2", question: "Speed of light is approximately 3 × 10⁸ m/s.", correctAnswer: "True", score: 1, type: "True / False" },
        ],
        children: [],
      },
      {
        id: "folder-2-2",
        name: "Chemistry",
        questions: [
          { id: "q-c-1", question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correctAnswer: "Au", score: 1, type: "Multiple Choice" },
        ],
        children: [],
      },
    ],
  },
  {
    id: "folder-3",
    name: "English",
    questions: [
      { id: "q-e-1", question: "A ______ is a word that describes a noun.", score: 1, type: "Fill in the Blank", correctAnswer: "adjective" },
      { id: "q-e-2", question: "'Their', 'There', and 'They're' are homophones.", correctAnswer: "True", score: 1, type: "True / False" },
    ],
    children: [],
  },
];
