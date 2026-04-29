import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import type { QuestionType } from "./QuestionCard";

interface AddItemsDropdownProps {
  onAdd: (type: QuestionType) => void;
  onCopyQuestion?: () => void;
  disabled?: boolean;
}

const ITEM_TYPES: { type: QuestionType; label: string }[] = [
  { type: "short-answer", label: "Short Answer" },
  { type: "multiple-choice", label: "Multiple Choice" },
  { type: "true-false", label: "True / False" },
  { type: "matching", label: "Match the Following" },
  { type: "fill-blank", label: "Fill in the Blank" },
  { type: "assertion-reasoning", label: "Assertion Reasoning" },
];

const AddItemsDropdown = ({ onAdd, onCopyQuestion, disabled = false }: AddItemsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button className="gap-2" disabled={disabled} aria-disabled={disabled}>
          <Plus className="w-4 h-4" />
          Add Items
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {ITEM_TYPES.map(({ type, label }) => (
          <DropdownMenuItem key={type} onClick={() => onAdd(type)}>
            {label}
          </DropdownMenuItem>
        ))}
        {onCopyQuestion && (
          <>
            <div className="h-px bg-border my-1" />
            <DropdownMenuItem onClick={onCopyQuestion}>
              Copy Question
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddItemsDropdown;
