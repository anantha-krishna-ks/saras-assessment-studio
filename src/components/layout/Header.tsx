import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FilePlus2, LogOut } from "lucide-react";
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

const roles: Role[] = ["HOD", "Teacher", "Admin"];

export function Header() {
  const { role, setRole, user } = useRole();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-4 px-6">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Saras Class Sphere" className="h-9 w-auto" />
        </NavLink>

        {/* Centered pill nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-card border border-border shadow-soft-sm px-2 py-1.5">
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/create">Create Assessment</NavItem>
          <NavItem to="/review-qp">Review QP</NavItem>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {/* Pill-shaped role switcher with dropdown */}
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full bg-card border border-border p-1 pr-3 hover:bg-secondary transition-colors shadow-soft-xs">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-soft text-primary text-sm">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left leading-tight">
                  <div className="text-sm text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{role}</div>
                </div>
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

function NavItem({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 h-9 rounded-full text-sm transition-all",
          isActive
            ? "bg-primary text-primary-foreground shadow-soft-sm"
            : "text-muted-foreground hover:text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );
}
