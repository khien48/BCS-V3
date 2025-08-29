import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "../components/layouts/AdminLayout";
import { Filter, X, Calendar, User, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { UserCredential } from '../utils/auth';

interface AdminApplicantsPageProps {
  user: UserCredential | null;
}

type AdminApplicant = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  gender: "Male" | "Female" | "Prefer not to specify";
  birthdate: string;
  street_address: string;
  barangay: string;
  city: string;
  province: string;
  postal_code: string;
  phone_number: string;
  email_address: string;
  business_name: string;
  business_registration_number: string;
  business_type: string;
  application_date: string;
  status: string;
  bcs_clearance: boolean;
  mayors_permit: boolean;
  dti_registration: boolean;
  drug_test: boolean;
  board_resolution: boolean;
  stall_photo: boolean;
  digital_contract_status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

const AdminApplicantsPage: React.FC<AdminApplicantsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [applicants, setApplicants] = useState<AdminApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  // Fetch applicants from Supabase admin_applicants table
  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        // Count total
        const { count: totalCount, error: countError } = await supabase
          .from('admin_applicants')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
          
        // Count approved
        const { count: approvedCount, error: approvedError } = await supabase
          .from('admin_applicants')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Approved');
        
        if (approvedError) throw approvedError;
        
        // Get applicants with pagination
        const { data, error } = await supabase
          .from('admin_applicants')
          .select('*')
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
          .order('application_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setApplicants(data as AdminApplicant[] || []);
        setTotalApplicants(totalCount || 0);
        setTotalApproved(approvedCount || 0);
        setTotalPages(Math.ceil((totalCount || 0) / itemsPerPage));
      } catch (error) {
        console.error('Error fetching applicants:', error);
        toast({
          title: "Error",
          description: "Failed to load applicants data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicants();
  }, [currentPage, toast]);

  const filteredApplicants = applicants.filter(applicant => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      applicant.last_name.toLowerCase().includes(searchTermLower) ||
      applicant.first_name.toLowerCase().includes(searchTermLower) ||
      applicant.business_name.toLowerCase().includes(searchTermLower) ||
      applicant.business_type.toLowerCase().includes(searchTermLower) ||
      `${applicant.city}, ${applicant.province}`.toLowerCase().includes(searchTermLower)
    );
  });

  const handleViewDetails = (id: string) => {
    navigate(`/admin/applicants/${id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format the applicant name
  const formatName = (applicant: AdminApplicant) => {
    return `${applicant.last_name}, ${applicant.first_name}${applicant.middle_name ? ` ${applicant.middle_name.charAt(0)}.` : ''}`;
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{totalApplicants}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Applicant</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{totalApproved}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Approve</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 max-w-full">
          <div className="flex-1 relative">
            <Input 
              type="text" 
              placeholder="Search" 
              className="pl-10 py-2 w-full border rounded-lg" 
              value={searchTerm}
              onChange={handleSearch}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={handleClearSearch}
              >
                <X size={16} className="text-green-600" />
              </Button>
            )}
          </div>
          <Button 
            variant="default" 
            className="bg-bcs-green hover:bg-bcs-green/90"
            onClick={toggleFilter}
          >
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
        </div>

        {/* Applicants List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Applicant List</h2>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">Loading applicants...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        <User size={16} className="mr-2" /> 
                        Applicant Name
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        Date of Applying
                      </div>
                    </TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Briefcase size={16} className="mr-2" />
                        Business Name
                      </div>
                    </TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm ? "No applicants found matching your search." : "No applicants available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>{formatName(applicant)}</TableCell>
                        <TableCell>{formatDate(applicant.application_date)}</TableCell>
                        <TableCell>{`${applicant.city}, ${applicant.province}`}</TableCell>
                        <TableCell>{applicant.business_name}</TableCell>
                        <TableCell>{applicant.business_type}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            applicant.status === 'Approved' 
                              ? 'text-green-700' 
                              : applicant.status === 'Rejected'
                                ? 'text-red-500'
                                : applicant.status === 'Under Review'
                                  ? 'text-blue-500'
                                  : 'text-amber-500'
                          }`}>
                            {applicant.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="default" 
                            className="bg-bcs-green hover:bg-bcs-green/90 text-xs h-8"
                            onClick={() => handleViewDetails(applicant.id)}
                          >
                            VIEW DETAILS
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          isActive={currentPage === page} 
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicantsPage;
