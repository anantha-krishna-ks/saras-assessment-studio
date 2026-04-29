import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FolderPlus, Pencil } from "lucide-react";

interface RepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: { name: string; description: string; isRoot: boolean };
  onSave: (data: { name: string; description: string; isRoot: boolean }) => void;
}

const RepositoryDialog = ({ open, onOpenChange, mode, initialData, onSave }: RepositoryDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isRoot, setIsRoot] = useState(true);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setName(initialData.name);
        setDescription(initialData.description);
        setIsRoot(initialData.isRoot);
      } else {
        setName("");
        setDescription("");
        setIsRoot(true);
      }
    }
  }, [open, mode, initialData]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), isRoot });
    onOpenChange(false);
  };

  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              {isCreate ? <FolderPlus className="w-4 h-4 text-primary" /> : <Pencil className="w-4 h-4 text-primary" />}
            </div>
            <div>
              <DialogTitle className="text-base">
                {isCreate ? "New Repository" : "Edit Repository"}
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {isCreate
                  ? "Create a new repository to organize your questions"
                  : "Update repository details"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="repo-name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="repo-name"
              placeholder="e.g. Mathematics, Science..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repo-desc" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="repo-desc"
              placeholder="Brief description of this repository..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3.5">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium cursor-pointer" htmlFor="root-toggle">
                Root Repository
              </Label>
              <p className="text-xs text-muted-foreground">
                Root repositories appear at the top level
              </p>
            </div>
            <Switch id="root-toggle" checked={isRoot} onCheckedChange={setIsRoot} />
          </div>
        </div>

        <DialogFooter className="pt-2 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isCreate ? "Create" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RepositoryDialog;
