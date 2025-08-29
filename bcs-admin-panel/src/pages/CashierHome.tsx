import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, CreditCard, X, Bus, Calendar, Clock, FileSearch, CalendarDays, ChevronDown, RefreshCw, DollarSign, Users, TrendingUp, History, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CashierLayout from '@/components/layouts/CashierLayout';
import { useToast } from '@/hooks/use-toast';
import SleepBusDetails from '@/components/SleepBusDetails';
import { supabase, generateUUID } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isValid, parseISO } from 'date-fns';
import PaymentConfirmationDialog from '@/components/PaymentConfirmationDialog';
import TenantPaymentConfirmationDialog from '@/components/TenantPaymentConfirmationDialog';
import { Badge } from "@/components/ui/badge";
import DateRangeFilter from '@/components/DateRangeFilter';
import FilterPanel from '@/components/FilterPanel';
import { FilterValues } from '@/components/FilterPanel';
import { exportToCSV, BusDataRow } from '@/utils/exportUtils';
import { SleepBus } from '@/types/schedule';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Checkbox } from "@/components/ui/checkbox";
const CashierHome = ({
  user
}: {
  user: any;
}) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showTenantPaymentDialog, setShowTenantPaymentDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<SleepBus | null>(null);
  const [tableView, setTableView] = useState<'Sleep Bus' | 'Tenant'>('Sleep Bus');
  const queryClient = useQueryClient();

  // Form state
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionType, setTransactionType] = useState('Sleep Bus');
  const [paymentType, setPaymentType] = useState('Cash');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Tenant bills state
  const [tenantBills, setTenantBills] = useState<any[]>([]);
  const [tenantPaymentHistory, setTenantPaymentHistory] = useState<any[]>([]);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [amountPaid, setAmountPaid] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);

  // Calculate change amount whenever amount paid or selected bills change
  useEffect(() => {
    if (amountPaid && selectedBills.length > 0) {
      const totalBills = selectedBills.reduce((total, billId) => {
        const bill = tenantBills.find(b => b.id === billId);
        return total + (bill ? Number(bill.amount) : 0);
      }, 0);
      const paid = Number(amountPaid);
      setChangeAmount(paid > totalBills ? paid - totalBills : 0);
    } else {
      setChangeAmount(0);
    }
  }, [amountPaid, selectedBills, tenantBills]);

  // Update current date/time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Use tanstack query with enabled option to control refetching
  const {
    data: busData = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['sleepBuses'],
    queryFn: async () => {
      console.log('Fetching sleep buses data...');
      const {
        data,
        error
      } = await supabase.from('sleep_buses').select('*').order('date_time_parked', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching sleep buses:', error);
        toast({
          title: 'Error fetching data',
          description: error.message,
          variant: 'destructive'
        });
        return [];
      }
      console.log('Sleep buses data:', data);

      // Add mock payment_status for UI purposes
      const enhancedData = data?.map((bus: any) => ({
        ...bus,
        payment_status: 'UNPAID' // All buses in sleep_buses table are unpaid
      }));
      return enhancedData || [];
    }
  });

  // Mock tenant data with new ID format
  const tenantData = [{
    id: 1,
    tenantId: "T2025070901",
    name: "Roderick, M",
    stallNo: "201",
    status: "Active",
    paymentStatus: "Unpaid",
    amount: "₱500"
  }, {
    id: 2,
    tenantId: "T2025070902",
    name: "Naruto, B",
    stallNo: "133",
    status: "Active",
    paymentStatus: "Unpaid",
    amount: "₱500"
  }, {
    id: 3,
    tenantId: "T2025070903",
    name: "Kangkong, M",
    stallNo: "002",
    status: "Active",
    paymentStatus: "Unpaid",
    amount: "₱500"
  }, {
    id: 4,
    tenantId: "T2025070904",
    name: "Xhunter, B",
    stallNo: "423",
    status: "Active",
    paymentStatus: "Unpaid",
    amount: "₱500"
  }, {
    id: 5,
    tenantId: "T2025070905",
    name: "Jean, K",
    stallNo: "643",
    status: "Active",
    paymentStatus: "Unpaid",
    amount: "₱500"
  }];

  // Force a refetch when the component mounts to get the latest data
  useEffect(() => {
    refetch();

    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [refetch]);
  // Filter data based on search term and current table view
  const filteredBusData = busData.filter(bus => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return bus.plate_number.toLowerCase().includes(searchLower) || bus.bus_name.toLowerCase().includes(searchLower) || bus.route.toLowerCase().includes(searchLower);
  });
  const filteredTenantData = tenantData.filter(tenant => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return tenant.tenantId.toLowerCase().includes(searchLower) || tenant.name.toLowerCase().includes(searchLower) || tenant.stallNo.toLowerCase().includes(searchLower);
  });
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically through filtering
  };
  // Sample tenant bills data
  const sampleTenantBills = {
    'T2025070901': [{
      id: 'bill-1',
      tenant_id: 'T2025070901',
      bill_type: 'monthly_due',
      amount: 500.00,
      due_date: '2025-07-15',
      status: 'unpaid'
    }, {
      id: 'bill-2',
      tenant_id: 'T2025070901',
      bill_type: 'electricity',
      amount: 120.50,
      due_date: '2025-07-20',
      status: 'unpaid'
    }],
    'T2025070902': [{
      id: 'bill-4',
      tenant_id: 'T2025070902',
      bill_type: 'monthly_due',
      amount: 500.00,
      due_date: '2025-07-15',
      status: 'unpaid'
    }, {
      id: 'bill-5',
      tenant_id: 'T2025070902',
      bill_type: 'electricity',
      amount: 95.25,
      due_date: '2025-07-18',
      status: 'unpaid'
    }],
    'T2025070903': [{
      id: 'bill-6',
      tenant_id: 'T2025070903',
      bill_type: 'monthly_due',
      amount: 500.00,
      due_date: '2025-07-15',
      status: 'overdue'
    }, {
      id: 'bill-7',
      tenant_id: 'T2025070903',
      bill_type: 'electricity',
      amount: 180.75,
      due_date: '2025-07-10',
      status: 'overdue'
    }],
    'T2025070904': [{
      id: 'bill-8',
      tenant_id: 'T2025070904',
      bill_type: 'monthly_due',
      amount: 500.00,
      due_date: '2025-07-15',
      status: 'unpaid'
    }, {
      id: 'bill-9',
      tenant_id: 'T2025070904',
      bill_type: 'electricity',
      amount: 85.00,
      due_date: '2025-07-20',
      status: 'unpaid'
    }],
    'T2025070905': [{
      id: 'bill-10',
      tenant_id: 'T2025070905',
      bill_type: 'monthly_due',
      amount: 500.00,
      due_date: '2025-07-15',
      status: 'unpaid'
    }, {
      id: 'bill-11',
      tenant_id: 'T2025070905',
      bill_type: 'electricity',
      amount: 110.25,
      due_date: '2025-07-18',
      status: 'unpaid'
    }]
  };

  // Sample payment history data
  const samplePaymentHistory = {
    'T2025070901': [{
      id: 'pay-1',
      tenant_id: 'T2025070901',
      amount_paid: 500.00,
      payment_method: 'cash',
      payment_date: '2025-06-15',
      bill_type: 'monthly_due'
    }, {
      id: 'pay-2',
      tenant_id: 'T2025070901',
      amount_paid: 115.00,
      payment_method: 'bank',
      payment_date: '2025-06-20',
      bill_type: 'electricity'
    }],
    'T2025070902': [{
      id: 'pay-3',
      tenant_id: 'T2025070902',
      amount_paid: 500.00,
      payment_method: 'cash',
      payment_date: '2025-06-15',
      bill_type: 'monthly_due'
    }, {
      id: 'pay-4',
      tenant_id: 'T2025070902',
      amount_paid: 95.25,
      payment_method: 'wireless',
      payment_date: '2025-06-18',
      bill_type: 'electricity'
    }],
    'T2025070903': [{
      id: 'pay-5',
      tenant_id: 'T2025070903',
      amount_paid: 500.00,
      payment_method: 'card',
      payment_date: '2025-05-15',
      bill_type: 'monthly_due'
    }, {
      id: 'pay-6',
      tenant_id: 'T2025070903',
      amount_paid: 180.75,
      payment_method: 'cash',
      payment_date: '2025-05-20',
      bill_type: 'electricity'
    }],
    'T2025070904': [{
      id: 'pay-7',
      tenant_id: 'T2025070904',
      amount_paid: 500.00,
      payment_method: 'cash',
      payment_date: '2025-06-15',
      bill_type: 'monthly_due'
    }, {
      id: 'pay-8',
      tenant_id: 'T2025070904',
      amount_paid: 85.00,
      payment_method: 'bank',
      payment_date: '2025-06-20',
      bill_type: 'electricity'
    }],
    'T2025070905': [{
      id: 'pay-9',
      tenant_id: 'T2025070905',
      amount_paid: 500.00,
      payment_method: 'bank',
      payment_date: '2025-06-15',
      bill_type: 'monthly_due'
    }, {
      id: 'pay-10',
      tenant_id: 'T2025070905',
      amount_paid: 110.25,
      payment_method: 'cash',
      payment_date: '2025-06-18',
      bill_type: 'electricity'
    }]
  };

  // Fetch tenant bills when account ID is entered
  const fetchTenantBills = async (tenantId: string) => {
    try {
      // Try to get from database first
      const {
        data: bills,
        error
      } = await supabase.from('tenant_bills').select('*').eq('tenant_id', tenantId).eq('status', 'unpaid');

      // If database fetch fails or returns no data, use sample data
      const billsData = bills && bills.length > 0 ? bills : sampleTenantBills[tenantId as keyof typeof sampleTenantBills] || [];
      setTenantBills(billsData);

      // Try to fetch payment history from database
      const {
        data: history,
        error: historyError
      } = await supabase.from('payment_history').select('*').eq('tenant_id', tenantId).order('payment_date', {
        ascending: false
      });

      // If database fetch fails or returns no data, use sample data
      const historyData = history && history.length > 0 ? history : samplePaymentHistory[tenantId as keyof typeof samplePaymentHistory] || [];
      setTenantPaymentHistory(historyData);
      return billsData;
    } catch (error: any) {
      console.error('Error fetching tenant bills, using sample data:', error);
      // Fallback to sample data
      const billsData = sampleTenantBills[tenantId as keyof typeof sampleTenantBills] || [];
      const historyData = samplePaymentHistory[tenantId as keyof typeof samplePaymentHistory] || [];
      setTenantBills(billsData);
      setTenantPaymentHistory(historyData);
      return billsData;
    }
  };
  const handleAccountNumberSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) return;

    // Smart search: try both sleep bus (plate number) and tenant (tenant ID) regardless of toggle

    // First try to find in sleep bus data by plate number
    const foundBus = busData.find(bus => bus.plate_number.toLowerCase().includes(accountNumber.toLowerCase()));
    if (foundBus) {
      setSelectedTransaction(foundBus);
      setTenantBills([]);
      setTenantPaymentHistory([]);
      toast({
        title: "Transaction Found",
        description: `Sleep bus ${foundBus.plate_number} selected`
      });
      return;
    }

    // If not found in sleep bus data, try tenant data by tenant ID
    const foundTenant = tenantData.find(tenant => tenant.tenantId.toLowerCase().includes(accountNumber.toLowerCase()));
    if (foundTenant) {
      setSelectedTransaction(foundTenant);
      // Fetch tenant bills and payment history
      await fetchTenantBills(foundTenant.tenantId);
      toast({
        title: "Transaction Found",
        description: `Tenant ${foundTenant.name} (ID: ${foundTenant.tenantId}) selected`
      });
      return;
    }

    // If neither found, show error message
    toast({
      title: "No Match Found",
      description: `No transaction found for "${accountNumber}". Try entering a plate number or tenant ID.`,
      variant: "destructive"
    });
  };
  const handleRowClick = (item: any) => {
    setSelectedTransaction(item);
  };
  const handleMarkAsPaid = () => {
    if (!selectedTransaction) return;
    if (transactionType === 'Tenant') {
      setShowTenantPaymentDialog(true);
    } else {
      setShowPaymentDialog(true);
    }
  };
  const handlePaymentConfirmed = async (receiptNumber: string) => {
    if (!selectedTransaction || !user) return;
    try {
      console.log("Processing payment for:", selectedTransaction);
      toast({
        title: "Payment Successful",
        description: `Transaction has been marked as paid with receipt number ${receiptNumber}.`
      });
      setShowPaymentDialog(false);
      setSelectedTransaction(null);
      refetch();
    } catch (error: any) {
      console.error("Error marking as paid:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred while processing payment",
        variant: "destructive"
      });
    }
  };
  const handleTenantPaymentConfirmed = async (receiptNumber: string) => {
    if (!selectedTransaction || !user || selectedBills.length === 0) return;
    try {
      console.log("Processing tenant payment for:", selectedTransaction);
      toast({
        title: "Payment Successful",
        description: `Tenant payment processed with receipt number ${receiptNumber}.`
      });
      setShowTenantPaymentDialog(false);
      setSelectedTransaction(null);
      setSelectedBills([]);
      setAmountPaid('');
      // In a real app, you would also update the tenant bills status
      refetch();
    } catch (error: any) {
      console.error("Error processing tenant payment:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred while processing payment",
        variant: "destructive"
      });
    }
  };
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid Date';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid Time';
      return format(date, 'HH:mm');
    } catch (error) {
      return 'Invalid Time';
    }
  };

  // Calculate statistics
  const totalRevenue = busData.reduce((total, bus) => total + (bus.total_fee || bus.daily_fee || 0), 0);
  const totalTransactions = busData.length + tenantData.length;
  const pendingPayments = tableView === 'Sleep Bus' ? filteredBusData.length : filteredTenantData.length;

  // Mock payment history data - in a real app, this would come from the database
  const paymentHistory = [{
    id: 1,
    type: 'Sleep Bus',
    plateNumber: 'MM 1235',
    busName: 'MM BUSS',
    route: 'PILI',
    amount: 180,
    paymentMethod: 'Cash',
    receiptNumber: 'RCP-001234',
    tellerName: 'Joana B. Adore',
    paymentDate: '2025-07-08T10:30:00Z',
    days: 6
  }, {
    id: 2,
    type: 'Tenant',
    stallNumber: '201',
    tenantName: 'Roderick, M',
    businessName: 'Roderick Store',
    amount: 500,
    paymentMethod: 'Cash',
    receiptNumber: 'RCP-001235',
    tellerName: 'Joana B. Adore',
    paymentDate: '2025-07-08T09:15:00Z'
  }, {
    id: 3,
    type: 'Sleep Bus',
    plateNumber: 'ZBD 1198',
    busName: 'Philtranco',
    route: 'Matnog',
    amount: 2250,
    paymentMethod: 'Bank',
    receiptNumber: 'RCP-001236',
    tellerName: 'Joana B. Adore',
    paymentDate: '2025-07-08T08:45:00Z',
    days: 75
  }, {
    id: 4,
    type: 'Tenant',
    stallNumber: '133',
    tenantName: 'Naruto, B',
    businessName: 'Anime Merchandise',
    amount: 500,
    paymentMethod: 'Wireless',
    receiptNumber: 'RCP-001237',
    tellerName: 'Joana B. Adore',
    paymentDate: '2025-07-07T16:20:00Z'
  }, {
    id: 5,
    type: 'Sleep Bus',
    plateNumber: 'GAC 7781',
    busName: 'Penafrancia',
    route: 'Cubao',
    amount: 2250,
    paymentMethod: 'Card',
    receiptNumber: 'RCP-001238',
    tellerName: 'Joana B. Adore',
    paymentDate: '2025-07-07T14:30:00Z',
    days: 75
  }];

  // Mock data for charts
  const loyaltyCustomersData = [{
    month: 'Jan',
    value: 650
  }, {
    month: 'Feb',
    value: 720
  }, {
    month: 'Mar',
    value: 580
  }, {
    month: 'Apr',
    value: 690
  }, {
    month: 'May',
    value: 780
  }, {
    month: 'Jun',
    value: 850
  }, {
    month: 'Jul',
    value: 920
  }, {
    month: 'Aug',
    value: 760
  }, {
    month: 'Sep',
    value: 680
  }, {
    month: 'Oct',
    value: 740
  }];
  const paymentMethodsData = [{
    name: 'Cash',
    value: 45,
    color: '#10B981'
  }, {
    name: 'Bank',
    value: 25,
    color: '#3B82F6'
  }, {
    name: 'Wireless',
    value: 20,
    color: '#8B5CF6'
  }, {
    name: 'Card',
    value: 10,
    color: '#F59E0B'
  }];
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Cash':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Bank':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Wireless':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Card':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getTransactionTypeIcon = (type: string) => {
    return type === 'Sleep Bus' ? <Bus className="h-4 w-4" /> : <Users className="h-4 w-4" />;
  };
  const renderTableContent = () => {
    if (tableView === 'Sleep Bus') {
      return <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
              <TableHead className="font-semibold text-gray-700">Plate No.</TableHead>
              <TableHead className="font-semibold text-gray-700">Bus</TableHead>
              <TableHead className="font-semibold text-gray-700">Route</TableHead>
              <TableHead className="font-semibold text-gray-700">Charge</TableHead>
              <TableHead className="font-semibold text-gray-700">Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-3 border-bcs-green border-t-transparent"></div>
                    <p className="text-lg font-medium text-gray-600">Loading bus data...</p>
                  </div>
                </TableCell>
              </TableRow> : filteredBusData.length > 0 ? filteredBusData.map(bus => <TableRow key={bus.bus_id} className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 border-b border-gray-100" onClick={() => handleRowClick(bus)}>
                  <TableCell>
                    <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300 px-4 py-2 font-semibold text-sm rounded-full shadow-sm">
                      {bus.plate_number}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-800">{bus.bus_name}</TableCell>
                  <TableCell className="text-gray-600">{bus.route}</TableCell>
                  <TableCell className="text-bcs-green font-bold text-lg">₱{bus.total_fee || bus.daily_fee}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-700">{bus.days_parked || 1} {(bus.days_parked || 1) === 1 ? 'day' : 'days'}</span>
                    </div>
                  </TableCell>
                </TableRow>) : <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="bg-gray-100 rounded-full p-6">
                      <FileSearch className="h-16 w-16 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No sleep buses found</h3>
                      <p className="text-gray-500 text-base">Buses will appear here when they park overnight</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>;
    } else {
      // Tenant table
      return <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
              <TableHead className="font-semibold text-gray-700">Tenant ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Tenant Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Stall No.</TableHead>
              <TableHead className="font-semibold text-gray-700">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenantData.map(tenant => <TableRow key={tenant.id} className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100" onClick={() => handleRowClick(tenant)}>
                <TableCell>
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-violet-50 text-purple-800 border-purple-300 px-4 py-2 font-semibold text-sm rounded-full shadow-sm">
                    {tenant.tenantId}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-800">{tenant.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-300 px-4 py-2 font-semibold text-sm rounded-full shadow-sm">
                    {tenant.stallNo}
                  </Badge>
                </TableCell>
                <TableCell className="text-bcs-green font-bold text-lg">{tenant.amount}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>;
    }
  };

  // If no user, show loading or redirect
  if (!user) {
    return null;
  }
  return <CashierLayout user={user}>
      <div className="space-y-8">
        {/* Enhanced Header Section with Statistics */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Cashier Dashboard</h1>
                <p className="text-gray-600 text-lg">Monitor and process payments for tenants and parked buses</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Time</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {format(currentDateTime, 'HH:mm:ss')}
                  </p>
                </div>
                <Button onClick={() => refetch()} variant="outline" size="sm" className="border-bcs-green text-bcs-green hover:bg-bcs-green hover:text-white transition-all duration-200">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-blue-800">₱{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-200 p-3 rounded-full">
                    <DollarSign className="h-8 w-8 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Total Transactions</p>
                    <p className="text-3xl font-bold text-green-800">{totalTransactions}</p>
                  </div>
                  <div className="bg-green-200 p-3 rounded-full">
                    <TrendingUp className="h-8 w-8 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Pending Payments</p>
                    <p className="text-3xl font-bold text-orange-800">{pendingPayments}</p>
                  </div>
                  <div className="bg-orange-200 p-3 rounded-full">
                    <Clock className="h-8 w-8 text-orange-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account ID</label>
                  <form onSubmit={handleAccountNumberSearch}>
                    <Input placeholder={tableView === 'Sleep Bus' ? "Enter plate number" : "Enter tenant ID"} value={accountNumber} onChange={e => setAccountNumber(e.target.value)} onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAccountNumberSearch(e);
                    }
                  }} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-bcs-green focus:border-bcs-green transition-all duration-200" />
                  </form>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction Type</label>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-bcs-green focus:border-bcs-green transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-xl rounded-xl z-50">
                      <SelectItem value="Tenant">Tenant</SelectItem>
                      <SelectItem value="Terminal Pass">Terminal Pass</SelectItem>
                      <SelectItem value="Sleep Bus">Sleep Bus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Type</label>
                  <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-bcs-green focus:border-bcs-green transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-xl rounded-xl z-50">
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                      <SelectItem value="Wireless">Wireless</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <div className="relative">
                      <Input type="date" value={format(currentDateTime, 'yyyy-MM-dd')} onChange={e => {
                      const newDate = new Date(e.target.value + 'T' + format(currentDateTime, 'HH:mm'));
                      if (isValid(newDate)) {
                        setCurrentDateTime(newDate);
                      }
                    }} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-bcs-green focus:border-bcs-green transition-all duration-200" />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <div className="relative">
                      <Input type="time" value={format(currentDateTime, 'HH:mm')} onChange={e => {
                      const newDate = new Date(format(currentDateTime, 'yyyy-MM-dd') + 'T' + e.target.value);
                      if (isValid(newDate)) {
                        setCurrentDateTime(newDate);
                      }
                    }} className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-bcs-green focus:border-bcs-green transition-all duration-200" />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bill Details Section - Below Form */}
              {selectedTransaction && transactionType === 'Tenant' && <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Unpaid Bills */}
                      <div>
                        <h4 className="text-md font-medium text-red-600 mb-2">Unpaid Bills</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {tenantBills.filter(bill => bill.status === 'unpaid' || bill.status === 'overdue').map(bill => <div key={bill.id} className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-200">
                              <div>
                                <div className="text-sm font-medium text-gray-800 capitalize">{bill.bill_type.replace('_', ' ')}</div>
                                <div className="text-xs text-gray-500">Due: {formatDate(bill.due_date)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-red-600">₱{Number(bill.amount).toFixed(2)}</div>
                                <Badge variant="destructive" className="text-xs">{bill.status}</Badge>
                              </div>
                            </div>)}
                        </div>
                      </div>
                      
                      {/* Paid Bills */}
                      <div>
                        <h4 className="text-md font-medium text-green-600 mb-2">Recent Paid Bills</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {tenantPaymentHistory.slice(0, 5).map(payment => <div key={payment.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg border border-green-200">
                              <div>
                                <div className="text-sm font-medium text-gray-800 capitalize">{payment.bill_type.replace('_', ' ')}</div>
                                <div className="text-xs text-gray-500">{formatDate(payment.payment_date)}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-green-600">₱{Number(payment.amount_paid).toFixed(2)}</div>
                                <Badge variant="outline" className="text-xs text-green-600">{payment.payment_method}</Badge>
                              </div>
                            </div>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Outstanding Bills - Moved Below Bill Details */}
                  {tenantBills.length > 0 && <Card className="shadow-md border-2 border-border rounded-xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-muted to-accent px-4 py-3">
                        <CardTitle className="text-lg font-semibold text-foreground">Outstanding Bills</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {tenantBills.filter(bill => bill.status === 'unpaid' || bill.status === 'overdue').map(bill => <div key={bill.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <Checkbox checked={selectedBills.includes(bill.id)} onCheckedChange={checked => {
                          if (checked) {
                            setSelectedBills([...selectedBills, bill.id]);
                          } else {
                            setSelectedBills(selectedBills.filter(id => id !== bill.id));
                          }
                        }} className="w-4 h-4" />
                                <div>
                                  <div className="text-sm font-medium text-gray-800 capitalize">{bill.bill_type.replace('_', ' ')}</div>
                                  <div className="text-xs text-gray-500">Due: {formatDate(bill.due_date)}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-foreground">₱{Number(bill.amount).toFixed(2)}</div>
                                <Badge variant={bill.status === 'overdue' ? 'destructive' : 'secondary'} className="text-xs">{bill.status}</Badge>
                              </div>
                            </div>)}
                        </div>
                      </CardContent>
                    </Card>}
                </div>}
            </div>

            {/* Enhanced Transaction Details Section */}
            <div className="lg:col-span-1">
              <Card className="shadow-2xl border-2 border-border h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted hover:shadow-muted/50 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-6 py-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 animate-pulse bg-green-600"></div>
                  <CardTitle className="text-xl font-bold flex items-center relative z-10">
                    <div className="bg-primary-foreground/20 p-2 rounded-full mr-3">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    Transaction Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedTransaction ? <div className="space-y-6">
                      {/* Transaction Info */}
                      <div className="bg-gradient-to-r from-muted to-accent p-4 rounded-2xl border border-border">
                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-medium flex items-center">
                              <Users className="h-4 w-4 mr-2 text-primary" />
                              Account ID:
                            </span>
                            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                              {transactionType === 'Tenant' ? selectedTransaction.tenantId : selectedTransaction.plate_number}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-medium flex items-center">
                              <CreditCard className="h-4 w-4 mr-2 text-primary" />
                              Payment Type:
                            </span>
                            <span className="font-semibold text-foreground bg-secondary px-3 py-1 rounded-full">{paymentType}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-primary" />
                              Date & Time:
                            </span>
                            <div className="text-right">
                              <div className="font-semibold text-foreground flex items-center">
                                <CalendarDays className="h-3 w-3 mr-1 text-primary" />
                                {format(currentDateTime, 'MMM dd, yyyy')}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-primary" />
                                {format(currentDateTime, 'HH:mm:ss')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Selected Bills */}
                      {selectedBills.length > 0 && <div className="bg-gradient-to-r from-secondary to-muted p-4 rounded-2xl border border-border">
                          <div className="flex items-center mb-3">
                            <FileText className="h-5 w-5 text-primary mr-2" />
                            <span className="text-foreground font-semibold">Selected Bills:</span>
                          </div>
                          <div className="space-y-2">
                            {selectedBills.map(billId => {
                        const bill = tenantBills.find(b => b.id === billId);
                        return bill ? <div key={billId} className="bg-card/70 p-3 rounded-xl border border-border/50 flex justify-between items-center">
                                  <div className="flex items-center">
                                    {bill.bill_type === 'monthly_due' ? <div className="w-3 h-3 bg-primary rounded-full mr-2"></div> : <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>}
                                    <span className="text-sm font-medium text-foreground capitalize flex items-center">
                                      {bill.bill_type === 'monthly_due' ? <Calendar className="h-3 w-3 mr-1 text-primary" /> : <Check className="h-3 w-3 mr-1 text-primary" />}
                                      {bill.bill_type.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <span className="text-sm font-bold bg-primary/10 px-2 py-1 rounded-lg text-green-600">₱{Number(bill.amount).toFixed(2)}</span>
                                </div> : null;
                      })}
                          </div>
                          
                          {/* Total to Pay */}
                          <div className="mt-4 pt-3 border-t border-border">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-foreground flex items-center">
                                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                                Total to Pay:
                              </span>
                              <span className="text-2xl font-bold bg-primary/10 px-4 py-2 rounded-xl flex items-center text-green-600">
                                <DollarSign className="h-5 w-5 mr-1" />
                                {selectedBills.reduce((total, billId) => {
                            const bill = tenantBills.find(b => b.id === billId);
                            return total + (bill ? Number(bill.amount) : 0);
                          }, 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>}

                      {/* Amount Input Section */}
                      {selectedBills.length > 0 && <div className="bg-gradient-to-r from-secondary to-accent p-4 rounded-2xl border border-border">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-bold text-foreground mb-2 flex items-center">
                                <DollarSign className="h-4 w-4 mr-1 text-primary" />
                                Amount Received
                              </label>
                              <Input type="number" step="0.01" placeholder="Enter amount received" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="w-full h-12 px-4 bg-card border-2 border-border rounded-xl text-foreground text-lg font-bold placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </div>
                            
                            {amountPaid && <div className="bg-card/70 p-4 rounded-xl border border-border/50 space-y-3">
                                <div className="flex justify-between text-base">
                                  <span className="text-foreground font-semibold">Amount Received:</span>
                                  <span className="font-bold text-primary">₱{Number(amountPaid).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                                  <span className="text-foreground">Change:</span>
                                  <span className={`${changeAmount > 0 ? 'text-primary bg-primary/10' : 'text-foreground bg-secondary'} px-3 py-1 rounded-lg`}>
                                    ₱{changeAmount.toFixed(2)}
                                  </span>
                                </div>
                              </div>}
                          </div>
                        </div>}

                      {/* Payment Button */}
                      <div className="pt-2">
                        <Button onClick={handleMarkAsPaid} disabled={!selectedTransaction || transactionType === 'Tenant' && (selectedBills.length === 0 || !amountPaid || Number(amountPaid) < selectedBills.reduce((total, billId) => {
                      const bill = tenantBills.find(b => b.id === billId);
                      return total + (bill ? Number(bill.amount) : 0);
                    }, 0))} className="w-full bg-green-600 hover:bg-green-700 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 text-lg py-6 rounded-2xl font-bold hover:scale-105 transform text-white">
                          <div className="flex items-center justify-center">
                            <div className="bg-primary-foreground/20 p-2 rounded-full mr-3">
                              <Check className="h-6 w-6" />
                            </div>
                            Process Payment
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </div>
                        </Button>
                      </div>
                    </div> : <div className="text-center text-muted-foreground py-12">
                      <div className="bg-gradient-to-r from-muted to-accent p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <CreditCard className="h-12 w-12 text-primary" />
                      </div>
                      <p className="text-lg font-semibold text-foreground flex items-center justify-center">
                        <FileSearch className="h-5 w-5 mr-2 text-primary" />
                        Select a transaction to view details
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        Choose an account to start processing payment
                      </p>
                    </div>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Two Column Charts - Second Row */}
        

        {/* Payment History Card */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-bcs-green to-green-600 text-white px-8 py-6">
            <CardTitle className="text-2xl font-bold flex items-center">
              <History className="h-6 w-6 mr-3" />
              Payment Transaction History
            </CardTitle>
            <div className="text-green-100 mt-2">
              Recent payments processed by the cashier system
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">Transaction</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-4">Details</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-4">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-4">Payment</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-4">Receipt</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-4 py-4">Date & Time</TableHead>
                    <TableHead className="font-semibold text-gray-700 px-6 py-4">Processed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map(payment => <TableRow key={payment.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 border-b border-gray-100">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-bcs-green to-green-600 p-2 rounded-full text-white">
                            {getTransactionTypeIcon(payment.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{payment.type}</div>
                            <div className="text-sm text-gray-500">
                              {payment.type === 'Sleep Bus' ? 'Parking Fee' : 'Stall Rental'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-4">
                        {payment.type === 'Sleep Bus' ? <div>
                            <div className="font-medium text-gray-800">{payment.busName}</div>
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1 mr-2">
                                {payment.plateNumber}
                              </Badge>
                              {payment.route}
                            </div>
                            {payment.days && <div className="text-xs text-orange-600 mt-1 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {payment.days} days parked
                              </div>}
                          </div> : <div>
                            <div className="font-medium text-gray-800">{payment.tenantName}</div>
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-1 mr-2">
                                Stall {payment.stallNumber}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{payment.businessName}</div>
                          </div>}
                      </TableCell>
                      
                      <TableCell className="px-4 py-4">
                        <div className="text-2xl font-bold text-bcs-green">
                          ₱{payment.amount.toLocaleString()}
                        </div>
                        {payment.type === 'Sleep Bus' && payment.days && <div className="text-xs text-gray-500 mt-1">
                            ₱{(payment.amount / payment.days).toFixed(2)}/day
                          </div>}
                      </TableCell>
                      
                      <TableCell className="px-4 py-4">
                        <Badge variant="outline" className={`${getPaymentMethodColor(payment.paymentMethod)} px-3 py-1 font-medium`}>
                          {payment.paymentMethod}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="px-4 py-4">
                        <div className="bg-gray-100 px-3 py-2 rounded-lg">
                          <div className="font-mono text-sm font-semibold text-gray-800">
                            {payment.receiptNumber}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-800">
                            {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(payment.paymentDate), 'HH:mm')}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="bg-bcs-green p-1 rounded-full">
                            <Users className="h-3 w-3 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            {payment.tellerName}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
            
            {/* Summary Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {paymentHistory.length} recent transactions
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-sm">
                    <span className="text-gray-600">Total Amount: </span>
                    <span className="font-bold text-bcs-green text-lg">
                      ₱{paymentHistory.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="border-bcs-green text-bcs-green hover:bg-bcs-green hover:text-white transition-all duration-200">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <form onSubmit={handleSearch}>
                <input type="text" placeholder="Search by bus name, plate number, or route..." className="pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-bcs-green focus:border-bcs-green transition-all duration-200 text-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={24} />
                {searchTerm && <button type="button" onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <X size={24} />
                  </button>}
              </form>
            </div>
            
            <Button onClick={() => setShowFilters(!showFilters)} className="bg-gradient-to-r from-bcs-green to-green-600 hover:from-green-600 hover:to-bcs-green text-white rounded-xl gap-2 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Filter size={20} />
              Filter
            </Button>
          </div>
        </div>

        {/* Enhanced Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {tableView === 'Sleep Bus' ? 'Sleep Buses' : 'Tenants'}
                </h2>
                {/* Toggle View Button */}
                <div className="flex items-center bg-white rounded-lg p-1 border border-gray-300">
                  <Button variant={tableView === 'Sleep Bus' ? 'default' : 'ghost'} size="sm" onClick={() => {
                  setTableView('Sleep Bus');
                  setTransactionType('Sleep Bus');
                  setSelectedTransaction(null);
                }} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${tableView === 'Sleep Bus' ? 'bg-bcs-green text-white shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}>
                    <Bus className="h-4 w-4 mr-2" />
                    Sleep Bus
                  </Button>
                  <Button variant={tableView === 'Tenant' ? 'default' : 'ghost'} size="sm" onClick={() => {
                  setTableView('Tenant');
                  setTransactionType('Tenant');
                  setSelectedTransaction(null);
                }} className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${tableView === 'Tenant' ? 'bg-bcs-green text-white shadow-sm' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}>
                    <Users className="h-4 w-4 mr-2" />
                    Tenant
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-lg font-semibold">
                {tableView === 'Sleep Bus' ? filteredBusData.length : filteredTenantData.length} items
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto">
            {renderTableContent()}
          </div>
        </div>
        
        {/* Payment Confirmation Dialog */}
        <PaymentConfirmationDialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} onConfirm={handlePaymentConfirmed} busDetails={selectedTransaction && tableView === 'Sleep Bus' ? {
        plate_number: selectedTransaction.plate_number,
        bus_name: selectedTransaction.bus_name,
        total_fee: selectedTransaction.total_fee || selectedTransaction.daily_fee
      } : null} tellerName={user ? `${user.name || 'Cashier'}` : 'Unknown'} />

        {/* Tenant Payment Confirmation Dialog */}
        <TenantPaymentConfirmationDialog open={showTenantPaymentDialog} onClose={() => setShowTenantPaymentDialog(false)} onConfirm={handleTenantPaymentConfirmed} tenantDetails={selectedTransaction && tableView === 'Tenant' ? {
        tenantId: selectedTransaction.tenantId,
        name: selectedTransaction.name,
        stallNo: selectedTransaction.stallNo
      } : null} selectedBills={tenantBills.filter(bill => selectedBills.includes(bill.id))} totalAmount={selectedBills.reduce((total, billId) => {
        const bill = tenantBills.find(b => b.id === billId);
        return total + (bill ? Number(bill.amount) : 0);
      }, 0)} amountPaid={Number(amountPaid)} changeAmount={changeAmount} paymentMethod={paymentType} tellerName={user ? `${user.name || 'Cashier'}` : 'Unknown'} />
      </div>
    </CashierLayout>;
};
export default CashierHome;