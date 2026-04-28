import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRole, Role } from "@/context/RoleContext";
import { GraduationCap, ShieldCheck, UserCog, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const roleOptions: { id: Role; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "HOD", label: "HOD / Sub-Coordinator", description: "Review papers & oversee assessments", icon: <ShieldCheck className="h-4 w-4" /> },
  { id: "Teacher", label: "Teacher", description: "Create and manage assessments", icon: <Users className="h-4 w-4" /> },
  { id: "Admin", label: "Admin", description: "Full system access", icon: <UserCog className="h-4 w-4" /> },
];

export default function Login() {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const [email, setEmail] = useState("anita.sharma@school.edu");
  const [password, setPassword] = useState("••••••••");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-card border-r border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-[15px] text-foreground">Lumen LMS</div>
            <div className="text-sm text-muted-foreground">Assessment Studio</div>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-[36px] leading-tight text-foreground">
            A calmer way to manage assessments.
          </h1>
          <p className="mt-4 text-[14px] text-muted-foreground leading-relaxed">
            Create, review and schedule question papers across grades and subjects — all in one elegant workspace built for educators.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <Stat value="120+" label="Assessments" />
            <Stat value="24" label="Reviewers" />
            <Stat value="98%" label="On-time" />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">© 2026 Lumen Education</div>
      </div>

      {/* Right login form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 rounded-2xl border border-border shadow-soft-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-[15px] text-foreground">Lumen LMS</div>
          </div>

          <h2 className="text-[22px] text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue to your workspace.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-sm">Sign in as</Label>
              <div className="grid grid-cols-1 gap-2">
                {roleOptions.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all",
                      role === r.id
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-card hover:bg-secondary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        role === r.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{r.label}</div>
                      <div className="text-sm text-muted-foreground">{r.description}</div>
                    </div>
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border-2 transition-colors",
                        role === r.id ? "border-primary bg-primary" : "border-border"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-[14px]">
              Sign in as {role}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Need access? <a className="text-primary hover:underline" href="#">Contact your administrator</a>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[22px] text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
