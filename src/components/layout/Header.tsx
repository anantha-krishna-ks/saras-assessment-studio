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
    <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto grid h-18 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3">
        {/* Left: Logo */}
        <div className="flex items-center">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="Saras Class Sphere"
              className="h-9 w-auto transition-transform group-hover:scale-[1.02]"
            />
          </NavLink>
        </div>

        {/* Center: Pill nav */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-card/80 p-1 shadow-soft-xs backdrop-blur">
          <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </NavItem>
          <NavItem to="/create" icon={<FilePlus2 className="h-4 w-4" />}>
            Create Assessment
          </NavItem>
        </nav>

        {/* Right: Role + Profile */}
        <div className="flex items-center justify-end gap-3">
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pr-3 hover:bg-secondary transition-colors shadow-soft-xs">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-soft text-primary text-sm">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left leading-tight">
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

        {/* Mobile pill nav */}
        <nav className="col-span-3 md:hidden flex items-center justify-center gap-1 rounded-full border border-border bg-card p-1">
          <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </NavItem>
          <NavItem to="/create" icon={<FilePlus2 className="h-4 w-4" />}>
            Create
          </NavItem>
        </nav>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-2 px-4 h-9 rounded-full text-sm transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-soft-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
