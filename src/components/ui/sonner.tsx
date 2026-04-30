import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      icons={{
        success: (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
          </span>
        ),
        error: (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-500 text-red-500">
            <AlertCircle className="h-4 w-4" strokeWidth={2.5} />
          </span>
        ),
        warning: (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-amber-500 text-amber-500">
            <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
          </span>
        ),
        info: (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-sky-500 text-sky-500">
            <Info className="h-4 w-4" strokeWidth={2.5} />
          </span>
        ),
        loading: (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted-foreground text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
          </span>
        ),
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-border bg-background p-4 pl-5 pr-6 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.15)] before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:rounded-l-2xl",
          title: "text-[15px] font-medium text-foreground leading-tight",
          description: "text-sm text-muted-foreground mt-1 leading-snug",
          icon: "flex-shrink-0 mt-0.5",
          success: "before:bg-emerald-500",
          error: "before:bg-red-500",
          warning: "before:bg-amber-500",
          info: "before:bg-sky-500",
          default: "before:bg-primary",
          closeButton:
            "!bg-background !border-border !text-muted-foreground hover:!text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
