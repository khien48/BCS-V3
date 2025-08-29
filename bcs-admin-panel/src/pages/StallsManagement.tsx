
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Check, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Stall {
  id: number;
  status: string;
}

interface Applicant {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  business_name: string;
  phone_number: string;
  email_address: string;
  gender?: string;
}

interface TenantFormData {
  applicant_id: string;
}

const StallsManagement = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStall, setCurrentStall] = useState<Stall | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableApplicants, setAvailableApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [applicantSearchTerm, setApplicantSearchTerm] = useState("");
  const [stalls, setStalls] = useState<Stall[]>([]);

  const { register, handleSubmit, reset, setValue, watch } = useForm<TenantFormData>();
  const selectedApplicantId = watch("applicant_id");
  
  // Load stalls from database or use dummy data if not available yet
  useEffect(() => {
    const fetchStalls = async () => {
      try {
        // In a real implementation, we would fetch stalls from Supabase
        // For now, using static data
        setStalls(stallData);
      } catch (error) {
        console.error("Error fetching stalls:", error);
      }
    };
    
    fetchStalls();
  }, []);

  // Dummy stall data - would be replaced by actual database data in production
  const stallData = [{
    id: 101,
    status: 'Occupied'
  }, {
    id: 102,
    status: 'Available'
  }, {
    id: 103,
    status: 'Occupied'
  }, {
    id: 104,
    status: 'Available'
  }, {
    id: 105,
    status: 'Occupied'
  }, {
    id: 106,
    status: 'Available'
  }, {
    id: 107,
    status: 'Occupied'
  }, {
    id: 108,
    status: 'Available'
  }];

  // Fetch available applicants from database
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data, error } = await supabase
          .from("applicants")
          .select("id, first_name, middle_name, last_name, business_name, phone_number, email_address, gender")
          .eq("status", "Approved");
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setAvailableApplicants(data);
          setFilteredApplicants(data);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);
  
  // Filter applicants when search term changes
  useEffect(() => {
    if (applicantSearchTerm.trim() === "") {
      setFilteredApplicants(availableApplicants);
      return;
    }

    const filtered = availableApplicants.filter(
      (applicant) => 
        applicant.first_name.toLowerCase().includes(applicantSearchTerm.toLowerCase()) ||
        applicant.last_name.toLowerCase().includes(applicantSearchTerm.toLowerCase()) ||
        applicant.business_name.toLowerCase().includes(applicantSearchTerm.toLowerCase())
    );
    
    setFilteredApplicants(filtered);
  }, [applicantSearchTerm, availableApplicants]);
  
  const handleStallClick = (stall: Stall) => {
    if (stall.status === 'Occupied') {
      navigate(`/assistant-admin/stalls/${stall.id}`);
    } else if (stall.status === 'Available') {
      setCurrentStall(stall);
      setIsDialogOpen(true);
      reset();
      setApplicantSearchTerm("");
      setFilteredApplicants(availableApplicants);
    }
  };

  const getSelectedApplicant = () => {
    return availableApplicants.find(app => app.id === selectedApplicantId);
  };

  const onSubmit = async (data: TenantFormData) => {
    if (!currentStall || !data.applicant_id) return;
    
    setIsLoading(true);
    
    try {
      const selectedApplicant = getSelectedApplicant();
      
      if (!selectedApplicant) {
        throw new Error("Selected applicant not found");
      }

      // In a real implementation, here we would:
      // 1. Update the stall status to "Occupied" in the database
      // 2. Create a relationship between the stall and tenant in database
      
      // For now, we'll just update our local state
      setStalls(prevStalls => 
        prevStalls.map(stall => 
          stall.id === currentStall.id ? { ...stall, status: 'Occupied' } : stall
        )
      );

      toast({
        title: "Tenant assigned successfully",
        description: `${selectedApplicant.first_name} ${selectedApplicant.last_name} has been assigned to Stall #${currentStall.id}`,
      });
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      setCurrentStall(null);
      reset();
    } catch (error) {
      console.error("Error assigning tenant:", error);
      toast({
        title: "Error",
        description: "There was a problem assigning the tenant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setCurrentStall(null);
    reset();
  };
  
  return <AssistantLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">300</h3>
            <p className="mt-2 text-sm text-gray-600">Total Stall's</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-red-500">20</h3>
            <p className="mt-2 text-sm text-gray-600">Total non-occupied</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 w-full border rounded-lg" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <Button variant="default" className="bg-bcs-green hover:bg-bcs-green/90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M3 6h18" />
              <path d="M7 12h10" />
              <path d="M11 18h2" />
            </svg>
            Filter
          </Button>
        </div>

        {/* Stalls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stalls
            .filter(stall => stall.id.toString().includes(searchTerm))
            .map(stall => (
              <Card 
                key={stall.id} 
                className={`p-6 border px-[24px] py-[24px] rounded-3xl mx-0 transition-all duration-200 cursor-pointer hover:shadow-md`}
                onClick={() => handleStallClick(stall)}
              >
                <div className="flex flex-col items-center space-y-4">
                  <img alt={`Stall ${stall.id}`} className="w-32 h-32 object-contain" src="/lovable-uploads/a69894e1-1653-4cfe-9e29-ebb7c05d20be.png" />
                  <h3 className="text-lg font-medium">Stall No: {stall.id}</h3>
                  <span className={`px-4 py-1 rounded-full text-sm ${stall.status === 'Occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {stall.status}
                  </span>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Assign Tenant Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              Assign Tenant to Stall #{currentStall?.id}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="applicant_search">Search Applicants</Label>
              <div className="relative">
                <Input
                  id="applicant_search"
                  placeholder="Search by name or business name"
                  value={applicantSearchTerm}
                  onChange={(e) => setApplicantSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2 overflow-auto max-h-[300px] border rounded-md p-2">
              <Label className="mb-2 block">Select an Applicant</Label>
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant) => (
                  <div 
                    key={applicant.id}
                    className={`p-3 rounded-md mb-2 cursor-pointer flex justify-between items-center ${
                      selectedApplicantId === applicant.id 
                        ? 'bg-green-50 border-green-500 border' 
                        : 'bg-white border hover:bg-gray-50'
                    }`}
                    onClick={() => setValue("applicant_id", applicant.id)}
                  >
                    <div>
                      <p className="font-medium">
                        {applicant.first_name} {applicant.middle_name ? `${applicant.middle_name} ` : ''}{applicant.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{applicant.business_name}</p>
                      <p className="text-xs text-gray-400">{applicant.phone_number}</p>
                    </div>
                    {selectedApplicantId === applicant.id && (
                      <Check className="text-green-500 h-5 w-5" />
                    )}
                    <input 
                      type="radio" 
                      value={applicant.id} 
                      checked={selectedApplicantId === applicant.id}
                      {...register("applicant_id", { required: true })} 
                      onChange={() => {}} // React wants an onChange handler but we're handling it with the div onClick
                      className="sr-only" // Hide the actual radio button as we're styling the whole div
                    />
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No matching applicants found</p>
              )}
            </div>

            {selectedApplicantId && (
              <div className="p-4 bg-gray-50 rounded-md border">
                <h4 className="font-medium text-lg mb-2">Selected Applicant Details</h4>
                {getSelectedApplicant() && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p>{getSelectedApplicant()?.first_name} {getSelectedApplicant()?.middle_name} {getSelectedApplicant()?.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p>{getSelectedApplicant()?.gender || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Name</p>
                        <p>{getSelectedApplicant()?.business_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Number</p>
                        <p>{getSelectedApplicant()?.phone_number}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                        <p className="truncate">{getSelectedApplicant()?.email_address}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-bcs-green hover:bg-bcs-green/90"
                disabled={isLoading || !selectedApplicantId}
              >
                Assign Tenant
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AssistantLayout>;
};

export default StallsManagement;
