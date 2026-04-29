import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/context/RoleContext";
import { AppShell } from "@/components/layout/AppShell";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CreateAssessment from "./pages/CreateAssessment.tsx";
import CreateAssessmentV2 from "./pages/CreateAssessmentV2.tsx";
import ReviewQP from "./pages/ReviewQP.tsx";
import QuestionRepository from "./pages/QuestionRepository.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateAssessment />} />
              <Route path="/create-v2" element={<CreateAssessmentV2 />} />
              <Route path="/review-qp" element={<ReviewQP />} />
              <Route path="/review-qp/:id" element={<ReviewQP />} />
              <Route path="/question-repository" element={<QuestionRepository />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
