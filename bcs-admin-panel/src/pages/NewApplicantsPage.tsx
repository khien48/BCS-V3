
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Check, X } from "lucide-react";
import NewApplicantRejectDialog from '../components/new-applicant/NewApplicantRejectDialog';
import NewApplicantApproveDialog from '../components/new-applicant/NewApplicantApproveDialog';

interface NewApplicant {
  id: string;
  applicant_id: string | null;
  stall_number: string | null;
  first_name: string;
  last_name: string;
  business_name: string;
  status: string;
  application_date: string;
}

const NewApplicantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applicants, setApplicants] = useState<NewApplicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<NewApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStall, setSelectedStall] = useState<string>('all');
  const [stallOptions, setStallOptions] = useState<string[]>([]);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<NewApplicant | null>(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchQuery, selectedStall]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('new_applicants')
        .select('id, applicant_id, stall_number, first_name, last_name, business_name, status, application_date')
        .in('status', ['Pending', 'Under Review', 'Rejected'])
        .order('application_date', { ascending: false });

      if (error) throw error;

      if (data) {
        setApplicants(data);
        // Extract unique stall numbers for filter dropdown
        const uniqueStalls = [...new Set(data.map(app => app.stall_number).filter(Boolean))];
        setStallOptions(uniqueStalls);
      }
    } catch (error) {
      console.error('Error fetching new applicants:', error);
      toast({
        title: "Error",
        description: "Failed to load new applicants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = applicants;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicant_id?.toLowerCase().includes(query) ||
        `${app.first_name} ${app.last_name}`.toLowerCase().includes(query) ||
        app.business_name.toLowerCase().includes(query)
      );
    }

    // Stall filter
    if (selectedStall !== 'all') {
      filtered = filtered.filter(app => app.stall_number === selectedStall);
    }

    setFilteredApplicants(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'bg-amber-100 text-amber-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Rejected': 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const handleViewDetails = (applicant: NewApplicant) => {
    navigate(`/assistant-admin/new-applicants/${applicant.id}`);
  };

  const handleApprove = (applicant: NewApplicant) => {
    setSelectedApplicant(applicant);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (applicant: NewApplicant) => {
    setSelectedApplicant(applicant);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedApplicant) return;

    try {
      const { error } = await supabase
        .from('new_applicants')
        .update({ status: 'Approved' })
        .eq('id', selectedApplicant.id);

      if (error) throw error;

      toast({
        title: "Application Approved",
        description: `${selectedApplicant.first_name} ${selectedApplicant.last_name}'s application has been approved.`
      });

      setIsApproveDialogOpen(false);
      setSelectedApplicant(null);
      fetchApplicants();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve the application",
        variant: "destructive"
      });
    }
  };

  const handleConfirmReject = async (rejectionReason: string) => {
    if (!selectedApplicant) return;

    try {
      const { error } = await supabase
        .from('new_applicants')
        .update({ 
          status: 'Rejected',
          rejection_reason: rejectionReason
        })
        .eq('id', selectedApplicant.id);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: `${selectedApplicant.first_name} ${selectedApplicant.last_name}'s application has been rejected.`
      });

      setIsRejectDialogOpen(false);
      setSelectedApplicant(null);
      fetchApplicants();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject the application",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading new applicants...</p>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">New Applicants</h1>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by Applicant ID, Name, or Business Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Select value={selectedStall} onValueChange={setSelectedStall}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Stall" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stalls</SelectItem>
              {stallOptions.map((stall) => (
                <SelectItem key={stall} value={stall}>
                  Stall {stall}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Applicants Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Stall Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No applicants found
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="font-medium">
                      {applicant.applicant_id || 'N/A'}
                    </TableCell>
                    <TableCell>{applicant.stall_number || 'N/A'}</TableCell>
                    <TableCell>{`${applicant.first_name} ${applicant.last_name}`}</TableCell>
                    <TableCell>{applicant.business_name}</TableCell>
                    <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                    <TableCell>{formatDate(applicant.application_date)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(applicant)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {applicant.status !== 'Rejected' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(applicant)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(applicant)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      <NewApplicantRejectDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        onConfirm={handleConfirmReject}
        applicantName={selectedApplicant ? `${selectedApplicant.first_name} ${selectedApplicant.last_name}` : ''}
      />

      <NewApplicantApproveDialog
        isOpen={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        onConfirm={handleConfirmApprove}
        applicantName={selectedApplicant ? `${selectedApplicant.first_name} ${selectedApplicant.last_name}` : ''}
      />
    </AssistantLayout>
  );
};

export default NewApplicantsPage;
