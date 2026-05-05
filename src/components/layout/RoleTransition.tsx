import { useEffect, useState } from "react";
import { useRole } from "@/context/RoleContext";
import { ShieldCheck, Users, UserCog, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconFor: Record<string, LucideIcon> = {
  HOD: ShieldCheck,
  Teacher: Users,
  HM: UserCog,
};

export function RoleTransition() {
  const { switching, role } = useRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (switching) setMounted(true);
    else {
      const t = window.setTimeout(() => setMounted(false), 350);
      return () => window.clearTimeout(t);
    }
  }, [switching]);

  if (!mounted) return null;

  const Icon = iconFor[role] ?? ShieldCheck;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none",
        "transition-opacity duration-300",
        switching ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Backdrop wash */}
      <div
        className={cn(
          "absolute inset-0 bg-background/70 backdrop-blur-md",
          "transition-opacity duration-300"
        )}
      />

      {/* Card */}
      <div
        className={cn(
          "relative flex flex-col items-center gap-4 px-10 py-8 rounded-3xl bg-card border border-border shadow-soft-md",
          "transition-all duration-500",
          switching ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-2"
        )}
      >
        {/* Pulsing rings */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
          <span className="absolute inset-2 rounded-full bg-primary/10" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Icon className="h-6 w-6" />
          </span>
        </div>

        <div className="text-center">
          <div className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Switching role
          </div>
          <div className="mt-1 text-[20px] text-foreground">
            {role} workspace
          </div>
        </div>

        {/* Loading bar */}
        <div className="h-[3px] w-44 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 rounded-full bg-primary role-bar" />
        </div>
      </div>

      <style>{`
        @keyframes roleBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        .role-bar { animation: roleBar 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
}
