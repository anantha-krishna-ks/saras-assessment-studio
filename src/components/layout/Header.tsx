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

        {/* Centered pill nav */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 justify-self-center rounded-full border border-border/70 bg-secondary/50 backdrop-blur p-1 shadow-soft-xs"
        >
          <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </NavItem>
          <NavItem to="/create" icon={<FilePlus2 className="h-4 w-4" />}>
            Create Assessment
          </NavItem>
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          {/* Pill-shaped role switcher with dropdown */}
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-secondary transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-soft text-primary text-sm">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left leading-tight">
                  <div className="text-sm text-foreground">{user.name}</div>
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

        {/* Mobile nav (below md) — also pill-style */}
        <nav
          aria-label="Primary mobile"
          className="md:hidden col-span-3 flex items-center justify-center gap-1 -mt-1 pb-2"
        >
          <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </NavItem>
          <NavItem to="/create" icon={<FilePlus2 className="h-4 w-4" />}>
            Create
          </NavItem>
        </nav>
      </div>
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
          "flex items-center gap-2 px-4 h-9 rounded-full text-sm transition-all",
          isActive
            ? "bg-card text-primary shadow-soft-sm ring-1 ring-border/70"
            : "text-muted-foreground hover:text-foreground hover:bg-card/60"
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
