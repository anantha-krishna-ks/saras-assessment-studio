import { useState } from "react";
import { Check, ChevronDown, ShieldCheck, Users, UserCog, LucideIcon } from "lucide-react";
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
  { id: "Admin", label: "Admin", description: "Full system access", icon: UserCog },
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
            "group inline-flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-full transition-all duration-200",
            "bg-card hover:-translate-y-px",
            "ring-1",
            open
              ? "ring-primary/40 shadow-soft-sm"
              : "ring-border/70 shadow-soft-xs hover:ring-primary/30"
          )}
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              "bg-primary-soft text-primary"
            )}
          >
            <CurrentIcon className="h-3.5 w-3.5" />
          </span>
          <span className="flex flex-col items-start leading-none -space-y-0.5">
            <span className="text-[10.5px] uppercase tracking-wide text-muted-foreground">
              Role
            </span>
            <span className="text-sm font-medium text-foreground">{role}</span>
          </span>
          <span
            className={cn(
              "ml-0.5 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-all",
              "group-hover:bg-secondary/70",
              open && "bg-primary-soft text-primary"
            )}
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
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
