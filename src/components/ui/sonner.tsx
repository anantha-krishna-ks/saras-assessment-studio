import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CheckCircle2, XCircle, Info, AlertTriangle, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      closeButton
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={2.25} />,
        error: <XCircle className="h-5 w-5 text-red-500" strokeWidth={2.25} />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-500" strokeWidth={2.25} />,
        info: <Info className="h-5 w-5 text-sky-500" strokeWidth={2.25} />,
        loading: <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" strokeWidth={2.25} />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-border/60 bg-background p-4 pl-5 pr-6 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.18)] backdrop-blur-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-2xl",
          title: "text-[14px] font-medium text-foreground leading-tight tracking-tight",
          description: "text-[13px] text-muted-foreground mt-0.5 leading-snug",
          icon: "flex-shrink-0 mt-0.5",
          success: "before:bg-emerald-500",
          error: "before:bg-red-500",
          warning: "before:bg-amber-500",
          info: "before:bg-sky-500",
          default: "before:bg-primary",
          closeButton:
            "!left-auto !right-3 !top-3 !translate-x-0 !translate-y-0 !h-6 !w-6 !rounded-full !bg-background !border-border/60 !text-muted-foreground hover:!text-foreground hover:!bg-muted opacity-0 group-hover:opacity-100 transition-opacity",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
