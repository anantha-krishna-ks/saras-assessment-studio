import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { useRole, Role } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "./RoleSwitcher";

const roles: Role[] = ["HOD", "Teacher", "HM", "Admin"];

export function Header() {
  const { role, setRole, user } = useRole();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/80 backdrop-blur-md">
      <div className="relative mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-3 justify-self-start">
          <img src={logo} alt="Saras Class Sphere" className="h-9 w-auto" />
          <div className="leading-tight hidden sm:block">
            <div className="text-[15px] font-medium text-foreground">Class Sphere</div>
            <div className="text-xs text-muted-foreground">Assessment Studio</div>
          </div>
        </NavLink>

        <div aria-hidden="true" />


        <div className="flex items-center gap-3 justify-self-end">
          {/* Pill-shaped role switcher with dropdown */}
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-secondary transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-left leading-tight">
                  <div className="text-sm text-foreground">{user.name}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="text-sm">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 sm:hidden">
                <div className="text-sm text-muted-foreground mb-1.5">Switch role</div>
                <div className="flex gap-1">
                  {roles.map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={role === r ? "default" : "outline"}
                      className="h-7 text-sm flex-1"
                      onClick={() => setRole(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>
              <DropdownMenuSeparator className="sm:hidden" />
              <DropdownMenuItem onClick={() => navigate("/")}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
