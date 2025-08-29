
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CashierLayout from '@/components/layouts/CashierLayout';
import { UserCredential } from '@/utils/auth';

interface TenantListProps {
  user: UserCredential | null;
}

const TenantList: React.FC<TenantListProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for unpaid tenants with new ID format
  const unpaidTenants = [
    { id: 1, tenantId: "T2025070901", name: "Roderick, M", stallNo: "201", status: "Active", paymentStatus: "Unpaid" },
    { id: 2, tenantId: "T2025070902", name: "Naruto, B", stallNo: "133", status: "Active", paymentStatus: "Unpaid" },
    { id: 3, tenantId: "T2025070903", name: "Kangkong, M", stallNo: "002", status: "Active", paymentStatus: "Unpaid" },
    { id: 4, tenantId: "T2025070904", name: "Xhunter, B", stallNo: "423", status: "Active", paymentStatus: "Unpaid" },
    { id: 5, tenantId: "T2025070905", name: "Jean, K", stallNo: "643", status: "Active", paymentStatus: "Unpaid" },
    { id: 6, tenantId: "T2025070906", name: "BatongBakal, M", stallNo: "211", status: "Active", paymentStatus: "Unpaid" },
  ];

  // Filter tenants based on search query
  const filteredTenants = unpaidTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tenant.stallNo.includes(searchQuery) ||
    tenant.tenantId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStalls = 23;
  const totalNonOccupied = 20;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <CashierLayout user={user}>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{totalStalls}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Stall's</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-red-500">{totalNonOccupied}</h3>
            <p className="mt-2 text-sm text-gray-600">Total non-occupied</p>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-10 py-2 w-full border rounded-lg"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            
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
          >
            Transaction History
          </Button>
        </div>

        {/* Tenant List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Tenant List</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant ID</TableHead>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Stall No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="bg-gradient-to-r from-purple-50 to-violet-50 text-purple-800 border-purple-300 px-3 py-1 font-semibold text-sm rounded-full"
                      >
                        {tenant.tenantId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.stallNo}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={tenant.status === 'Active' ? 'success' : 'secondary'}
                        className={tenant.status === 'Active' ? 'text-bcs-green' : ''}
                      >
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="pending"
                        className="text-red-500"
                      >
                        {tenant.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </CashierLayout>
  );
};

export default TenantList;
