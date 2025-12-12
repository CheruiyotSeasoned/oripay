import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import AboutAdmin from "./pages/admin/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import KYC from "./pages/KYC";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/ProtectedRoutes";

import { AuthProvider } from "./context/AuthContext";
import FooterAdmin from "./pages/admin/FooterAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/kyc" element={<KYC />} />

              {/* User Dashboard (optional) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<Settings />} />
                <Route path="about" element={<AboutAdmin />} />
                <Route path="footer" element={<FooterAdmin />} />
              </Route>


              {/* Catch-All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
