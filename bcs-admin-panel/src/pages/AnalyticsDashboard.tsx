import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCredential } from '../utils/auth';
import CashierLayout from '@/components/layouts/CashierLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';

interface AnalyticsDashboardProps {
  user: UserCredential | null;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  
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

  // Mock data for occupancy chart
  const occupancyData = [
    { month: 'Jun', value: 62 },
    { month: 'Jul', value: 51 },
    { month: 'Aug', value: 25 },
    { month: 'Sep', value: 24 },
    { month: 'Oct', value: 68 },
    { month: 'Nov', value: 61 },
    { month: 'Dec', value: 92 },
    { month: 'Jan', value: 75 },
    { month: 'Feb', value: 74 },
    { month: 'Mar', value: 25 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 80 },
  ];

  // Mock data for pie chart
  const busRouteData = [
    { name: 'Daet', value: 35, color: '#55acee' },
    { name: 'Ragay', value: 45, color: '#4cd964' },
    { name: 'Manila', value: 20, color: '#d644cd' },
  ];
  
  // Mock data for payment methods chart
  const paymentMethodsData = [
    { name: 'Cash Payment', value: 40, color: '#4cd964' },
    { name: 'Debit/Credit Cards', value: 30, color: '#ff9500' },
    { name: 'Mobile Payments', value: 15, color: '#ff2d55' },
    { name: 'Loyalty Points', value: 15, color: '#5856d6' },
  ];

  // Mock data for loyalty card customers chart
  const loyaltyCustomersData = [
    { month: 'Aug', value: 950 },
    { month: 'Sep', value: 650 },
    { month: 'Oct', value: 780 },
    { month: 'Nov', value: 250 },
    { month: 'Dec', value: 700 },
    { month: 'Jan', value: 980 },
    { month: 'Feb', value: 350 },
    { month: 'Mar', value: 180 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 150 },
  ];

  // Custom rendering for pie chart labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="#000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} (${Math.round(percent * 100)}%)`}
      </text>
    );
  };

  if (!user) return null;

  return (
    <CashierLayout user={user}>
      <div className="p-6 bg-gray-50 min-w-full">
        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white rounded-lg shadow">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-500">$ 135,600</div>
              <div className="text-gray-500 text-sm">Total Revenue Last 12 Months</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">$1,280</div>
              <div className="text-gray-500 text-sm">Last Month (May)</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">$11,126</div>
              <div className="text-gray-500 text-sm">Last Quarter</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg shadow">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">$126</div>
              <div className="text-gray-500 text-sm">Today's Collection</div>
            </CardContent>
          </Card>
        </div>

        {/* Parking Occupancy Chart */}
        <Card className="bg-white rounded-lg shadow mb-6">
          <CardHeader>
            <CardTitle className="text-gray-600">Parking Occupancy Last 12 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer 
                config={{ 
                  occupancy: { 
                    theme: { light: '#0E9F6E', dark: '#0E9F6E' } 
                  }
                }}
              >
                <LineChart
                  data={occupancyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p>{payload[0].payload.month}: {payload[0].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0E9F6E" 
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#0E9F6E" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Bus Sleep Bound Pie Chart */}
          <Card className="bg-white rounded-lg shadow">
            <CardHeader>
              <CardTitle className="text-gray-600">Bus Sleep Bound</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}}>
                  <PieChart>
                    <Pie
                      data={busRouteData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {busRouteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value}%`}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Total Payer Card */}
          <Card className="bg-white rounded-lg shadow">
            <CardHeader>
              <CardTitle className="text-gray-600">Total Payer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-6 gap-x-10">
                <div>
                  <div className="text-2xl font-bold text-green-600">$1,28</div>
                  <div className="text-gray-500 text-sm">Today</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">$1,280</div>
                  <div className="text-gray-500 text-sm">Last Month (May)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">$11,280</div>
                  <div className="text-gray-500 text-sm">Last Quarter</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">$78,280</div>
                  <div className="text-gray-500 text-sm">Last Year</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Charts - Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Loyalty Card Customers */}
          <Card className="bg-white rounded-lg shadow">
            <CardHeader>
              <CardTitle className="text-gray-600">Loyalty Card Customers (Last 10 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={loyaltyCustomersData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 1000]} ticks={[0, 250, 500, 750, 1000]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0E9F6E" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-white rounded-lg shadow">
            <CardHeader>
              <CardTitle className="text-gray-600">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={true}
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${value}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CashierLayout>
  );
};

export default AnalyticsDashboard;
