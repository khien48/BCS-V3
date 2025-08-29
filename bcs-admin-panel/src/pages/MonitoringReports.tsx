import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import AdminLayout from "@/components/layouts/AdminLayout";
import { UserCredential } from "../utils/auth";
type ContractStatus = "Active" | "Expired" | "Pending" | "Renewed";
interface Tenant {
  id: number;
  name: string;
  stallNo: string;
  status: "Active" | "Inactive";
  stallNoAssigned: string;
  contractStatus: ContractStatus;
}
const MonitoringReportsContent = () => {
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample tenant data
  const allTenants: Tenant[] = [{
    id: 1,
    name: "Roderick, M",
    stallNo: "201",
    status: "Active",
    stallNoAssigned: "101",
    contractStatus: "Active"
  }, {
    id: 2,
    name: "Naruto, B",
    stallNo: "133",
    status: "Inactive",
    stallNoAssigned: "102",
    contractStatus: "Expired"
  }, {
    id: 3,
    name: "Kangkong, M",
    stallNo: "002",
    status: "Active",
    stallNoAssigned: "103",
    contractStatus: "Pending"
  }, {
    id: 4,
    name: "Xhunter, B",
    stallNo: "423",
    status: "Active",
    stallNoAssigned: "104",
    contractStatus: "Active"
  }, {
    id: 5,
    name: "Jean, K",
    stallNo: "643",
    status: "Inactive",
    stallNoAssigned: "105",
    contractStatus: "Renewed"
  }, {
    id: 6,
    name: "BatongBakal, M",
    stallNo: "211",
    status: "Active",
    stallNoAssigned: "106",
    contractStatus: "Renewed"
  }];

  // Filter tenants based on search query
  const filteredTenants = allTenants.filter(tenant => tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || tenant.stallNo.includes(searchQuery) || tenant.stallNoAssigned.includes(searchQuery));

  // Count statistics
  const totalTenants = allTenants.length;
  const totalOverdue = 20; // This is hardcoded as per the image

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
  const getContractStatusStyle = (status: ContractStatus) => {
    switch (status) {
      case "Active":
        return "text-green-700";
      case "Expired":
        return "text-red-500";
      case "Pending":
        return "text-amber-500";
      case "Renewed":
        return "text-blue-500";
      default:
        return "";
    }
  };
  return <div className="space-y-6 p-6 bg-gray-50 px-[24px] py-[2px]">
      
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-4xl font-bold text-bcs-green">300</h3>
          <p className="mt-2 text-sm text-gray-600">Total Tenant</p>
        </Card>
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-4xl font-bold text-red-500">20</h3>
          <p className="mt-2 text-sm text-gray-600">Total Overdue</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 max-w-3xl">
        <div className="flex-1 relative">
          <Input type="text" placeholder="Search" className="pl-10 pr-10 py-2 w-full border rounded-lg" value={searchQuery} onChange={handleSearch} />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          
          {searchQuery && <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>}
        </div>
        <Button variant="default" className="bg-bcs-green hover:bg-bcs-green/90" onClick={handleFilter}>
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
                <TableHead>Contract Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map(tenant => <TableRow key={tenant.id}>
                  <TableCell>{tenant.name}</TableCell>
                  <TableCell>{tenant.stallNo}</TableCell>
                  <TableCell>
                    <span className={`${tenant.status === 'Active' ? 'text-green-700' : 'text-red-500'}`}>
                      {tenant.status}
                    </span>
                  </TableCell>
                  <TableCell>{tenant.stallNoAssigned}</TableCell>
                  <TableCell>
                    <span className={getContractStatusStyle(tenant.contractStatus)}>
                      {tenant.contractStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="default" className="bg-bcs-green hover:bg-bcs-green/90 text-xs h-8" onClick={() => viewDetails(tenant.id)}>
                      VIEW DETAILS
                    </Button>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>;
};
const MonitoringReports = () => {
  // Mock user data - in a real app, this would come from context/props
  // Modified to match UserCredential interface that doesn't have an 'id' property
  const adminUser: UserCredential = {
    email: "admin@example.com",
    password: "admin123",
    // Added required password property
    name: "Admin User",
    role: "admin"
  };
  return <AdminLayout user={adminUser}>
      <MonitoringReportsContent />
    </AdminLayout>;
};
export default MonitoringReports;