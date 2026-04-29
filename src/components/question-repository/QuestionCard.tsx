export type QuestionType =
  | "short-answer"
  | "multiple-choice"
  | "true-false"
  | "matching"
  | "fill-blank"
  | "assertion-reasoning";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  "short-answer": "Short Answer",
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  matching: "Match the Following",
  "fill-blank": "Fill in the Blank",
  "assertion-reasoning": "Assertion Reasoning",
};
