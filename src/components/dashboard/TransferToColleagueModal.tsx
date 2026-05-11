import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Assessment } from "@/data/assessments";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, UserPlus } from "lucide-react";

interface Colleague {
  id: string;
  name: string;
  initials: string;
  subject: string;
}

const COLLEAGUES: Colleague[] = [
  { id: "t1", name: "Rajesh Kumar", initials: "RK", subject: "Mathematics" },
  { id: "t2", name: "Sneha Iyer", initials: "SI", subject: "Physics" },
  { id: "t3", name: "Arun Verma", initials: "AV", subject: "Mathematics" },
  { id: "t4", name: "Priya Menon", initials: "PM", subject: "Chemistry" },
  { id: "t5", name: "Vikram Singh", initials: "VS", subject: "Physics" },
  { id: "t6", name: "Neha Gupta", initials: "NG", subject: "Biology" },
];

interface TransferToColleagueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: Assessment;
}

export function TransferToColleagueModal({
  open,
  onOpenChange,
  assessment,
}: TransferToColleagueModalProps) {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string>("");
  const [reason, setReason] = useState("");

  const selected = COLLEAGUES.find((c) => c.id === selectedId);

  const handleClose = (next: boolean) => {
    if (!next) {
      setSelectedId("");
      setReason("");
    }
    onOpenChange(next);
  };

  const handleSubmit = () => {
    toast({
      title: "Transfer request sent to HOD",
      description: `Your request to reassign “${assessment.title}” to ${selected?.name} has been sent to the HOD for approval.`,
    });
    handleClose(false);
  };

  const canSubmit = selectedId && reason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Transfer to colleague</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {assessment.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="colleague">Select colleague</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger id="colleague" className="h-11">
                <SelectValue placeholder="Choose a teacher" />
              </SelectTrigger>
              <SelectContent>
                {COLLEAGUES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        · {c.subject}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">You</span>
              <ArrowRight className="h-3.5 w-3.5" />
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
                  {selected.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{selected.name}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for transfer</Label>
            <Textarea
              id="reason"
              placeholder="Add a short note explaining why you're transferring this assessment…"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Send transfer request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
