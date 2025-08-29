import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssistantLayout from '../components/layouts/AssistantLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FilterIcon, X } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Define the tenant contract type
interface TenantContract {
  id: number;
  stallNo: string;
  tenantName: string;
  startContract: string;
  contractDue: string;
  status: 'Active' | 'Expired';
  contractStatus: 'Renewed' | 'Renewal pending';
}

// Sample data for the contracts
const initialContracts: TenantContract[] = [
  { 
    id: 1, 
    stallNo: '101', 
    tenantName: 'Roderick, M', 
    startContract: '1/2/2025', 
    contractDue: '2/2/2025', 
    status: 'Active',
    contractStatus: 'Renewed'
  },
  { 
    id: 2, 
    stallNo: '102', 
    tenantName: 'Naruto, B', 
    startContract: '1/16/2025', 
    contractDue: '2/16/2025', 
    status: 'Active',
    contractStatus: 'Renewed'
  },
  { 
    id: 3, 
    stallNo: '103', 
    tenantName: 'Kangkong, M', 
    startContract: '1/23/2025', 
    contractDue: '2/23/2025', 
    status: 'Expired',
    contractStatus: 'Renewal pending'
  },
  { 
    id: 4, 
    stallNo: '104', 
    tenantName: 'Xhunter, B', 
    startContract: '2/2/2025', 
    contractDue: '3/2/2025', 
    status: 'Active',
    contractStatus: 'Renewed'
  },
  { 
    id: 5, 
    stallNo: '105', 
    tenantName: 'Jean, K', 
    startContract: '2/5/2025', 
    contractDue: '3/5/2025', 
    status: 'Active',
    contractStatus: 'Renewed'
  },
  { 
    id: 6, 
    stallNo: '106', 
    tenantName: 'BatongBakal, M', 
    startContract: '2/26/2025', 
    contractDue: '3/26/2025', 
    status: 'Expired',
    contractStatus: 'Renewal pending'
  }
];

const RenewalContracts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contracts, setContracts] = useState<TenantContract[]>(initialContracts);
  const [filteredContracts, setFilteredContracts] = useState<TenantContract[]>(initialContracts);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setFilteredContracts(contracts);
      return;
    }
    
    const filtered = contracts.filter(contract => 
      contract.tenantName.toLowerCase().includes(query.toLowerCase()) ||
      contract.stallNo.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredContracts(filtered);
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredContracts(contracts);
  };

  // Function to filter contracts
  const applyFilter = (filterType: string) => {
    if (activeFilter === filterType) {
      setActiveFilter(null);
      setFilteredContracts(contracts);
      return;
    }

    setActiveFilter(filterType);
    let filtered: TenantContract[] = [];

    if (filterType === 'active') {
      filtered = contracts.filter(contract => contract.status === 'Active');
    } else if (filterType === 'expired') {
      filtered = contracts.filter(contract => contract.status === 'Expired');
    } else if (filterType === 'renewed') {
      filtered = contracts.filter(contract => contract.contractStatus === 'Renewed');
    } else if (filterType === 'pending') {
      filtered = contracts.filter(contract => contract.contractStatus === 'Renewal pending');
    } else {
      filtered = contracts;
    }

    setFilteredContracts(filtered);
    toast({
      title: "Filter Applied",
      description: `Showing ${filterType} contracts`
    });
  };

  // Handle view details - updated to navigate to contract details page
  const handleViewDetails = (id: number) => {
    navigate(`/assistant-admin/contracts/${id}`);
  };

  // Handle send report
  const handleSendReport = (id: number) => {
    toast({
      title: "Report Sent",
      description: `Report sent for contract #${id}`
    });
  };

  // Count of active and expired contracts
  const activeCount = contracts.filter(c => c.status === 'Active').length;
  const expiredCount = contracts.filter(c => c.status === 'Expired').length;

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-green-600">{activeCount}</div>
              <div className="text-gray-600 mt-2">Total Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-red-600">{expiredCount}</div>
              <div className="text-gray-600 mt-2">Total Expired</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between">
          <div className="relative w-full mr-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search"
              className="pl-10 pr-10 py-2 w-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            onClick={() => {
              toast({
                title: "Filter Options",
                description: "Filter options would show here"
              });
            }}
          >
            <FilterIcon className="h-5 w-5" />
            Filter
          </Button>
        </div>

        {/* Tenant List */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tenant List</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stall No</TableHead>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Start Contract</TableHead>
                  <TableHead>Contract Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contract Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.stallNo}</TableCell>
                    <TableCell>{contract.tenantName}</TableCell>
                    <TableCell>{contract.startContract}</TableCell>
                    <TableCell>{contract.contractDue}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-3 py-1 rounded-full text-sm ${
                          contract.status === 'Active'
                            ? 'text-green-800 bg-green-100'
                            : 'text-red-800 bg-red-100'
                        }`}
                      >
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell>{contract.contractStatus}</TableCell>
                    <TableCell>
                      {contract.contractStatus === 'Renewed' ? (
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          onClick={() => handleViewDetails(contract.id)}
                        >
                          VIEW DETAILS
                        </Button>
                      ) : (
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          onClick={() => handleSendReport(contract.id)}
                        >
                          SEND REPORT
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AssistantLayout>
  );
};

export default RenewalContracts;
