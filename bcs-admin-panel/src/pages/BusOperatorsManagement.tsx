import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Users, Building, MapPin, Image, FileText, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import BusOperatorModal from '@/components/admin/BusOperatorModal';
import ViewOperatorDetailsModal from '@/components/admin/ViewOperatorDetailsModal';
import { UserCredential } from '../utils/auth';

interface BusOperator {
  id: string;
  name: string;
  busNumber: string;
  route: string;
  status: 'Active' | 'Inactive' | 'Pending';
  franchise: string;
  contact: string;
  email: string;
  busImage?: string;
  franchiseDocument?: string;
}

const BusOperatorsManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<BusOperator | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Fixed mock user for AdminLayout
  const mockUser: UserCredential = {
    name: 'Administrator',
    role: 'admin',
    email: 'admin@bcs.com',
    password: ''
  };

  const operators: BusOperator[] = [
    {
      id: '1',
      name: 'Grande N.',
      busNumber: 'ABC-123',
      route: 'NAGA - IRIGA',
      status: 'Active',
      franchise: 'Available',
      contact: '+63 912 345 6789',
      email: 'grande@example.com',
      busImage: '/placeholder.svg',
      franchiseDocument: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Maria K.',
      busNumber: 'DEF-456',
      route: 'NAGA - LEGAZPI',
      status: 'Active',
      franchise: 'Available',
      contact: '+63 987 654 3210',
      email: 'maria@example.com',
      busImage: '/placeholder.svg',
      franchiseDocument: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Juan S.',
      busNumber: 'GHI-789',
      route: 'NAGA - SIPOCOT',
      status: 'Pending',
      franchise: 'Pending',
      contact: '+63 998 765 4321',
      email: 'juan@example.com',
      franchiseDocument: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Charlie A.',
      busNumber: 'JKL-012',
      route: 'NAGA - IRIGA',
      status: 'Active',
      franchise: 'Available',
      contact: '+63 956 789 0123',
      email: 'charlie@example.com',
      busImage: '/placeholder.svg',
      franchiseDocument: '/placeholder.svg'
    },
    {
      id: '5',
      name: 'Alice C.',
      busNumber: 'MNO-345',
      route: 'NAGA - LEGAZPI',
      status: 'Inactive',
      franchise: 'Available',
      contact: '+63 923 456 7890',
      email: 'alice@example.com',
      franchiseDocument: '/placeholder.svg'
    }
  ];

  const stats = {
    totalOperators: operators.length,
    activeOperators: operators.filter(op => op.status === 'Active').length,
    pendingOperators: operators.filter(op => op.status === 'Pending').length
  };

  const filteredOperators = operators.filter(operator =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOperator = () => {
    setModalMode('add');
    setSelectedOperator(null);
    setShowModal(true);
  };

  const handleEditOperator = (operator: BusOperator) => {
    setModalMode('edit');
    setSelectedOperator(operator);
    setShowModal(true);
  };

  const handleViewDetails = (operator: BusOperator) => {
    setSelectedOperator(operator);
    setShowDetailsModal(true);
  };

  const handleDeleteOperator = (operator: BusOperator) => {
    toast({
      title: "Operator Deleted",
      description: `${operator.name} has been removed from the system.`,
    });
  };

  const handleSaveOperator = (operatorData: any) => {
    if (modalMode === 'add') {
      toast({
        title: "Operator Added",
        description: "New bus operator has been successfully added.",
      });
    } else {
      toast({
        title: "Operator Updated",
        description: "Bus operator information has been updated.",
      });
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Available</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewFranchise = (operator: BusOperator) => {
    setSelectedOperator(operator);
    setShowFranchiseModal(true);
  };

  const getFranchiseDisplay = (operator: BusOperator) => {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewFranchise(operator)}
        className="border-blue-300 text-blue-600 hover:bg-blue-50"
      >
        <FileText className="h-4 w-4 mr-1" />
        View Franchise
      </Button>
    );
  };

  return (
    <AdminLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bus Operators Management</h1>
            <p className="text-gray-500 mt-1">Manage and monitor all bus operators</p>
          </div>
          
          <Button 
            onClick={handleAddOperator}
            className="mt-4 md:mt-0 bg-bcs-green hover:bg-bcs-green/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Operator
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Total Bus Operators</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalOperators}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.activeOperators}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                  <Building className="h-6 w-6 text-bcs-green" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingOperators}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by operator name, plate number, or route" 
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-bcs-green" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operators Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bus List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Bus Image</TableHead>
                  <TableHead>Operator Name</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Franchise</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperators.map((operator) => (
                  <TableRow key={operator.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="h-12 w-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {operator.busImage ? (
                          <img 
                            src={operator.busImage} 
                            alt="Bus" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Image className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{operator.name}</TableCell>
                    <TableCell className="font-mono">{operator.busNumber}</TableCell>
                    <TableCell>{operator.route}</TableCell>
                    <TableCell>{getStatusBadge(operator.status)}</TableCell>
                    <TableCell>{getFranchiseDisplay(operator)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(operator)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditOperator(operator)}
                          className="border-green-300 text-bcs-green hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteOperator(operator)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modals */}
        <BusOperatorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveOperator}
          operator={selectedOperator}
          mode={modalMode}
        />

        <ViewOperatorDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          operator={selectedOperator}
        />

        {/* Franchise Document Modal - View Only */}
        <Dialog open={showFranchiseModal} onOpenChange={setShowFranchiseModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Franchise Document - {selectedOperator?.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Document Image */}
              <div className="flex justify-center">
                <div className="max-w-2xl w-full">
                  {selectedOperator?.franchiseDocument ? (
                    <img 
                      src={selectedOperator.franchiseDocument} 
                      alt="Franchise Document" 
                      className="w-full h-auto border rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No franchise document available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setShowFranchiseModal(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BusOperatorsManagement;
