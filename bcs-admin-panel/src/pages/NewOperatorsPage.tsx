import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Car
} from 'lucide-react';
import AssistantLayout from '@/components/layouts/AssistantLayout';

interface NewOperator {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  birthdate: string;
  contact_number: string;
  email_address: string;
  street_address: string;
  barangay: string;
  city: string;
  province: string;
  postal_code: string;
  plate_number: string;
  route: string;
  franchise_document_url: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

const NewOperatorsPage: React.FC = () => {
  const [operators, setOperators] = useState<NewOperator[]>([]);
  const [filteredOperators, setFilteredOperators] = useState<NewOperator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<NewOperator | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [franchiseDocumentOpen, setFranchiseDocumentOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOperators();
  }, []);

  useEffect(() => {
    const filtered = operators.filter(operator => 
      `${operator.first_name} ${operator.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operator.email_address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOperators(filtered);
  }, [searchTerm, operators]);

  const fetchOperators = async () => {
    try {
      const { data, error } = await supabase
        .from('registered_buses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperators(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch operators",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (operatorId: string) => {
    try {
      const { error } = await supabase
        .from('registered_buses')
        .update({ status: 'Approved', rejection_reason: null })
        .eq('id', operatorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Operator approved successfully"
      });
      
      fetchOperators();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve operator",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    if (!selectedOperator) return;

    try {
      const { error } = await supabase
        .from('registered_buses')
        .update({ 
          status: 'Rejected', 
          rejection_reason: rejectionReason || 'No reason provided' 
        })
        .eq('id', selectedOperator.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Operator rejected successfully"
      });
      
      setRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedOperator(null);
      fetchOperators();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject operator",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFullName = (operator: NewOperator) => {
    return `${operator.first_name} ${operator.middle_name ? operator.middle_name + ' ' : ''}${operator.last_name}${operator.suffix ? ' ' + operator.suffix : ''}`;
  };

  const getFullAddress = (operator: NewOperator) => {
    return `${operator.street_address}, ${operator.barangay}, ${operator.city}, ${operator.province} ${operator.postal_code}`;
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading operators...</div>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Operators</h1>
            <p className="text-muted-foreground">
              Review and manage bus operator registration applications
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{operators.length}</div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {operators.filter(op => op.status === 'Pending').length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {operators.filter(op => op.status === 'Approved').length}
              </div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {operators.filter(op => op.status === 'Rejected').length}
              </div>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Operators Table */}
        <Card>
          <CardHeader>
            <CardTitle>Operator Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operator Name</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOperators.map((operator) => (
                    <TableRow key={operator.id}>
                      <TableCell>
                        <div className="font-medium">{getFullName(operator)}</div>
                        <div className="text-sm text-muted-foreground">{operator.email_address}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-medium">{operator.plate_number}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{operator.route}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{operator.contact_number}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(operator.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(operator.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details Button */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Operator Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Name:</strong> {getFullName(operator)}</div>
                                      <div><strong>Birthdate:</strong> {operator.birthdate}</div>
                                      <div className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        {operator.contact_number}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {operator.email_address}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Address</h4>
                                    <div className="flex items-start gap-1 text-sm">
                                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                      <span>{getFullAddress(operator)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Bus Information</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Car className="h-4 w-4" />
                                      <strong>Plate:</strong> {operator.plate_number}
                                    </div>
                                    <div><strong>Route:</strong> {operator.route}</div>
                                  </div>
                                </div>
                                {operator.status === 'Rejected' && operator.rejection_reason && (
                                  <div>
                                    <h4 className="font-semibold mb-2 text-red-600">Rejection Reason</h4>
                                    <p className="text-sm bg-red-50 p-3 rounded">{operator.rejection_reason}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* View Franchise Document */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>Franchise Document - {getFullName(operator)}</DialogTitle>
                              </DialogHeader>
                              <div className="h-[70vh] overflow-auto">
                                {operator.franchise_document_url.toLowerCase().includes('.pdf') ? (
                                  <iframe
                                    src={operator.franchise_document_url}
                                    className="w-full h-full border-0"
                                    title="Franchise Document"
                                  />
                                ) : (
                                  <img
                                    src={operator.franchise_document_url}
                                    alt="Franchise Document"
                                    className="w-full h-auto object-contain"
                                  />
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Action Buttons */}
                          {operator.status === 'Pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApprove(operator.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedOperator(operator);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Operator Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You are about to reject the application for {selectedOperator && getFullName(selectedOperator)}. 
                Please provide a reason for rejection (optional).
              </p>
              <Textarea
                placeholder="Enter rejection reason (optional)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Reject Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AssistantLayout>
  );
};

export default NewOperatorsPage;