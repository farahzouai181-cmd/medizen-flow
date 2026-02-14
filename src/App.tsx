import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import UrgentisteDashboard from "./pages/urgentiste/UrgentisteDashboard";
import ReceptionnisteDashboard from "./pages/receptionniste/ReceptionnisteDashboard";
import MedecinDashboard from "./pages/medecin/MedecinDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to={`/dashboard/${user.role}`} replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard/urgentiste" element={<ProtectedRoute allowedRoles={['urgentiste', 'admin']}><UrgentisteDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/urgentiste/*" element={<ProtectedRoute allowedRoles={['urgentiste', 'admin']}><UrgentisteDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/receptionniste" element={<ProtectedRoute allowedRoles={['receptionniste', 'admin']}><ReceptionnisteDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/receptionniste/*" element={<ProtectedRoute allowedRoles={['receptionniste', 'admin']}><ReceptionnisteDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/medecin" element={<ProtectedRoute allowedRoles={['medecin', 'admin']}><MedecinDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/medecin/*" element={<ProtectedRoute allowedRoles={['medecin', 'admin']}><MedecinDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
