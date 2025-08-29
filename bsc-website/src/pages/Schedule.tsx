
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TripTable, { Trip } from '../components/TripTable';

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const location = useLocation();

  // Check for route parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const routeParam = urlParams.get('route');
    if (routeParam) {
      setSelectedRoute(routeParam);
    }
  }, [location]);

  const { data: busSchedules, isLoading } = useQuery({
    queryKey: ['busSchedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bus_schedules')
        .select('bus_no, body_no, operator, lane, bound, time');
      
      if (error) {
        console.error('Error fetching bus schedules:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Transform Supabase data to match our Trip interface
  const allTrips: Trip[] = busSchedules?.map(schedule => ({
    plateNumber: schedule.bus_no,
    bodyNumber: schedule.body_no,
    operator: schedule.operator,
    lane: schedule.lane,
    route: schedule.bound,
    departureTime: schedule.time,
    fare: '₱50.00',
    discountedFare: '₱40.00'
  })) || [];

  // Filter trips based on search and selected route
  const filteredTrips = allTrips.filter(trip => {
    const matchesSearch = searchTerm === '' || 
      trip.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trip.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.lane && trip.lane.toLowerCase().includes(searchTerm.toLowerCase())) ||
      trip.route.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trip.departureTime.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoute = selectedRoute === '' || trip.route.toLowerCase() === selectedRoute.toLowerCase();
    return matchesSearch && matchesRoute;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection onSearch={setSearchTerm} onRouteSelect={setSelectedRoute} />
        
        {/* Discounted Fare Reminder */}
        <div className="container mx-auto px-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Discounted Fare Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    <strong>Discounted fare (₱40.00)</strong> is available for:
                    <span className="font-semibold"> Students, Senior Citizens, and Persons with Disabilities (PWD)</span>
                  </p>
                  <p className="mt-1 text-xs">Please present valid ID to avail of discounted fare.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <TripTable trips={filteredTrips} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Schedule;
