import { useCallback, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Brackets, Info } from "lucide-react";

interface FillInBlankEditorProps {
  value: string;
  onChange: (value: string) => void;
  includeWordBank: boolean;
  onWordBankChange: (value: boolean) => void;
}

const FillInBlankEditor = ({
  value,
  onChange,
  includeWordBank,
  onWordBankChange,
}: FillInBlankEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMarkWord = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return;

    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + `[${selectedText}]` + value.substring(end);
    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 1, end + 1);
    });
  }, [value, onChange]);

  const blanks = useMemo(() => {
    const matches = value.match(/\[(.*?)\]/g) || [];
    return matches.map((m) => m.slice(1, -1));
  }, [value]);

  const previewParts = useMemo(() => {
    if (!value || blanks.length === 0) return null;
    const parts = value.split(/\[.*?\]/);
    const result: { text: string; isBlank: boolean }[] = [];
    parts.forEach((part, i) => {
      if (part) result.push({ text: part, isBlank: false });
      if (i < blanks.length) result.push({ text: blanks[i], isBlank: true });
    });
    return result;
  }, [value, blanks]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="w-4 h-4 shrink-0" />
          <p className="text-xs">
            Type your sentence, select a word, then click <strong className="text-foreground">Mark as blank</strong>
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium shrink-0"
          onClick={handleMarkWord}
        >
          <Brackets className="w-3.5 h-3.5" />
          Mark as blank
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-muted/10 overflow-hidden">
        <Textarea
          ref={textareaRef}
          placeholder='e.g. The [brown] fox jumped over the [log].'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[130px] resize-y text-sm border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />

        <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-3">
            {blanks.length > 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {blanks.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  blank{blanks.length !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">No blanks yet</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="word-bank"
              checked={includeWordBank}
              onCheckedChange={(checked) => onWordBankChange(checked === true)}
              className="h-3.5 w-3.5"
            />
            <Label
              htmlFor="word-bank"
              className="text-xs font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              Show word bank
            </Label>
          </div>
        </div>
      </div>

      {previewParts && previewParts.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Preview
          </p>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <p className="text-sm leading-relaxed text-foreground">
              {previewParts.map((part, i) =>
                part.isBlank ? (
                  <span
                    key={i}
                    className="inline-block min-w-[60px] mx-0.5 border-b-2 border-primary text-center text-primary font-medium"
                  >
                    {"\u00A0\u00A0\u00A0\u00A0\u00A0"}
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </p>
          </div>

          {includeWordBank && blanks.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground mr-1">Word bank:</span>
              {blanks
                .slice()
                .sort(() => Math.random() - 0.5)
                .map((word, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                  >
                    {word}
                  </span>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FillInBlankEditor;
