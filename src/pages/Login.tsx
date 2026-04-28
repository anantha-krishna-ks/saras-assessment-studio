import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole, Role } from "@/context/RoleContext";
import {
  GraduationCap,
  ShieldCheck,
  UserCog,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import loginIllustration from "@/assets/login-illustration.png";

const roleOptions: {
  id: Role;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "HOD",
    label: "HOD / Sub-Coordinator",
    description: "Review & oversee assessments",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  {
    id: "Teacher",
    label: "Teacher",
    description: "Create & manage assessments",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "Admin",
    label: "Admin",
    description: "Full system access",
    icon: <UserCog className="h-4 w-4" />,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const [email, setEmail] = useState("anita.sharma@school.edu");
  const [password, setPassword] = useState("supersecret");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const activeRole = roleOptions.find((r) => r.id === role) ?? roleOptions[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* Left brand / animation panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-primary-soft border-r border-border overflow-hidden">
        {/* ambient blurred shapes */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-soft-sm">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="text-[15px] text-foreground">Lumen LMS</div>
        </div>

        {/* Premium education animation */}
        <div className="relative flex items-center justify-center">
          <EducationAnimation />
        </div>

        <div className="relative text-xs text-muted-foreground">
          © 2026 Lumen Education
        </div>
      </div>

      {/* Right login form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-card">
        <div className="w-full max-w-md animate-[fadeInUp_0.6s_ease-out]">
          {/* Logo (mobile) */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-[15px] text-foreground">Lumen LMS</div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs mb-4">
              <Sparkles className="h-3 w-3" />
              Welcome to Lumen LMS
            </div>
            <h2 className="text-[30px] text-foreground leading-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Select */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Select Your Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="h-[68px] rounded-xl border-border bg-secondary/40 hover:bg-secondary/60 transition-colors px-3">
                  <SelectValue>
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        {activeRole.icon}
                      </div>
                      <div>
                        <div className="text-sm text-foreground">
                          {activeRole.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activeRole.description}
                        </div>
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {roleOptions.map((r) => (
                    <SelectItem
                      key={r.id}
                      value={r.id}
                      className="rounded-lg py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-soft text-primary">
                          {r.icon}
                        </div>
                        <div>
                          <div className="text-sm text-foreground">
                            {r.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {r.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  className="h-12 pl-10 rounded-xl bg-secondary/40 border-border focus-visible:bg-card transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm text-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 pl-10 pr-10 rounded-xl bg-secondary/40 border-border focus-visible:bg-card transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(!!v)}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="group w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-[14px] shadow-soft-sm transition-all hover:shadow-md"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Need access?{" "}
              <a className="text-primary hover:underline" href="#">
                Contact your administrator
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[22px] text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
