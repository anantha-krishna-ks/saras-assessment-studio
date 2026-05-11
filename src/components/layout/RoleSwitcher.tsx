import { useState } from "react";
import { Check, ChevronDown, ShieldCheck, Users, UserCog, Printer, LucideIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRole, Role } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

interface RoleOption {
  id: Role;
  label: string;
  description: string;
  icon: LucideIcon;
}

const roleOptions: RoleOption[] = [
  { id: "HOD", label: "HOD", description: "Review papers & oversee assessments", icon: ShieldCheck },
  { id: "Teacher", label: "Teacher", description: "Create and manage assessments", icon: Users },
  { id: "HM", label: "HM", description: "Head Master oversight", icon: UserCog },
  { id: "Admin", label: "Admin", description: "Print question papers from HM", icon: Printer },
];

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);

  const handleSelect = (r: Role) => {
    setOpen(false);
    setRole(r);
  };

  const current = roleOptions.find((o) => o.id === role) ?? roleOptions[0];
  const CurrentIcon = current.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Switch role"
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "group inline-flex items-center gap-2.5 h-10 pl-1 pr-1 rounded-full transition-all duration-200",
            "bg-primary-soft hover:bg-primary-soft/80",
            "ring-1 ring-primary/15 hover:ring-primary/30",
            open && "ring-primary/50 shadow-soft-sm"
          )}
        >
          {/* Solid primary icon chip */}
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground shadow-soft-xs"
            )}
          >
            <CurrentIcon className="h-4 w-4" />
          </span>

          {/* Stacked label */}
          <span className="flex flex-col items-start leading-none gap-0.5 pr-0.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-primary/70">
              Role
            </span>
            <span className="text-[13px] font-medium text-primary">
              {role}
            </span>
          </span>

          {/* Chevron capsule — high contrast against pill */}
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              "bg-card text-primary ring-1 ring-primary/20",
              "group-hover:ring-primary/40",
              open && "bg-primary text-primary-foreground ring-primary"
            )}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[300px] p-2 rounded-2xl border border-border shadow-soft-md"
      >
        <div className="px-2.5 py-2">
          <div className="text-sm uppercase tracking-wide text-muted-foreground">
            Switch role
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {roleOptions.map((opt) => {
            const active = opt.id === role;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors",
                  active
                    ? "bg-primary-soft"
                    : "hover:bg-secondary/70"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm leading-tight",
                      active ? "text-primary" : "text-foreground"
                    )}
                  >
                    {opt.label}
                  </div>
                  <div className="text-sm text-muted-foreground leading-tight mt-0.5 truncate">
                    {opt.description}
                  </div>
                </div>
                {active && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
