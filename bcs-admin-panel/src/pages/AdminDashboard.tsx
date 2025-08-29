import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCredential } from '../utils/auth';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Menu, Users, Activity, Clock, ChevronRight } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
interface AdminDashboardProps {
  user: UserCredential | null;
}
interface PortalStats {
  users: number;
  activeUsers: number;
  features: number;
  averageUsageTime: string;
}
interface PortalFeature {
  name: string;
  description: string;
  status: 'active' | 'maintenance' | 'development';
}
const AdminDashboard = ({
  user
}: AdminDashboardProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    cashier: {
      users: 12,
      activeUsers: 8,
      features: 6,
      averageUsageTime: '3.5 hrs'
    } as PortalStats,
    assistant: {
      users: 6,
      activeUsers: 4,
      features: 8,
      averageUsageTime: '4.2 hrs'
    } as PortalStats,
    dispatcher: {
      users: 9,
      activeUsers: 7,
      features: 5,
      averageUsageTime: '5.1 hrs'
    } as PortalStats
  });
  const [features, setFeatures] = useState({
    cashier: [{
      name: 'Bus Fee Management',
      description: 'Manage and process bus parking fees',
      status: 'active'
    }, {
      name: 'Payment Processing',
      description: 'Process payments for various services',
      status: 'active'
    }, {
      name: 'Receipt Generation',
      description: 'Generate digital and printable receipts',
      status: 'active'
    }, {
      name: 'Analytics Dashboard',
      description: 'View payment analytics and trends',
      status: 'active'
    }, {
      name: 'User Management',
      description: 'Manage user accounts and permissions',
      status: 'maintenance'
    }, {
      name: 'Report Generation',
      description: 'Create and export financial reports',
      status: 'development'
    }] as PortalFeature[],
    assistant: [{
      name: 'Tenant Management',
      description: 'Manage tenant profiles and contracts',
      status: 'active'
    }, {
      name: 'Stalls Management',
      description: 'Oversee stall allocation and status',
      status: 'active'
    }, {
      name: 'Contract Processing',
      description: 'Process and renew tenant contracts',
      status: 'active'
    }, {
      name: 'Application Review',
      description: 'Review and process tenant applications',
      status: 'active'
    }, {
      name: 'Document Management',
      description: 'Store and manage tenant documents',
      status: 'active'
    }, {
      name: 'Billing Management',
      description: 'Generate and track tenant bills',
      status: 'active'
    }, {
      name: 'Tenant Communication',
      description: 'Send notifications to tenants',
      status: 'maintenance'
    }, {
      name: 'Analytics Dashboard',
      description: 'View tenant and stall analytics',
      status: 'development'
    }] as PortalFeature[],
    dispatcher: [{
      name: 'Schedule Management',
      description: 'Create and manage bus schedules',
      status: 'active'
    }, {
      name: 'Complaint Handling',
      description: 'Process and resolve customer complaints',
      status: 'active'
    }, {
      name: 'Terminal Status',
      description: 'Monitor terminal occupancy and status',
      status: 'active'
    }, {
      name: 'Dispatch Coordination',
      description: 'Coordinate bus departures and arrivals',
      status: 'active'
    }, {
      name: 'Report Generation',
      description: 'Generate terminal operation reports',
      status: 'development'
    }] as PortalFeature[]
  });
  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!user) {
      navigate('/');
    } else if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  if (!user || user.role !== 'admin') return null;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const StatCard = ({
    icon: Icon,
    title,
    value,
    className
  }: {
    icon: any;
    title: string;
    value: string | number;
    className?: string;
  }) => <Card className={`flex items-center p-6 ${className || ''}`}>
      <div className="p-3 rounded-full bg-bcs-green/10 mr-4">
        <Icon className="h-6 w-6 text-bcs-green" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h4 className="text-2xl font-semibold">{value}</h4>
      </div>
    </Card>;
  return <AdminLayout user={user}>
      {/* Main Content */}
      <main>
        
        
        {/* Tabs for different portals */}
        <Tabs defaultValue="cashier" className="w-full py-[24px]">
          <TabsList className="mb-6">
            <TabsTrigger value="cashier">Cashier Portal</TabsTrigger>
            <TabsTrigger value="assistant">Assistant Portal</TabsTrigger>
            <TabsTrigger value="dispatcher">Terminal Operator Portal</TabsTrigger>
          </TabsList>
          
          {/* Cashier Portal Content */}
          <TabsContent value="cashier">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard icon={Users} title="Total Users" value={stats.cashier.users} />
              <StatCard icon={Activity} title="Active Users" value={stats.cashier.activeUsers} />
              <StatCard icon={Menu} title="Total Features" value={stats.cashier.features} />
              <StatCard icon={Clock} title="Avg. Usage Time" value={stats.cashier.averageUsageTime} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h3 className="text-lg font-semibold mb-4">Role Overview</h3>
              <p className="text-gray-600 mb-4">
                Cashiers are responsible for handling financial transactions within the bus terminal. 
                They process bus parking fees, manage receipts, and maintain financial records for the terminal operations.
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <button className="flex items-center text-bcs-green" onClick={() => navigate('/cashier')}>
                  <span>View Cashier Portal</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Features & Functionality</h3>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.cashier.map((feature, index) => <TableRow key={index}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell>{feature.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(feature.status)}`}>
                          {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Assistant Portal Content */}
          <TabsContent value="assistant">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard icon={Users} title="Total Users" value={stats.assistant.users} />
              <StatCard icon={Activity} title="Active Users" value={stats.assistant.activeUsers} />
              <StatCard icon={Menu} title="Total Features" value={stats.assistant.features} />
              <StatCard icon={Clock} title="Avg. Usage Time" value={stats.assistant.averageUsageTime} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h3 className="text-lg font-semibold mb-4">Role Overview</h3>
              <p className="text-gray-600 mb-4">
                Admin Assistants manage tenant relationships and leasing operations for the bus terminal. 
                They process applications, handle contracts, and maintain tenant records for all commercial spaces within the terminal.
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <button className="flex items-center text-bcs-green" onClick={() => navigate('/assistant-admin')}>
                  <span>View Assistant Portal</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Features & Functionality</h3>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.assistant.map((feature, index) => <TableRow key={index}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell>{feature.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(feature.status)}`}>
                          {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Terminal Operator Portal Content */}
          <TabsContent value="dispatcher">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard icon={Users} title="Total Users" value={stats.dispatcher.users} />
              <StatCard icon={Activity} title="Active Users" value={stats.dispatcher.activeUsers} />
              <StatCard icon={Menu} title="Total Features" value={stats.dispatcher.features} />
              <StatCard icon={Clock} title="Avg. Usage Time" value={stats.dispatcher.averageUsageTime} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h3 className="text-lg font-semibold mb-4">Role Overview</h3>
              <p className="text-gray-600 mb-4">
                Terminal Operators manage the daily operations of bus scheduling and dispatch within the terminal. 
                They coordinate arrivals and departures, handle customer inquiries, and ensure smooth flow of traffic.
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <button className="flex items-center text-bcs-green" onClick={() => navigate('/dispatcher')}>
                  <span>View Terminal Operator Portal</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Features & Functionality</h3>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.dispatcher.map((feature, index) => <TableRow key={index}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell>{feature.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(feature.status)}`}>
                          {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* System and Analytics */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">System Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Active Users by Portal</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-bcs-green bg-bcs-green/10">
                          Cashier
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-bcs-green">
                          {Math.round(stats.cashier.activeUsers / stats.cashier.users * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-bcs-green/10">
                      <div style={{
                      width: `${stats.cashier.activeUsers / stats.cashier.users * 100}%`
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-bcs-green"></div>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          Assistant
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {Math.round(stats.assistant.activeUsers / stats.assistant.users * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div style={{
                      width: `${stats.assistant.activeUsers / stats.assistant.users * 100}%`
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                          Terminal Operator
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-amber-600">
                          {Math.round(stats.dispatcher.activeUsers / stats.dispatcher.users * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200">
                      <div style={{
                      width: `${stats.dispatcher.activeUsers / stats.dispatcher.users * 100}%`
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Feature Status Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full">
                  {/* Active Features */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        {features.cashier.filter(f => f.status === 'active').length + features.assistant.filter(f => f.status === 'active').length + features.dispatcher.filter(f => f.status === 'active').length}
                      </span>
                    </div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                  
                  {/* Maintenance Features */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-amber-600">
                        {features.cashier.filter(f => f.status === 'maintenance').length + features.assistant.filter(f => f.status === 'maintenance').length + features.dispatcher.filter(f => f.status === 'maintenance').length}
                      </span>
                    </div>
                    <span className="text-sm font-medium">Maintenance</span>
                  </div>
                  
                  {/* Development Features */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {features.cashier.filter(f => f.status === 'development').length + features.assistant.filter(f => f.status === 'development').length + features.dispatcher.filter(f => f.status === 'development').length}
                      </span>
                    </div>
                    <span className="text-sm font-medium">Development</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </AdminLayout>;
};
export default AdminDashboard;