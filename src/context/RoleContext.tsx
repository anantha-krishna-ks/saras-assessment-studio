import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Role = "HOD" | "Teacher" | "HM" | "Admin";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  switching: boolean;
  user: { name: string; email: string; initials: string };
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("HOD");
  const [switching, setSwitching] = useState(false);

  const setRole = useCallback(
    (next: Role) => {
      if (next === role) return;
      setSwitching(true);
      // Mid-transition role swap so the new UI appears under the overlay
      window.setTimeout(() => setRoleState(next), 280);
      window.setTimeout(() => setSwitching(false), 720);
    },
    [role]
  );

  const user = {
    name: "Anita Sharma",
    email: "anita.sharma@school.edu",
    initials: "AS",
  };

  return (
    <RoleContext.Provider value={{ role, setRole, switching, user }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
