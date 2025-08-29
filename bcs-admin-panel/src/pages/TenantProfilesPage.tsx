
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { Filter, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const TenantProfilesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample tenant data
  const allTenants = [
    { id: 1, name: "Roderick, M", stallNo: "201", status: "Active", stallNoAssigned: "101" },
    { id: 2, name: "Naruto, B", stallNo: "133", status: "Inactive", stallNoAssigned: "102" },
    { id: 3, name: "Kangkong, M", stallNo: "002", status: "Active", stallNoAssigned: "103" },
    { id: 4, name: "Xhunter, B", stallNo: "423", status: "Active", stallNoAssigned: "104" },
    { id: 5, name: "Jean, K", stallNo: "643", status: "Inactive", stallNoAssigned: "105" },
    { id: 6, name: "BatongBakal, M", stallNo: "211", status: "Active", stallNoAssigned: "106" },
  ];

  // Filter tenants based on search query
  const filteredTenants = allTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tenant.stallNo.includes(searchQuery) ||
    tenant.stallNoAssigned.includes(searchQuery)
  );

  // Count active and inactive tenants
  const activeTenants = allTenants.filter(tenant => tenant.status === "Active").length;
  const inactiveTenants = allTenants.filter(tenant => tenant.status === "Inactive").length;
  const totalTenants = allTenants.length;

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
    navigate(`/assistant-admin/profile/${tenantId}`);
  };

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{activeTenants}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Active</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{inactiveTenants}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Inactive</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{totalTenants}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Tenant</p>
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
                  <TableHead>Stall No:</TableHead>
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
                        className={`px-3 py-1 rounded-full text-sm ${
                          tenant.status === 'Active' 
                            ? 'text-green-700' 
                            : 'text-red-500'
                        }`}
                      >
                        {tenant.status}
                      </span>
                    </TableCell>
                    <TableCell>{tenant.stallNoAssigned}</TableCell>
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

        {/* Operator Profiles */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Operator Profiles</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator Name</TableHead>
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 1, name: "Grande N.", busNumber: "ABC-123", route: "NAGA - IRIGA", status: "Active", contact: "+63 912 345 6789" },
                  { id: 2, name: "Maria K.", busNumber: "DEF-456", route: "NAGA - LEGAZPI", status: "Active", contact: "+63 987 654 3210" },
                  { id: 3, name: "Juan S.", busNumber: "GHI-789", route: "NAGA - SIPOCOT", status: "Pending", contact: "+63 998 765 4321" },
                  { id: 4, name: "Charlie A.", busNumber: "JKL-012", route: "NAGA - IRIGA", status: "Active", contact: "+63 956 789 0123" },
                  { id: 5, name: "Alice C.", busNumber: "MNO-345", route: "NAGA - LEGAZPI", status: "Inactive", contact: "+63 923 456 7890" },
                ].map((operator) => (
                  <TableRow key={operator.id}>
                    <TableCell>{operator.name}</TableCell>
                    <TableCell className="font-mono">{operator.busNumber}</TableCell>
                    <TableCell>{operator.route}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-3 py-1 rounded-full text-sm ${
                          operator.status === 'Active' 
                            ? 'text-green-700' 
                            : operator.status === 'Pending'
                            ? 'text-yellow-700'
                            : 'text-red-500'
                        }`}
                      >
                        {operator.status}
                      </span>
                    </TableCell>
                    <TableCell>{operator.contact}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="default" 
                        className="bg-bcs-green hover:bg-bcs-green/90 text-xs h-8"
                        onClick={() => {
                          toast({
                            title: "Operator Details",
                            description: `Viewing details for ${operator.name}`
                          });
                        }}
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

export default TenantProfilesPage;
