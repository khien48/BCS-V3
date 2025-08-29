import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Plus, Filter, CheckCircle2, User, Calendar, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Complaint } from '@/types/complaint';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { ComplaintRow } from '@/types/database';

const ReportComplaintPage = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState<Omit<Complaint, 'id'>>({
    name: '',
    date: format(new Date(), 'MM-dd-yy'),
    contact: '',
    subject: '',
    description: '',
    status: 'Pending'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>(['Pending', 'Resolved']);
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .returns<ComplaintRow[]>();

      if (error) {
        throw error;
      }

      if (data) {
        // Format dates for display and ensure correct typing
        const formattedComplaints = data.map(complaint => ({
          ...complaint,
          date: format(new Date(complaint.date), 'MM-dd-yy'),
          status: complaint.status as 'Pending' | 'Resolved'
        }));
        setComplaints(formattedComplaints);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching complaints",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredComplaints = complaints
    .filter(complaint => filterStatus.includes(complaint.status))
    .filter(complaint => 
      complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleAddComplaint = async () => {
    try {
      const today = new Date();
      const dateStr = format(today, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          name: newComplaint.name,
          contact: newComplaint.contact,
          subject: newComplaint.subject,
          description: newComplaint.description,
          // Other fields like date, status have default values in the database
        })
        .select()
        .single();

      if (error) throw error;

      // Format date for display and ensure correct typing for status
      const formattedComplaint: Complaint = {
        ...data,
        date: format(new Date(data.date), 'MM-dd-yy'),
        status: data.status as 'Pending' | 'Resolved'
      };
      
      setComplaints([formattedComplaint, ...complaints]);
      setNewComplaint({
        name: '',
        date: format(new Date(), 'MM-dd-yy'),
        contact: '',
        subject: '',
        description: '',
        status: 'Pending'
      });
      
      setIsAddDialogOpen(false);
      toast({
        title: "Complaint Added",
        description: "The complaint has been successfully added."
      });
    } catch (error: any) {
      toast({
        title: "Error adding complaint",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleResolveComplaint = async (id: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: 'Resolved' as const })
        .eq('id', id);

      if (error) throw error;

      setComplaints(complaints.map(complaint => 
        complaint.id === id ? { ...complaint, status: 'Resolved' as const } : complaint
      ));
      
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({
          ...selectedComplaint,
          status: 'Resolved'
        });
      }
      
      toast({
        title: "Complaint Resolved",
        description: "The complaint has been marked as resolved."
      });
    } catch (error: any) {
      toast({
        title: "Error resolving complaint",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Statistics Cards - Enhanced with better design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">{pendingCount}</p>
              <p className="text-gray-600 text-sm">Pending Complaints</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600">{resolvedCount}</p>
              <p className="text-gray-600 text-sm">Resolved Complaints</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar - Enhanced with modern design */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm">
            <div className="pl-5 pr-2 py-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              className="flex-1 py-3 pr-10 outline-none border-none text-sm" 
              placeholder="Search complaints..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
            {searchTerm && (
              <button 
                className="absolute right-5 top-1/2 -translate-y-1/2" 
                onClick={() => setSearchTerm('')}
              >
                <div className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Plus className="rotate-45 h-3 w-3" />
                </div>
              </button>
            )}
          </div>
        </div>
        
        {/* Add Report button */}
        <Button 
          onClick={() => setIsAddDialogOpen(true)} 
          className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm flex items-center gap-2 px-5 py-3"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">Add Report</span>
        </Button>
        
        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full px-5 py-3 shadow-sm"
            >
              <Filter size={16} />
              <span className="text-sm font-medium">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg border border-gray-100 rounded-lg">
            <DropdownMenuLabel className="text-sm">Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem 
              checked={filterStatus.includes('Pending')} 
              onCheckedChange={checked => {
                setFilterStatus(checked ? 
                  [...filterStatus, 'Pending'] : 
                  filterStatus.filter(s => s !== 'Pending')
                );
              }}
            >
              Pending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={filterStatus.includes('Resolved')} 
              onCheckedChange={checked => {
                setFilterStatus(checked ? 
                  [...filterStatus, 'Resolved'] : 
                  filterStatus.filter(s => s !== 'Resolved')
                );
              }}
            >
              Resolved
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Resizable Split View - Enhanced with better design */}
      <ResizablePanelGroup 
        direction="horizontal" 
        className="bg-white border rounded-xl shadow-sm min-h-[700px] overflow-hidden"
      >
        {/* Complaint List Panel */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Report List
              </h2>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                {filteredComplaints.length} Reports
              </span>
            </div>
            
            <div className="overflow-auto flex-1">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-600">Subject</TableHead>
                    <TableHead className="font-semibold text-gray-600">Created</TableHead>
                    <TableHead className="font-semibold text-gray-600">Status</TableHead>
                    <TableHead className="font-semibold text-gray-600 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="animate-spin h-8 w-8 border-2 border-green-600 rounded-full border-t-transparent"></div>
                        </div>
                        <p className="mt-3 text-gray-500 font-medium">Loading complaints...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredComplaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                        <div className="flex justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a7 7 0 110-14 7 7 0 010 14z" />
                          </svg>
                        </div>
                        <p className="mt-3 text-gray-500 font-medium">No complaints found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComplaints.map(complaint => (
                      <TableRow 
                        key={complaint.id} 
                        className={`${
                          selectedComplaint?.id === complaint.id 
                            ? 'bg-green-50 border-l-4 border-l-green-600' 
                            : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                        } transition-colors cursor-pointer`}
                        onClick={() => handleViewDetails(complaint)}
                      >
                        <TableCell className="font-medium">{complaint.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {complaint.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`${
                              complaint.status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            } rounded-full font-medium`}
                          >
                            {complaint.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="default" 
                            className="bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(complaint);
                            }}
                          >
                            VIEW DETAILS
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Enhanced pagination */}
            <div className="flex items-center justify-between p-6 border-t">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredComplaints.length}</span> reports
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white" disabled>
                  <ChevronLeft className="h-5 w-5 text-gray-400" />
                </button>
                <span className="text-sm font-medium bg-green-600 text-white h-8 w-8 rounded-full flex items-center justify-center">1</span>
                <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white" disabled>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </ResizablePanel>
        
        {/* Resizable Handle - Styled */}
        <ResizableHandle className="bg-gray-100 w-1 hover:bg-green-200 transition-colors" />
        
        {/* Details Panel - Enhanced design */}
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full p-8 overflow-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Complaint Details
              </h2>
              {selectedComplaint && (
                <Badge 
                  className={`${
                    selectedComplaint?.status === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
                  } rounded-full px-3 py-1 text-sm font-medium`}
                >
                  {selectedComplaint?.status}
                </Badge>
              )}
            </div>
            
            {selectedComplaint ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{selectedComplaint.name}</h3>
                        <p className="text-gray-500 text-sm">{selectedComplaint.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm py-3 border-b border-gray-100">
                      <span className="text-gray-500">Date Reported:</span>
                      <span className="font-medium">{selectedComplaint.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Subject of Issue
                  </h3>
                  <p className="text-green-600 font-medium text-lg">{selectedComplaint.subject}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedComplaint.description}
                    </p>
                  </div>
                </div>
                
                {selectedComplaint.status === 'Pending' && (
                  <div className="flex justify-end pt-4">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 rounded-lg shadow-sm px-6"
                      onClick={() => handleResolveComplaint(selectedComplaint.id)}
                    >
                      <CheckCircle2 size={18} />
                      Mark as Resolved
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-4/5">
                <div className="text-gray-300 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">No complaint selected</h3>
                <p className="text-gray-500 mt-2 text-center max-w-sm">
                  Select a complaint from the list to view its details
                </p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Add New Complaint Dialog - Enhanced design */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-xl overflow-hidden shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add New Complaint
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium text-gray-600">
                Name
              </Label>
              <div className="col-span-3">
                <Input 
                  id="name" 
                  className="w-full" 
                  value={newComplaint.name} 
                  onChange={e => setNewComplaint({
                    ...newComplaint,
                    name: e.target.value
                  })} 
                  placeholder="Enter complainant name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right font-medium text-gray-600">
                Contact
              </Label>
              <div className="col-span-3">
                <Input 
                  id="contact" 
                  className="w-full" 
                  value={newComplaint.contact} 
                  onChange={e => setNewComplaint({
                    ...newComplaint,
                    contact: e.target.value
                  })} 
                  placeholder="Email or phone number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right font-medium text-gray-600">
                Subject
              </Label>
              <div className="col-span-3">
                <Input 
                  id="subject" 
                  className="w-full" 
                  value={newComplaint.subject} 
                  onChange={e => setNewComplaint({
                    ...newComplaint,
                    subject: e.target.value
                  })} 
                  placeholder="Brief subject of complaint"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right font-medium text-gray-600 pt-2">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea 
                  id="description" 
                  className="w-full" 
                  rows={5} 
                  value={newComplaint.description} 
                  onChange={e => setNewComplaint({
                    ...newComplaint,
                    description: e.target.value
                  })} 
                  placeholder="Detailed description of the complaint..."
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t p-4 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleAddComplaint}
              disabled={!newComplaint.name || !newComplaint.subject || !newComplaint.description || !newComplaint.contact}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportComplaintPage;
