
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import CashierHome from "./pages/CashierHome";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ProfilePage from "./pages/ProfilePage";
import { UserCredential } from "./utils/auth";
import DispatcherLayout from "./components/layouts/DispatcherLayout";
import DispatcherScheduleList from "./pages/DispatcherScheduleList";
import DispatcherProfilePage from "./pages/DispatcherProfilePage";
import ReportComplaintPage from "./pages/ReportComplaintPage";
import AssistantPortal from "./pages/AssistantPortal";
import StallsManagement from "./pages/StallsManagement";
import StallDetails from "./pages/StallDetails";
import MonitoringReports from "./pages/MonitoringReports";
import ApplicantsPage from "./pages/ApplicantsPage";
import ApplicantDetails from "./pages/ApplicantDetails";
import RenewalContracts from "./pages/RenewalContracts";
import TenantProfilesPage from "./pages/TenantProfilesPage";
import TenantDetailPage from "./pages/TenantDetailPage";
import StatementOfTheAccount from "./pages/StatementOfTheAccount";
import AssistantProfilePage from "./pages/AssistantProfilePage";
import AssistantReportsPage from "./pages/AssistantReportsPage";
import BusOperatorsManagement from "./pages/BusOperatorsManagement";
import BusFareMatrix from "./pages/BusFareMatrix";
import ContractDetails from "./pages/ContractDetails";
import ContractLeasePage from "./pages/ContractLeasePage";
import RouteMapManagement from "./pages/RouteMapManagement";
import TenantList from "./pages/TenantList";
import TranscriptHistory from "./pages/TranscriptHistory";
import AddNewBusPage from "./pages/AddNewBusPage";
import AdminApplicantsPage from "./pages/AdminApplicantsPage";
import AdminApplicantDetails from "./pages/AdminApplicantDetails";
import NewApplicantsPage from "./pages/NewApplicantsPage";
import NewApplicantDetails from "./pages/NewApplicantDetails";
import NewOperatorsPage from "./pages/NewOperatorsPage";
import DispatcherInventory from "./pages/DispatcherInventory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [user, setUser] = useState<UserCredential | null>(null);
  
  // Set document title with auto-updating feature enabled info
  useEffect(() => {
    document.title = "BCS Terminal - Auto-Updating Fees";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index onLogin={setUser} />} />
            <Route 
              path="/dashboard" 
              element={<Dashboard user={user} />} 
            />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard user={user} />} />
            <Route path="/admin/users" element={<AdminDashboard user={user} />} />
            <Route path="/admin/applicants" element={<AdminApplicantsPage user={user} />} />
            <Route path="/admin/applicants/:id" element={<AdminApplicantDetails user={user} />} />
            <Route path="/admin/terminal" element={<AdminDashboard user={user} />} />
            <Route path="/admin/settings" element={<AdminDashboard user={user} />} />
            <Route path="/admin/reports" element={<MonitoringReports />} />
            <Route path="/admin/bus-operators" element={<BusOperatorsManagement />} />
            <Route path="/admin/fare-matrix" element={<BusFareMatrix />} />
            <Route path="/admin/route-map" element={<RouteMapManagement />} />
            
            {/* Cashier Routes */}
            <Route path="/cashier" element={<CashierHome user={user} />} />
            <Route path="/cashier/buses" element={<CashierDashboard user={user} />} />
            <Route path="/cashier/analytics" element={<AnalyticsDashboard user={user} />} />
            <Route path="/cashier/profile" element={<ProfilePage user={user} />} />
            
            {/* Assistant Routes */}
            <Route path="/assistant-admin" element={<AssistantPortal />} />
            <Route path="/assistant-admin/overview" element={<AssistantPortal />} />
            <Route path="/assistant-admin/stalls" element={<StallsManagement />} />
            <Route path="/assistant-admin/stalls/:id" element={<StallDetails />} />
            <Route path="/assistant-admin/accounts" element={<ApplicantsPage />} />
            <Route path="/assistant-admin/accounts/:id" element={<ApplicantDetails />} />
            <Route path="/assistant-admin/new-applicants" element={<NewApplicantsPage />} />
            <Route path="/assistant-admin/new-applicants/:id" element={<NewApplicantDetails />} />
            <Route path="/assistant-admin/new-operators" element={<NewOperatorsPage />} />
            <Route path="/assistant-admin/contracts" element={<RenewalContracts />} />
            <Route path="/assistant-admin/contracts/:id" element={<ContractDetails />} />
            <Route path="/assistant-admin/contracts/lease/:id" element={<ContractLeasePage />} />
            <Route path="/assistant-admin/profile" element={<TenantProfilesPage />} />
            <Route path="/assistant-admin/profile/:id" element={<TenantDetailPage />} />
            <Route path="/assistant-admin/profile/edit" element={<AssistantProfilePage />} />
            <Route path="/assistant-admin/records" element={<StatementOfTheAccount />} />
            <Route path="/assistant-admin/reports" element={<AssistantReportsPage />} />
            
            {/* Terminal Operator Routes */}
            <Route path="/dispatcher" element={<DispatcherLayout user={user} />}>
              <Route index element={<DispatcherScheduleList />} />
              <Route path="profile" element={<DispatcherProfilePage user={user} />} />
              <Route path="complaints" element={<ReportComplaintPage />} />
              <Route path="add-new-bus" element={<AddNewBusPage />} />
              <Route path="inventory" element={<DispatcherInventory />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
