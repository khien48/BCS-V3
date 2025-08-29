
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { Filter, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const StatementOfTheAccount = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample tenant data
  const allTenants = [
    { id: 1, name: "Roderick, M", stallNo: "201", status: "Active", monthlyDues: "Paid" },
    { id: 2, name: "Naruto, B", stallNo: "133", status: "Inactive", monthlyDues: "Paid" },
    { id: 3, name: "Kangkong, M", stallNo: "002", status: "Active", monthlyDues: "Overdue" },
    { id: 4, name: "Xhunter, B", stallNo: "423", status: "Active", monthlyDues: "Paid" },
    { id: 5, name: "Jean, K", stallNo: "643", status: "Inactive", monthlyDues: "Paid" },
    { id: 6, name: "BatongBakal, M", stallNo: "211", status: "Active", monthlyDues: "Overdue" },
  ];

  // Filter tenants based on search query
  const filteredTenants = allTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tenant.stallNo.includes(searchQuery)
  );

  // Count statistics
  const totalTenants = allTenants.length;
  const totalPaid = allTenants.filter(tenant => tenant.monthlyDues === "Paid").length;
  const totalOverdue = allTenants.filter(tenant => tenant.monthlyDues === "Overdue").length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleFilter = () => {
    toast({
      title: "Filter applied",
      description: "Filtering functionality would be implemented here"
    });
  };

  const viewDetails = (tenantId: number) => {
    toast({
      title: "Viewing tenant details",
      description: `Viewing details for tenant ID: ${tenantId}`
    });
  };

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{totalTenants}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Tenant</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{totalPaid}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Paid</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-red-500">{totalOverdue}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Overdue</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-10 py-2 w-full border rounded-lg"
              value={searchQuery}
              onChange={handleSearch}
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <Button 
            variant="default" 
            className="bg-bcs-green hover:bg-bcs-green/90"
            onClick={handleFilter}
          >
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
        </div>

        {/* Tenant List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Tenant List</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Stall No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Monthly Dues</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>{tenant.name}</TableCell>
                    <TableCell>{tenant.stallNo}</TableCell>
                    <TableCell>
                      <span 
                        className={`${
                          tenant.status === 'Active' 
                            ? 'text-green-700'
                            : 'text-red-500'
                        }`}
                      >
                        {tenant.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`px-3 py-1 rounded-full text-sm ${
                          tenant.monthlyDues === 'Paid' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {tenant.monthlyDues}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="default" 
                        className="bg-bcs-green hover:bg-bcs-green/90 text-xs h-8"
                        onClick={() => viewDetails(tenant.id)}
                      >
                        VIEW DETAILS
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
};

export default StatementOfTheAccount;
