import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrackBus from "./pages/TrackBus";
import About from "./pages/About";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";
import Schedule from "./pages/Schedule";
import RenewalOfLeaseContract from "./pages/RenewalOfLeaseContract";
import RenewalForm from "./pages/RenewalForm";
import ApplicationForLeaseholdTenancy from "./pages/ApplicationForLeaseholdTenancy";
import ApplicationForLeaseholdTenancyApply from "./pages/ApplicationForLeaseholdTenancyApply";
import StallSelection from "./pages/StallSelection";
import BusRoute from "./pages/BusRoute";
import BusOperatorRegistration from "./pages/BusOperatorRegistration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/bus-route" element={<BusRoute />} />
          <Route path="/track" element={<TrackBus />} />
          <Route path="/about" element={<About />} />
          <Route path="/report" element={<Report />} />
          <Route path="/renewal-of-lease-contract" element={<RenewalOfLeaseContract />} />
          <Route path="/renewal-of-lease-contract/apply" element={<RenewalForm />} />
          <Route path="/application-for-leasehold-tenancy" element={<ApplicationForLeaseholdTenancy />} />
          <Route path="/application-for-leasehold-tenancy/select-stall" element={<StallSelection />} />
          <Route path="/application-for-leasehold-tenancy/apply" element={<ApplicationForLeaseholdTenancyApply />} />
          <Route path="/bus-operator-registration" element={<BusOperatorRegistration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
