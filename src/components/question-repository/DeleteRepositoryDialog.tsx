import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FolderClosed, AlertTriangle } from "lucide-react";

interface DeleteRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositoryName: string;
  questionCount: number;
  onConfirm: () => void;
}

const DeleteRepositoryDialog = ({
  open,
  onOpenChange,
  repositoryName,
  questionCount,
  onConfirm,
}: DeleteRepositoryDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-base">Delete Repository</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{repositoryName}</span>? This will
              permanently remove the repository
              {questionCount > 0 && (
                <>
                  {" "}and all{" "}
                  <span className="font-semibold text-foreground">{questionCount}</span> question
                  {questionCount !== 1 ? "s" : ""} within it
                </>
              )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3 mt-1">
          <FolderClosed className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{repositoryName}</p>
            <p className="text-xs text-muted-foreground">
              {questionCount} question{questionCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <AlertDialogFooter className="pt-2 gap-2 sm:gap-0">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Repository
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRepositoryDialog;
