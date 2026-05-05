import { useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, FileText, FileImage, X, Loader2, ChevronDown } from "lucide-react";
import type { Section, SectionItem } from "@/constants/assessmentSectionData";
import epsLogo from "@/assets/eps-logo.png";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface AssessmentPreviewData {
  schoolName: string;
  examTitle: string;
  className: string;
  subject: string;
  totalMarks: string;
  duration: string;
  instructions: string;
  sections: Section[];
}

interface AssessmentPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AssessmentPreviewData;
}

const getInstructionLines = (instructions: string) =>
  instructions
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^general instructions:?$/i.test(line))
    .map((line) => line.replace(/^(?:[ivxlcdm]+\.|\d+\.|[-•])\s*/i, ""));

const getSubQuestionLabel = (index: number, style: SectionItem["subQuestionStyle"] = "alpha") => {
  const roman = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
  return style === "roman" ? `${roman[index] ?? index + 1})` : `${String.fromCharCode(97 + index)})`;
};

const QuestionPreview = ({ item, label }: { item: SectionItem; label: string }) => (
  <div className="flex gap-3 break-inside-avoid">
    <span className="w-10 shrink-0 text-right font-medium">{label}</span>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between gap-4">
        <p className="whitespace-pre-line">{item.question || "Untitled question"}</p>
        <span className="font-medium shrink-0">[{item.score || 0}]</span>
      </div>
      {item.options && item.options.length > 0 && (
        <div className="grid grid-cols-2 gap-x-10 gap-y-1 mt-2 pl-6">
          {item.options.map((option, index) => (
            <p key={`${item.id}-option-${index}`}>
              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </p>
          ))}
        </div>
      )}
      {item.subItems && item.subItems.length > 0 && (
        <div className="mt-2 space-y-1 pl-6">
          {item.subItems.map((subItem, index) => (
            <div key={subItem.id} className="flex justify-between gap-4">
              <p>
                <span className="font-medium mr-2">{getSubQuestionLabel(index, item.subQuestionStyle)}</span>
                {subItem.question || "Untitled sub-question"}
              </p>
              <span className="font-medium shrink-0">[{subItem.score || 0}]</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const AssessmentPreviewModal = ({ open, onOpenChange, data }: AssessmentPreviewModalProps) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<"pdf" | "image" | null>(null);
  const instructionLines = getInstructionLines(data.instructions);

  const handlePrint = useCallback(() => {
    if (!paperRef.current) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>${data.examTitle}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 32px; color: #000; line-height: 1.5; }
            h1, h2, h3 { margin: 0; }
            .center { text-align: center; }
            img { height: 80px; }
            hr { border: none; border-top: 1px solid #000; margin: 8px 0; }
          </style>
        </head>
        <body>${paperRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  }, [data.examTitle]);

  const handleDownloadPDF = useCallback(async () => {
    if (!paperRef.current) return;
    setExporting("pdf");
    try {
      const canvas = await html2canvas(paperRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${data.examTitle.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setExporting(null);
    }
  }, [data.examTitle]);

  const handleDownloadImage = useCallback(async () => {
    if (!paperRef.current) return;
    setExporting("image");
    try {
      const canvas = await html2canvas(paperRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `${data.examTitle.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image downloaded");
    } catch {
      toast.error("Failed to export image");
    } finally {
      setExporting(null);
    }
  }, [data.examTitle]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[1100px] w-[95vw] h-[92vh] p-0 overflow-hidden gap-0 [&>button:last-child]:hidden flex flex-col"
        aria-describedby={undefined}
      >
        <VisuallyHidden>
          <DialogTitle>Assessment Preview</DialogTitle>
        </VisuallyHidden>

        <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30 shrink-0">
          <div>
            <h2 className="text-base font-medium text-foreground">Assessment Preview</h2>
            <p className="text-xs text-muted-foreground">Review the generated paper before publishing</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-2" disabled={!!exporting}>
                  {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" /> Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadImage} className="gap-2 cursor-pointer">
                  <FileImage className="w-4 h-4" /> Download as Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div
            ref={paperRef}
            className="mx-auto bg-background shadow-lg max-w-[820px] px-12 py-10 text-foreground font-serif"
            style={{ fontFamily: "'Times New Roman', Times, serif", lineHeight: 1.55, fontSize: "14px" }}
          >
            <div className="text-center">
              <h1 className="text-xl font-medium tracking-wide uppercase">{data.schoolName}</h1>
              <h2 className="text-base font-medium mt-1 uppercase">{data.examTitle || "ASSESSMENT PREVIEW"}</h2>
            </div>

            <div className="flex justify-end mt-4">
              <img src={epsLogo} alt="School logo" className="h-20 w-auto object-contain" />
            </div>
            <div className="flex items-start justify-between mt-2 gap-4">
              <div className="text-sm space-y-1">
                <p><strong>Class :</strong> {data.className || "—"}</p>
                <p><strong>Subject :</strong> {data.subject || "—"}</p>
              </div>
              <div className="text-sm space-y-1 text-right">
                <p><strong>Total Marks:</strong> {data.totalMarks || "—"}</p>
                <p><strong>Time:</strong> {data.duration || "—"}</p>
              </div>
            </div>

            <div className="text-sm">
              <p className="italic font-medium">General Instructions:</p>
              <ol className="list-[lower-roman] pl-6 mt-1 space-y-0.5">
                {(instructionLines.length ? instructionLines : ["Answer all questions as instructed."]).map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ol>
            </div>

            {data.sections.map((section) => (
              <div key={section.id} className="mt-5">
                <div className="text-center">
                  <h3 className="font-medium underline">SECTION - {section.label}</h3>
                  {section.description && <p className="text-sm font-medium">{section.description}</p>}
                </div>

                <div className="mt-4 space-y-4 text-sm">
                  {section.items.length === 0 && (
                    <p className="text-center italic text-gray-600">No questions added in this section.</p>
                  )}
                  {section.items.map((item, index) => (
                    <div key={item.id} className="space-y-3">
                      <QuestionPreview item={item} label={item.orItem ? `${index + 1}. A` : `${index + 1}.`} />
                      {item.orItem && (
                        <>
                          <div className="flex items-center gap-3 px-10" aria-label="OR divider">
                            <span className="h-px flex-1 bg-current opacity-50" />
                            <span className="font-medium tracking-wide">OR</span>
                            <span className="h-px flex-1 bg-current opacity-50" />
                          </div>
                          <QuestionPreview item={item.orItem} label={`${index + 1}. B`} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-center text-xs mt-8 opacity-70">— End of Question Paper —</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentPreviewModal;
