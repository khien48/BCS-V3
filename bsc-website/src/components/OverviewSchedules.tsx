import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock, Bus, Route, MapPin, Users, DollarSign } from 'lucide-react';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const OverviewSchedules = () => {
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['overviewSchedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bus_schedules')
        .select('bus_no, body_no, bound, time, operator, lane')
        .limit(8);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: fareMatrix, isLoading: fareLoading } = useQuery({
    queryKey: ['fareMatrix'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fare_matrix')
        .select('route, destination, distance_km, fare_amount')
        .order('route');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading || fareLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Today's Schedules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Today's Schedules</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detailed bus schedules and fare information for your journey across Bicol region
          </p>
        </div>
        
        {/* Enhanced Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {schedules?.map((schedule, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-none shadow-md bg-white hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bus className="h-5 w-5 text-primary" />
                    {schedule.bus_no}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {schedule.operator}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Route className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{schedule.bound}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>{schedule.time}</span>
                </div>
                {schedule.body_no && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Body: {schedule.body_no}</span>
                  </div>
                )}
                {schedule.lane && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span>Lane: {schedule.lane}</span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <DollarSign className="h-4 w-4" />
                    <span>₱50.00</span>
                    <span className="text-xs text-gray-500">(₱40.00 discounted)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fare Matrix Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">Fare Matrix</h3>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Route</TableHead>
                  <TableHead className="font-semibold">Destination</TableHead>
                  <TableHead className="font-semibold">Distance (km)</TableHead>
                  <TableHead className="font-semibold">Regular Fare</TableHead>
                  <TableHead className="font-semibold">Discounted Fare</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fareMatrix?.map((fare, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{fare.route}</TableCell>
                    <TableCell>{fare.destination}</TableCell>
                    <TableCell>{fare.distance_km} km</TableCell>
                    <TableCell className="font-semibold text-green-600">₱{fare.fare_amount}</TableCell>
                    <TableCell className="font-semibold text-blue-600">₱{(fare.fare_amount * 0.8).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Discounted fare (20% off) applies to Students, Senior Citizens, and Persons with Disabilities (PWD). 
              Please present valid ID to avail of discounted fare.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/schedule" 
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            View Complete Schedule
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverviewSchedules;