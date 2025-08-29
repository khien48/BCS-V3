
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import AssistantLayout from "../components/layouts/AssistantLayout";
import ContractHeader from '../components/contract/ContractHeader';
import ContractStatusBadge from '../components/contract/ContractStatusBadge';
import ContractInformationCard from '../components/contract/ContractInformationCard';
import TenantInformationCard from '../components/contract/TenantInformationCard';
import ContractDatesCard from '../components/contract/ContractDatesCard';

interface ContractData {
  id: number;
  stallNo: string;
  tenantName: string;
  startContract: string;
  contractDue: string;
  status: 'Active' | 'Expired';
  contractStatus: 'Renewed' | 'Renewal pending';
  tenantContact?: string;
  tenantEmail?: string;
  businessType?: string;
  monthlyRent?: number;
  lastRenewalDate?: string;
}

// Sample data - in a real app, this would come from the database
const sampleContracts: ContractData[] = [
  { 
    id: 1, 
    stallNo: '101', 
    tenantName: 'Roderick, M', 
    startContract: '1/2/2025', 
    contractDue: '2/2/2025', 
    status: 'Active',
    contractStatus: 'Renewed',
    tenantContact: '+63 912 345 6789',
    tenantEmail: 'roderick.m@email.com',
    businessType: 'Meat Shop',
    monthlyRent: 2500,
    lastRenewalDate: '1/2/2025'
  },
  { 
    id: 2, 
    stallNo: '102', 
    tenantName: 'Naruto, B', 
    startContract: '1/16/2025', 
    contractDue: '2/16/2025', 
    status: 'Active',
    contractStatus: 'Renewed',
    tenantContact: '+63 923 456 7890',
    tenantEmail: 'naruto.b@email.com',
    businessType: 'Vegetable Stand',
    monthlyRent: 2200,
    lastRenewalDate: '1/16/2025'
  },
  { 
    id: 3, 
    stallNo: '103', 
    tenantName: 'Kangkong, M', 
    startContract: '1/23/2025', 
    contractDue: '2/23/2025', 
    status: 'Expired',
    contractStatus: 'Renewal pending',
    tenantContact: '+63 934 567 8901',
    tenantEmail: 'kangkong.m@email.com',
    businessType: 'General Merchandise',
    monthlyRent: 2800,
    lastRenewalDate: '1/23/2024'
  }
];

const ContractDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Simulate API call - in real app, fetch from database
        const contract = sampleContracts.find(c => c.id === parseInt(id));
        
        if (contract) {
          setContractData(contract);
        }
      } catch (error) {
        console.error('Error fetching contract details:', error);
        toast({
          title: "Error",
          description: "Failed to load contract details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContractData();
  }, [id, toast]);

  const handleGoBack = () => {
    navigate('/assistant-admin/contracts');
  };

  const handleSendReport = () => {
    toast({
      title: "Report Sent",
      description: `Renewal report sent for ${contractData?.tenantName}`,
    });
  };

  const handleRenewContract = () => {
    toast({
      title: "Contract Renewed",
      description: `Contract for ${contractData?.tenantName} has been renewed`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <AssistantLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading contract details...</p>
        </div>
      </AssistantLayout>
    );
  }

  if (!contractData) {
    return (
      <AssistantLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Contract not found</p>
          <button 
            className="ml-4 bg-bcs-green hover:bg-bcs-green/90 text-white px-4 py-2 rounded"
            onClick={handleGoBack}
          >
            Back to Contracts
          </button>
        </div>
      </AssistantLayout>
    );
  }

  return (
    <AssistantLayout>
      <div className="space-y-6">
        <ContractHeader
          onGoBack={handleGoBack}
          contractStatus={contractData.contractStatus}
          onSendReport={handleSendReport}
          onRenewContract={handleRenewContract}
        />

        <ContractStatusBadge 
          status={contractData.status}
          contractStatus={contractData.contractStatus}
        />

        <ContractInformationCard 
          contractData={contractData}
          formatDate={formatDate}
        />

        <TenantInformationCard 
          contractData={contractData}
        />

        <ContractDatesCard 
          contractData={contractData}
          formatDate={formatDate}
        />
      </div>
    </AssistantLayout>
  );
};

export default ContractDetails;
