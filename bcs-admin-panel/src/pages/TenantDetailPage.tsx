
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssistantLayout from '../components/layouts/AssistantLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Store, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TenantDetail {
  id: number;
  name: string;
  stallNo: string;
  status: string;
  stallNoAssigned: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  businessType: string;
  dateJoined: string;
  contractEndDate: string;
  monthlyFee: string;
  paymentStatus: string;
  paymentHistory: {
    date: string;
    amount: string;
    status: string;
    receiptNo: string;
  }[];
  documents: {
    name: string;
    status: string;
    dateSubmitted: string;
  }[];
}

const TenantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch tenant data from our mock data based on ID
  useEffect(() => {
    // Simulating API call delay
    setTimeout(() => {
      // Sample tenant data that matches the provided UI mockup
      const mockTenant: TenantDetail = {
        id: Number(id),
        name: "Roderick Mendoza",
        stallNo: "101",
        status: "Active",
        stallNoAssigned: "101",
        phoneNumber: "+63 912 345 6789",
        emailAddress: "roderick.m@example.com",
        address: "123 Market St, Manila",
        businessType: "Fruits and Vegetables",
        dateJoined: "5/15/2023",
        contractEndDate: "5/15/2024",
        monthlyFee: "₱5,000.00",
        paymentStatus: "Up to date",
        paymentHistory: [
          { date: "12/1/2025", amount: "₱5,000.00", status: "Paid", receiptNo: "R-123456" },
          { date: "12/1/2025", amount: "₱5,000.00", status: "Paid", receiptNo: "R-123456" },
          { date: "12/1/2025", amount: "₱5,000.00", status: "Paid", receiptNo: "R-123456" },
          { date: "12/1/2025", amount: "₱5,000.00", status: "Paid", receiptNo: "R-123456" },
          { date: "12/1/2025", amount: "₱5,000.00", status: "Paid", receiptNo: "R-123456" },
          { date: "12/1/2025", amount: "₱5,000.00", status: "Paid", receiptNo: "R-123456" },
        ],
        documents: [
          { name: "Market Clearance", status: "Verified", dateSubmitted: "5/10/2023" },
          { name: "Business Permit", status: "Verified", dateSubmitted: "5/10/2023" },
          { name: "DTI Registration", status: "Verified", dateSubmitted: "5/10/2023" },
          { name: "Health Certificate", status: "Verified", dateSubmitted: "5/10/2023" },
        ]
      };
      
      setTenant(mockTenant);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleBackClick = () => {
    navigate('/assistant-admin/profile');
  };
  
  const handleViewDocument = (documentName: string) => {
    toast({
      title: "Document Viewer",
      description: `Viewing ${documentName} document`
    });
  };
  
  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading tenant details...</p>
        </div>
      </AssistantLayout>
    );
  }
  
  if (!tenant) {
    return (
      <AssistantLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Tenant not found</p>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Back button */}
        <div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleBackClick}
          >
            <ArrowLeft size={16} />
            Back to Tenant List
          </Button>
        </div>
        
        {/* Tenant header with status */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">Tenant Profile's</h2>
          <div className={`px-6 py-2 rounded-md flex items-center gap-2 ${
            tenant.status === 'Active' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            <Check className="h-5 w-5" />
            {tenant.status}
          </div>
        </div>
        
        {/* Tenant profile card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-6">
            <div className="bg-gray-100 rounded-full p-8 w-24 h-24 flex items-center justify-center">
              <Store className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{tenant.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="flex items-center gap-1">
                  <span>Stall No: {tenant.stallNo}</span>
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <Store className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">{tenant.businessType}</span>
            </div>
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <div className="bg-gray-100 rounded-lg">
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 bg-white rounded-b-lg">
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{tenant.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date Joined</p>
                      <p className="font-medium">{tenant.dateJoined}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{tenant.emailAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contract End Date</p>
                      <p className="font-medium">{tenant.contractEndDate}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{tenant.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Stall Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Stall Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Business Type</p>
                      <p className="font-medium">{tenant.businessType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Fee</p>
                      <p className="font-medium">{tenant.monthlyFee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className="font-medium text-green-600">{tenant.paymentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Payments Tab */}
            <TabsContent value="payments" className="bg-white rounded-b-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receipt No.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tenant.paymentHistory.map((payment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-4 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.receiptNo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Documents Tab */}
            <TabsContent value="documents" className="bg-white rounded-b-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Documents</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tenant.documents.map((doc, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {doc.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-4 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {doc.dateSubmitted}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button 
                              onClick={() => handleViewDocument(doc.name)}
                              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AssistantLayout>
  );
};

export default TenantDetailPage;
