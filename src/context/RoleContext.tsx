import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "HOD" | "Teacher" | "Admin";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  user: { name: string; email: string; initials: string };
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("HOD");
  const user = {
    name: "Anita Sharma",
    email: "anita.sharma@school.edu",
    initials: "AS",
  };
  return (
    <RoleContext.Provider value={{ role, setRole, user }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
