
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AssistantLayout from '../components/layouts/AssistantLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';

interface TenantDetails {
  id: string;
  name: string;
  stallNo: string;
  birthdate: string;
  homeAddress: string;
  contactNumber: string;
  email: string;
  businessName: string;
  businessType: string;
}

const StallDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<TenantDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, we would fetch the tenant data from the database
    // For now, we'll use mock data
    const mockTenantDetails: TenantDetails = {
      id: id || '101',
      name: 'Irene M. Santos',
      stallNo: id || '101',
      birthdate: '12/23/1984',
      homeAddress: 'Elk St. 144, Metro Manila',
      contactNumber: '114-664-055',
      email: 'irene@email.com',
      businessName: 'Irene Fresh Pili Nuts Store and Balikbayan Gift\'s',
      businessType: 'PILI NUT STORE',
    };

    // Simulate API loading
    setTimeout(() => {
      setTenant(mockTenantDetails);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    navigate('/assistant-admin/stalls');
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-lg">Loading tenant details...</div>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Stalls
          </Button>
          <h2 className="text-2xl font-bold">Stall Details</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Tenant Personal Information Card */}
          <Card className="shadow-md rounded-xl overflow-hidden">
            <div className="bg-bcs-green p-4 text-white">
              <h3 className="text-xl font-semibold">Tenant Information</h3>
            </div>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 rounded-full p-8">
                    <User size={64} className="text-gray-500" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{tenant?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stall No.</p>
                      <p className="font-medium">{tenant?.stallNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Birthdate</p>
                      <p className="font-medium">{tenant?.birthdate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Home Address</p>
                      <p className="font-medium">{tenant?.homeAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="font-medium">{tenant?.contactNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{tenant?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details Card */}
          <Card className="shadow-md rounded-xl overflow-hidden">
            <div className="bg-bcs-green p-4 text-white">
              <h3 className="text-xl font-semibold">Business Details</h3>
            </div>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Business Name</p>
                  <p className="font-medium">{tenant?.businessName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type of Business</p>
                  <p className="font-medium">{tenant?.businessType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AssistantLayout>
  );
};

export default StallDetails;
