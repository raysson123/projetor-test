
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboardPage from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import TestConnection from "./components/TestConnection";
import ResetPassword from "./pages/ResetPassword";
import Cancelado from "./pages/Cancelado";
import Sucesso from './pages/Sucesso';
import Pendente from './pages/Pendente';
import Falha from './pages/Falha';
import EditarSite from './pages/EditarSite';
import Curso from './pages/Curso';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/test" element={<TestConnection />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editar-site" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <EditarSite />
                </ProtectedRoute>
              } 
            />
            <Route path="/cursos/:id" element={<ProtectedRoute><Curso /></ProtectedRoute>} />
            <Route path="/cancelado" element={<Cancelado />} />
            <Route path="/sucesso" element={<Sucesso />} />
            <Route path="/pendente" element={<Pendente />} />
            <Route path="/falha" element={<Falha />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
