import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { RoleTransition } from "./RoleTransition";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

export function AppShell() {
  const { switching, role } = useRole();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        key={role}
        className={cn(
          "mx-auto max-w-[1400px] px-6 py-8 transition-all duration-500",
          switching ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0 animate-in fade-in"
        )}
      >
        <Outlet />
      </main>
      <RoleTransition />
    </div>
  );
}
