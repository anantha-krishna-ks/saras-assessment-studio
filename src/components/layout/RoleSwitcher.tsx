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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Switch role"
          className={cn(
            "group flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-full border transition-all",
            "bg-card hover:bg-secondary/60",
            open ? "border-primary/30 shadow-soft-sm" : "border-border shadow-soft-xs"
          )}
        >
          <span className="flex h-8 items-center gap-1.5 px-2.5 rounded-full bg-primary-soft text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-sm leading-none">Role</span>
          </span>
          <span className="text-sm text-foreground leading-none">{role}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
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
