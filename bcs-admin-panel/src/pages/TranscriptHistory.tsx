
import React, { useState } from 'react';
import { Search, X, Eye } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CashierLayout from '@/components/layouts/CashierLayout';
import { UserCredential } from '@/utils/auth';

interface TranscriptHistoryProps {
  user: UserCredential | null;
}

const TranscriptHistory: React.FC<TranscriptHistoryProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showBillStatement, setShowBillStatement] = useState(false);
  
  // Mock data for paid tenants
  const paidTenants = [
    { 
      id: 1, 
      name: "Maria, S", 
      stallNo: "105", 
      status: "Active", 
      paymentStatus: "Paid",
      stallName: "Maria's Store",
      stallNumber: "105",
      bills: [
        { type: "WATER", amount: 800 },
        { type: "ELECTRICITY", amount: 1500 }
      ]
    },
    { 
      id: 2, 
      name: "Carlos, R", 
      stallNo: "107", 
      status: "Active", 
      paymentStatus: "Paid",
      stallName: "Carlos Shop",
      stallNumber: "107",
      bills: [
        { type: "WATER", amount: 1200 },
        { type: "ELECTRICITY", amount: 1800 }
      ]
    },
    { 
      id: 3, 
      name: "Ana, L", 
      stallNo: "110", 
      status: "Active", 
      paymentStatus: "Paid",
      stallName: "Ana's Goods",
      stallNumber: "110",
      bills: [
        { type: "WATER", amount: 900 },
        { type: "ELECTRICITY", amount: 1600 }
      ]
    },
  ];

  // Filter tenants based on search query
  const filteredTenants = paidTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tenant.stallNo.includes(searchQuery)
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const viewBillStatement = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowBillStatement(true);
  };

  const closeBillStatement = () => {
    setShowBillStatement(false);
    setSelectedTenant(null);
  };

  const getTotalAmount = (bills: any[]) => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  return (
    <CashierLayout user={user}>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">{paidTenants.length}</h3>
            <p className="mt-2 text-sm text-gray-600">Total Paid Tenants</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">
              ₱{paidTenants.reduce((total, tenant) => total + getTotalAmount(tenant.bills), 0).toLocaleString()}
            </h3>
            <p className="mt-2 text-sm text-gray-600">Total Revenue</p>
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
        </div>

        {/* Transaction History List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Transaction History</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Stall No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.stallNo}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="success"
                        className="text-bcs-green"
                      >
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="success"
                        className="text-bcs-green"
                      >
                        {tenant.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-bcs-green text-bcs-green hover:bg-bcs-green/10"
                        onClick={() => viewBillStatement(tenant)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bill Statement Modal */}
        {showBillStatement && selectedTenant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Bill Statement</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={closeBillStatement}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stall Name:</span>
                  <span className="font-medium">{selectedTenant.stallName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stall Number:</span>
                  <span className="font-medium">{selectedTenant.stallNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tenant Name:</span>
                  <span className="font-medium">{selectedTenant.name}</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Bill Statement</h4>
                  {selectedTenant.bills.map((bill: any, index: number) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{bill.type}</span>
                      <span>{bill.amount}</span>
                    </div>
                  ))}
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₱ {getTotalAmount(selectedTenant.bills)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-bcs-green hover:bg-bcs-green/90 mt-4"
                  onClick={closeBillStatement}
                >
                  PAID
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CashierLayout>
  );
};

export default TranscriptHistory;
