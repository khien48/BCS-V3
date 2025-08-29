
import React, { useState } from 'react';
import { Edit, Save, X, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { UserCredential } from '../utils/auth';
import { cn } from '@/lib/utils';

interface FareRoute {
  id: string;
  route: string;
  currentFare: number;
  isEditing?: boolean;
}

const BusFareMatrix = () => {
  const { toast } = useToast();
  const [selectedRoute, setSelectedRoute] = useState('');
  const [open, setOpen] = useState(false);
  const [editingFares, setEditingFares] = useState<{ [key: string]: number }>({});
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);

  // Mock user for AdminLayout
  const mockUser: UserCredential = {
    name: 'Administrator',
    role: 'admin',
    email: 'admin@bcs.com',
    password: ''
  };

  const [fareRoutes, setFareRoutes] = useState<FareRoute[]>([
    { id: '1', route: 'NAGA CITY TO Ragay City', currentFare: 105.00 },
    { id: '2', route: 'NAGA CITY TO Ragay City', currentFare: 105.00 },
    { id: '3', route: 'NAGA CITY TO Bulusan City', currentFare: 240.00 },
    { id: '4', route: 'NAGA CITY TO Sorsogon City', currentFare: 230.00 },
    { id: '5', route: 'NAGA CITY TO Sipocot', currentFare: 75.00 },
    { id: '6', route: 'NAGA CITY TO NABUA', currentFare: 110.00 },
    { id: '7', route: 'NAGA CITY TO GUBANGBANG', currentFare: 250.00 },
    { id: '8', route: 'NAGA CITY TO PILI', currentFare: 60.00 },
    { id: '9', route: 'NAGA CITY TO CAMALIGAN', currentFare: 30.00 },
    { id: '10', route: 'NAGA CITY TO BOMBON', currentFare: 40.00 },
    { id: '11', route: 'NAGA CITY TO PASACAO', currentFare: 65.00 },
    { id: '12', route: 'NAGA CITY TO PRESENTACION', currentFare: 160.00 },
    { id: '13', route: 'NAGA CITY TO LIBMANAN', currentFare: 80.00 },
    { id: '14', route: 'NAGA CITY TO GOJANG', currentFare: 70.00 }
  ]);

  const routes = [
    'NAGA - IRIGA',
    'NAGA - LEGAZPI', 
    'NAGA - SIPOCOT'
  ];

  const handleEditFare = (fareId: string) => {
    setFareRoutes(prev => prev.map(fare => 
      fare.id === fareId ? { ...fare, isEditing: true } : fare
    ));
    const currentFare = fareRoutes.find(f => f.id === fareId);
    if (currentFare) {
      setEditingFares(prev => ({ ...prev, [fareId]: currentFare.currentFare }));
    }
  };

  const handleConfirmEdit = (fareId: string) => {
    setPendingEditId(fareId);
  };

  const handleSaveFare = () => {
    if (pendingEditId) {
      const newFare = editingFares[pendingEditId];
      if (newFare !== undefined) {
        setFareRoutes(prev => prev.map(fare => 
          fare.id === pendingEditId ? { ...fare, currentFare: newFare, isEditing: false } : fare
        ));
        setEditingFares(prev => {
          const updated = { ...prev };
          delete updated[pendingEditId];
          return updated;
        });
        toast({
          title: "Fare Updated",
          description: `Fare has been successfully updated to ₱${newFare.toFixed(2)}.`,
        });
      }
      setPendingEditId(null);
    }
  };

  const handleCancelEdit = (fareId: string) => {
    setFareRoutes(prev => prev.map(fare => 
      fare.id === fareId ? { ...fare, isEditing: false } : fare
    ));
    setEditingFares(prev => {
      const updated = { ...prev };
      delete updated[fareId];
      return updated;
    });
  };

  const handleFareChange = (fareId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditingFares(prev => ({ ...prev, [fareId]: numValue }));
  };

  const filteredFares = selectedRoute 
    ? fareRoutes.filter(fare => fare.route.includes(selectedRoute.split(' - ')[1]))
    : fareRoutes;

  return (
    <AdminLayout user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bus Route Fare Management</h1>
            <p className="text-gray-500 mt-1">Manage bus fare rates for different routes</p>
          </div>
        </div>

        {/* Edit Bus Route Fare Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bcs-green">Edit Bus Route Fare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bus Route
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full md:w-64 justify-between"
                    >
                      {selectedRoute
                        ? routes.find((route) => route === selectedRoute)
                        : "Select Route..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Command>
                      <CommandInput placeholder="Search route..." />
                      <CommandList>
                        <CommandEmpty>No route found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              setSelectedRoute('');
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedRoute === '' ? "opacity-100" : "opacity-0"
                              )}
                            />
                            All Routes
                          </CommandItem>
                          {routes.map((route) => (
                            <CommandItem
                              key={route}
                              onSelect={() => {
                                setSelectedRoute(route);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedRoute === route ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {route}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fare Matrix Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bicol Bus Route Management Fare</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Edit Bus Route Fare</TableHead>
                  <TableHead>Current Fare</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFares.map((fare) => (
                  <TableRow key={fare.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {fare.route}
                    </TableCell>
                    <TableCell>
                      {fare.isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editingFares[fare.id] || ''}
                          onChange={(e) => handleFareChange(fare.id, e.target.value)}
                          className="w-32"
                          placeholder="0.00"
                        />
                      ) : (
                        <span className="font-semibold text-bcs-green">
                          ₱{fare.currentFare.toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {fare.isEditing ? (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConfirmEdit(fare.id)}
                                  className="border-green-300 text-green-600 hover:bg-green-50"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm Fare Update</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to update the fare for "{fare.route}" to ₱{editingFares[fare.id]?.toFixed(2) || '0.00'}? This action will affect all future bookings for this route.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setPendingEditId(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleSaveFare}>
                                    Yes, Update Fare
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelEdit(fare.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFare(fare.id)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BusFareMatrix;
