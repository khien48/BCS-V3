import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Building2, User, MapPin, DollarSign, Bus, Phone, Mail, Calendar, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegisteredBus {
  id: string;
  plateNumber: string;
  busName: string;
  route: string;
  operatorType: 'Company' | 'Independent';
  operatorName: string;
  capacity: number;
  status: 'Active' | 'Maintenance' | 'Inactive';
  registrationDate: string;
  expiryDate: string;
  contactNumber: string;
  franchiseNumber: string;
}

interface FareMatrix {
  id: string;
  route: string;
  origin: string;
  destination: string;
  distance: number;
  regularFare: number;
  studentFare: number;
  seniorFare: number;
  discountedFare: number;
  lastUpdated: string;
}

interface BusOperator {
  id: string;
  name: string;
  type: 'Company' | 'Independent';
  contactPerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  totalBuses: number;
  activeBuses: number;
  licenseNumber: string;
  registrationDate: string;
  status: 'Active' | 'Suspended' | 'Pending';
}

const DispatcherInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [operatorTypeFilter, setOperatorTypeFilter] = useState('all');

  // Mock data for registered buses
  const registeredBuses: RegisteredBus[] = [
    {
      id: '1',
      plateNumber: 'ABC-1234',
      busName: 'Bicol Express 01',
      route: 'Naga - Legazpi',
      operatorType: 'Company',
      operatorName: 'Bicol Transport Corp',
      capacity: 45,
      status: 'Active',
      registrationDate: '2023-01-15',
      expiryDate: '2024-01-15',
      contactNumber: '09171234567',
      franchiseNumber: 'FR-2023-001'
    },
    {
      id: '2',
      plateNumber: 'DEF-5678',
      busName: 'Albay Liner 02',
      route: 'Legazpi - Tabaco',
      operatorType: 'Independent',
      operatorName: 'Juan Dela Cruz',
      capacity: 30,
      status: 'Active',
      registrationDate: '2023-02-20',
      expiryDate: '2024-02-20',
      contactNumber: '09189876543',
      franchiseNumber: 'FR-2023-002'
    },
    {
      id: '3',
      plateNumber: 'GHI-9012',
      busName: 'Camarines Express',
      route: 'Naga - Iriga',
      operatorType: 'Company',
      operatorName: 'Camarines Transit Inc',
      capacity: 52,
      status: 'Maintenance',
      registrationDate: '2023-03-10',
      expiryDate: '2024-03-10',
      contactNumber: '09123456789',
      franchiseNumber: 'FR-2023-003'
    }
  ];

  // Mock data for fare matrix
  const fareMatrix: FareMatrix[] = [
    {
      id: '1',
      route: 'Naga - Legazpi',
      origin: 'Naga City',
      destination: 'Legazpi City',
      distance: 45,
      regularFare: 85,
      studentFare: 68,
      seniorFare: 68,
      discountedFare: 68,
      lastUpdated: '2024-01-01'
    },
    {
      id: '2',
      route: 'Legazpi - Tabaco',
      origin: 'Legazpi City',
      destination: 'Tabaco City',
      distance: 25,
      regularFare: 45,
      studentFare: 36,
      seniorFare: 36,
      discountedFare: 36,
      lastUpdated: '2024-01-01'
    },
    {
      id: '3',
      route: 'Naga - Iriga',
      origin: 'Naga City',
      destination: 'Iriga City',
      distance: 35,
      regularFare: 65,
      studentFare: 52,
      seniorFare: 52,
      discountedFare: 52,
      lastUpdated: '2024-01-01'
    },
    {
      id: '4',
      route: 'Naga - Pili',
      origin: 'Naga City',
      destination: 'Pili',
      distance: 15,
      regularFare: 25,
      studentFare: 20,
      seniorFare: 20,
      discountedFare: 20,
      lastUpdated: '2024-01-01'
    }
  ];

  // Mock data for bus operators
  const busOperators: BusOperator[] = [
    {
      id: '1',
      name: 'Bicol Transport Corporation',
      type: 'Company',
      contactPerson: 'Maria Santos',
      phoneNumber: '09171234567',
      email: 'info@bicoltransport.com',
      address: 'Magsaysay Ave, Naga City',
      totalBuses: 25,
      activeBuses: 23,
      licenseNumber: 'LTO-2023-001',
      registrationDate: '2020-05-15',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Juan Dela Cruz',
      type: 'Independent',
      contactPerson: 'Juan Dela Cruz',
      phoneNumber: '09189876543',
      email: 'juan.delacruz@email.com',
      address: 'Rizal St, Legazpi City',
      totalBuses: 1,
      activeBuses: 1,
      licenseNumber: 'LTO-2023-002',
      registrationDate: '2021-03-20',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Camarines Transit Inc',
      type: 'Company',
      contactPerson: 'Roberto Garcia',
      phoneNumber: '09123456789',
      email: 'admin@camarinestransit.com',
      address: 'Gen Luna St, Iriga City',
      totalBuses: 15,
      activeBuses: 14,
      licenseNumber: 'LTO-2023-003',
      registrationDate: '2019-08-10',
      status: 'Active'
    }
  ];

  const filteredBuses = registeredBuses.filter(bus => {
    const matchesSearch = bus.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bus.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bus.status === statusFilter;
    const matchesOperatorType = operatorTypeFilter === 'all' || bus.operatorType === operatorTypeFilter;
    
    return matchesSearch && matchesStatus && matchesOperatorType;
  });

  const filteredFares = fareMatrix.filter(fare =>
    fare.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fare.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fare.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOperators = busOperators.filter(operator =>
    operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transport Inventory</h1>
          <p className="text-muted-foreground">
            Manage buses, fare matrix, and operators in the Bicol region
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search buses, operators, routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operator Type</Label>
              <Select value={operatorTypeFilter} onValueChange={setOperatorTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="Independent">Independent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setOperatorTypeFilter('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="buses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buses" className="flex items-center gap-2">
            <Bus className="w-4 h-4" />
            Registered Buses ({filteredBuses.length})
          </TabsTrigger>
          <TabsTrigger value="fares" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Fare Matrix ({filteredFares.length})
          </TabsTrigger>
          <TabsTrigger value="operators" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Bus Operators ({filteredOperators.length})
          </TabsTrigger>
        </TabsList>

        {/* Registered Buses Tab */}
        <TabsContent value="buses">
          <Card>
            <CardHeader>
              <CardTitle>Registered Buses</CardTitle>
              <CardDescription>
                Complete list of all registered buses in the Bicol region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plate Number</TableHead>
                      <TableHead>Bus Name</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuses.map((bus) => (
                      <TableRow key={bus.id}>
                        <TableCell className="font-medium">{bus.plateNumber}</TableCell>
                        <TableCell>{bus.busName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {bus.route}
                          </div>
                        </TableCell>
                        <TableCell>{bus.operatorName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {bus.operatorType === 'Company' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {bus.operatorType}
                          </Badge>
                        </TableCell>
                        <TableCell>{bus.capacity} pax</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(bus.status)}>
                            {bus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {bus.contactNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {bus.expiryDate}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fare Matrix Tab */}
        <TabsContent value="fares">
          <Card>
            <CardHeader>
              <CardTitle>Fare Matrix - Bicol Region</CardTitle>
              <CardDescription>
                Official fare rates for local routes within the Bicol region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Distance (km)</TableHead>
                      <TableHead>Regular Fare</TableHead>
                      <TableHead>Student Fare</TableHead>
                      <TableHead>Senior/PWD Fare</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFares.map((fare) => (
                      <TableRow key={fare.id}>
                        <TableCell className="font-medium">{fare.route}</TableCell>
                        <TableCell>{fare.origin}</TableCell>
                        <TableCell>{fare.destination}</TableCell>
                        <TableCell>{fare.distance} km</TableCell>
                        <TableCell className="font-medium">₱{fare.regularFare}.00</TableCell>
                        <TableCell className="text-blue-600">₱{fare.studentFare}.00</TableCell>
                        <TableCell className="text-green-600">₱{fare.seniorFare}.00</TableCell>
                        <TableCell>{fare.lastUpdated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bus Operators Tab */}
        <TabsContent value="operators">
          <Card>
            <CardHeader>
              <CardTitle>Bus Operators</CardTitle>
              <CardDescription>
                Registered bus operators and transport companies in the Bicol region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operator Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Fleet Size</TableHead>
                      <TableHead>Active Buses</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperators.map((operator) => (
                      <TableRow key={operator.id}>
                        <TableCell className="font-medium">{operator.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {operator.type === 'Company' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {operator.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{operator.contactPerson}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {operator.phoneNumber}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="w-3 h-3" />
                              {operator.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{operator.totalBuses}</TableCell>
                        <TableCell className="text-green-600 font-medium">{operator.activeBuses}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {operator.licenseNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(operator.status)}>
                            {operator.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DispatcherInventory;