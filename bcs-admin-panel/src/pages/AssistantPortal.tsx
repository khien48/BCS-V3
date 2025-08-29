
import { useState } from 'react';
import AssistantLayout from '../components/layouts/AssistantLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const StallCard = ({ number, status }: { number: string; status: 'Occupied' | 'Available' }) => (
  <Card className="border rounded-lg overflow-hidden">
    <CardContent className="p-4 flex flex-col items-center space-y-2">
      <img
        src="/lovable-uploads/5910c9d6-2943-4e8c-8cdd-f7466dfc2385.png"
        alt={`Stall ${number}`}
        className="w-20 h-20 object-contain"
      />
      <h3 className="text-lg font-medium text-gray-900">Stall No: {number}</h3>
      <span className={`px-4 py-1 rounded-full text-sm ${
        status === 'Occupied' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {status}
      </span>
    </CardContent>
  </Card>
);

// Sample uploaded documents data
const documents = [
  { id: 1, name: 'BCS Clearance', status: 'Uploaded', applicantId: 'abc123' },
  { id: 2, name: 'Mayor\'s Permit', status: 'Uploaded', applicantId: 'def456' },
  { id: 3, name: 'DTI/SEC Registration', status: 'Uploaded', applicantId: 'ghi789' },
  { id: 4, name: 'Drug Test Result', status: 'Uploaded', applicantId: 'jkl012' },
  { id: 5, name: 'Board Resolution', status: 'Not uploaded', applicantId: 'mno345' },
  { id: 6, name: 'Stall Photo', status: 'Uploaded', applicantId: 'pqr678' },
];

// Sample data for the chart
const data = [
  { month: 'Jan', stalls: 200, articles: 35, contracts: 25 },
  { month: 'Feb', stalls: 180, articles: 40, contracts: 30 },
  { month: 'Mar', stalls: 220, articles: 45, contracts: 35 },
  { month: 'Apr', stalls: 250, articles: 50, contracts: 40 },
];

const DocumentCard = ({ document }: { document: typeof documents[0] }) => {
  const isUploaded = document.status === 'Uploaded';

  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h4 className="font-medium text-gray-900">{document.name}</h4>
          <p className={`text-sm ${isUploaded ? 'text-green-600' : 'text-amber-500'}`}>
            {document.status}
          </p>
        </div>
        {isUploaded && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Eye className="h-4 w-4 text-bcs-green" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>{document.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <div className="aspect-[4/3] rounded-md bg-gray-100 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/c783ea26-96fe-4d20-bf04-a197fec00cf4.png" 
                    alt={document.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Document ID: {document.id}</p>
                  <p className="text-sm text-gray-500 mb-2">Applicant ID: {document.applicantId}</p>
                  <p className="text-sm text-gray-500">Uploaded on: April 22, 2025</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </CardContent>
    </Card>
  );
};

const AssistantPortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Stalls', value: '300', color: 'text-bcs-green' },
    { label: 'Total Articles', value: '45', color: 'text-blue-500' },
    { label: 'Active Contracts', value: '280', color: 'text-purple-500' },
    { label: 'Total Accounts', value: '320', color: 'text-orange-500' },
  ];

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b pb-2">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'bg-bcs-green' : ''}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'documents' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('documents')}
            className={activeTab === 'documents' ? 'bg-bcs-green' : ''}
          >
            Documents
          </Button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <h3 className={`text-4xl font-bold ${stat.color}`}>{stat.value}</h3>
                    <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Analytics Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="stalls" fill="#16a34a" name="Stalls" />
                      <Bar dataKey="articles" fill="#3b82f6" name="Articles" />
                      <Bar dataKey="contracts" fill="#a855f7" name="Contracts" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'New stall contract signed', time: '2 hours ago' },
                    { action: 'Article published', time: '4 hours ago' },
                    { action: 'New account registered', time: '6 hours ago' },
                    { action: 'Contract renewed', time: '8 hours ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-gray-800">{activity.action}</span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'documents' && (
          <>
            {/* Documents Search Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Uploaded Documents</h2>
              <div className="relative w-64">
                <Input
                  className="pl-10 pr-4 py-2 border rounded-lg"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          </>
        )}
      </div>
    </AssistantLayout>
  );
};

export default AssistantPortal;
