
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, X, CreditCard, Eye, CalendarDays, FileSearch, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SleepBusDetails from '@/components/SleepBusDetails';
import CashierLayout from '@/components/layouts/CashierLayout';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import DateRangeFilter from '@/components/DateRangeFilter';
import FilterPanel from '@/components/FilterPanel';
import { FilterValues } from '@/components/FilterPanel';
import { exportToCSV } from '@/utils/exportUtils';

// Updated interface to match the actual database schema
interface BusData {
  bus_id: string;
  bus_name: string;
  plate_number: string;
  route: string;
  daily_fee: number;
  days_parked?: number;
  total_fee?: number;
  date_time_parked: string;
  recorded_by?: string;
  last_updated?: string;
  payment_status?: string;
}

const CashierDashboard = ({ user }: { user: any }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    busType: '',
    route: '',
    days: '',
  });

  // Fetch sleep buses data
  const { data: busData = [], isLoading } = useQuery({
    queryKey: ['allSleepBuses', currentPage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_buses')
        .select('*')
        .order('date_time_parked', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) {
        console.error('Error fetching sleep buses:', error);
        toast({
          title: 'Error fetching data',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }

      // Add mock payment_status for UI purposes
      const enhancedData = data?.map((bus, index) => ({
        ...bus,
        payment_status: index % 3 === 0 ? 'PAID' : 'UNPAID'
      }));
      
      return enhancedData || [];
    },
  });

  // Fetch total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['sleepBusesCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('sleep_buses')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching count:', error);
        return 0;
      }

      return count || 0;
    },
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const applyFilters = (buses: BusData[]) => {
    return buses.filter(bus => {
      // Apply search filter
      if (searchTerm && 
         !(bus.bus_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           bus.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           bus.route?.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Apply bus type filter
      if (activeFilters.busType && bus.bus_name !== activeFilters.busType) {
        return false;
      }
      
      // Apply route filter
      if (activeFilters.route && bus.route !== activeFilters.route) {
        return false;
      }
      
      // Apply days filter
      if (activeFilters.days) {
        const days = bus.days_parked || 1;
        if (activeFilters.days === '1' && days !== 1) return false;
        if (activeFilters.days === '2' && days !== 2) return false;
        if (activeFilters.days === '3+' && days < 3) return false;
      }
      
      // Apply date range filter
      if (dateRange.from || dateRange.to) {
        const busDate = new Date(bus.date_time_parked);
        if (dateRange.from && busDate < dateRange.from) return false;
        if (dateRange.to) {
          // Set to end of day for the "to" date
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          if (busDate > endDate) return false;
        }
      }
      
      return true;
    });
  };

  // Filter buses based on filters
  const filteredBuses = applyFilters(busData);

  // Stats calculation
  const stats = {
    totalBuses: totalCount,
    paidBuses: Math.floor(totalCount / 3), // Mock data: assuming 1/3 are paid
  };

  useEffect(() => {
    // Redirect to login if no user or not a cashier
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'cashier') {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);
  
  const handleViewDetails = (bus: BusData) => {
    setSelectedBus(bus);
    setShowDetails(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast({
        title: "Search Results",
        description: `Found ${filteredBuses.length} buses matching "${searchTerm}"`,
      });
    }
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filter application
  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    
    // Show a toast with the applied filters
    const appliedFilters = [];
    if (filters.busType) appliedFilters.push(`Bus Type: ${filters.busType}`);
    if (filters.route) appliedFilters.push(`Route: ${filters.route}`);
    if (filters.days) appliedFilters.push(`Days: ${filters.days}`);
    
    toast({
      title: "Filters Applied",
      description: appliedFilters.length ? appliedFilters.join(', ') : "All filters cleared"
    });
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setActiveFilters({
      busType: '',
      route: '',
      days: '',
    });
    setDateRange({
      from: undefined,
      to: undefined,
    });
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared"
    });
  };

  // Handle date range change
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    
    if (range.from) {
      const description = range.to 
        ? `${format(range.from, 'MMM dd, yyyy')} to ${format(range.to, 'MMM dd, yyyy')}` 
        : `From ${format(range.from, 'MMM dd, yyyy')}`;
        
      toast({
        title: "Date Range Applied",
        description
      });
    }
  };

  // Export data to CSV
  const handleExportData = () => {
    exportToCSV(filteredBuses, {
      fileName: 'sleep_buses_report',
      dateRange: {
        from: dateRange.from,
        to: dateRange.to
      }
    });
    
    toast({
      title: "Export Successful",
      description: "Data has been exported to CSV format"
    });
  };

  const handleBusDeleted = () => {
    // Refetch the data after deletion
    queryClient.invalidateQueries({ queryKey: ['allSleepBuses'] });
    queryClient.invalidateQueries({ queryKey: ['sleepBusesCount'] });
  };

  const handleBusUpdated = (updatedBus: BusData) => {
    // Update the local state with the new bus data
    const updatedBuses = busData.map(bus => 
      bus.bus_id === updatedBus.bus_id ? updatedBus : bus
    );
    queryClient.setQueryData(['allSleepBuses', currentPage], updatedBuses);
  };

  // If no user, show loading or redirect
  if (!user) {
    return null;
  }
  
  return (
    <CashierLayout user={user}>
      <div className="space-y-6">
        {/* Header and Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sleep Bus Management</h1>
              <p className="text-gray-500 mt-1">Monitor and manage all parked buses</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-3">
              <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
              
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-600"
                onClick={handleExportData}
              >
                <FileSearch size={16} className="mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Buses</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalBuses}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Bus className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">₱{stats.totalBuses * 30}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-bcs-green" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Longest Stay</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">
                    {busData.length > 0 ? 
                      Math.max(...busData.map(bus => bus.days_parked || 1)) : 0} days
                  </h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Search by bus name, plate number, or route" 
                  className="pl-12 pr-10 py-3 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-bcs-green" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                {searchTerm && 
                  <button 
                    type="button" 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                }
              </form>
            </div>
            
            <Button 
              onClick={toggleFilters} 
              className="bg-bcs-green hover:bg-bcs-green/90 text-white rounded-lg gap-2 px-6"
            >
              <Filter size={18} />
              Filter
            </Button>
          </div>
          
          {/* Filter Component */}
          <FilterPanel 
            isVisible={showFilters} 
            onClose={toggleFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Sleep Bus List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle>Sleep Bus List</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Bus</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Days Parked</TableHead>
                    <TableHead>Date Parked</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bcs-green"></div>
                          <p className="mt-2 text-gray-500">Loading bus data...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredBuses.length > 0 ? (
                    filteredBuses.map((bus) => (
                      <TableRow key={bus.bus_id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 font-medium">
                            {bus.plate_number}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-800">{bus.bus_name}</TableCell>
                        <TableCell>{bus.route}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Badge variant="outline" className={`
                              ${bus.days_parked && bus.days_parked > 2 ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-green-500 text-green-700 bg-green-50'}
                            `}>
                              {bus.days_parked || 1} {(bus.days_parked || 1) === 1 ? 'day' : 'days'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {format(new Date(bus.date_time_parked), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-bcs-green font-medium">₱{bus.total_fee || bus.daily_fee}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            className="border-bcs-green text-bcs-green hover:bg-bcs-green/10 gap-1"
                            onClick={() => handleViewDetails(bus)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <FileSearch className="h-12 w-12 text-gray-300 mb-2" />
                          <h3 className="text-gray-500 font-medium">No buses found matching your search</h3>
                          <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filteredBuses.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                  <span className="text-sm text-gray-500 mb-3 sm:mb-0">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} - {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} buses
                  </span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button 
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            className={
                              currentPage === pageNum ? 
                              "bg-bcs-green hover:bg-bcs-green/90 h-9 w-9" : 
                              "h-9 w-9"
                            }
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="px-2">...</span>
                          <Button 
                            variant="outline"
                            className="h-9 w-9"
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Details Popup */}
        {showDetails && selectedBus && (
          <SleepBusDetails 
            bus={selectedBus} 
            onClose={handleCloseDetails} 
            onBusDeleted={handleBusDeleted}
            onBusUpdated={handleBusUpdated}
          />
        )}
      </div>
    </CashierLayout>
  );
};

export default CashierDashboard;
