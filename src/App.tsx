import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { ChefDashboard } from "./components/chef/ChefDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SubscriptionPage from "./components/student/SubscriptionPage";
import AIMealBuilder from "./components/student/AIMealBuilder";
import AdminSubscriptions from "./components/admin/AdminSubscriptions";

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'STUDENT' | 'CHEF' | 'ADMIN' }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (user.role !== allowedRole) {
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/dashboard/student" 
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/chef" 
        element={
          <ProtectedRoute allowedRole="CHEF">
            <ChefDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/subscription" 
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <SubscriptionPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/ai-meal-builder" 
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <AIMealBuilder />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/subscriptions" 
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminSubscriptions />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  console.log('App rendering...');
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
