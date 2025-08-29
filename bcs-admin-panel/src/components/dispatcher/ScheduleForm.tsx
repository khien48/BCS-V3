import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Schedule } from '@/types/schedule';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit3, Bus, MapPin, Clock, Hash, DollarSign, Route, X } from 'lucide-react';
interface ScheduleFormProps {
  schedule?: Schedule | null;
  onSave: (schedule: Schedule) => void;
  onCancel: () => void;
  editMode: boolean;
  isLoading: boolean;
}
interface BusInventory {
  id: string;
  bus_number: string;
  body_number: string;
  operator_name: string;
  route: string;
  status: string;
}
interface Route {
  id: string;
  route_name: string;
  origin: string;
  destination: string;
  distance_km: number;
  estimated_duration: number;
}
interface Lane {
  id: string;
  lane_number: string;
  assigned_route: string;
  status: string;
}
interface FareMatrix {
  route: string;
  destination: string;
  fare_amount: number;
  distance_km: number;
}
const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  onSave,
  onCancel,
  editMode,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    busNo: '',
    bodyNo: '',
    operator: '',
    bound: '',
    lane: '',
    time: '',
    timeType: 'AM' as 'AM' | 'PM'
  });
  const [buses, setBuses] = useState<BusInventory[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [fareMatrix, setFareMatrix] = useState<FareMatrix | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  // Fetch inventory data
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const [busesResult, routesResult, lanesResult] = await Promise.all([supabase.from('bus_inventory').select('*').eq('status', 'active'), supabase.from('routes').select('*').eq('status', 'active'), supabase.from('terminal_lanes').select('*').eq('status', 'available')]);
        if (busesResult.data) setBuses(busesResult.data);
        if (routesResult.data) setRoutes(routesResult.data);
        if (lanesResult.data) setLanes(lanesResult.data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchInventoryData();
  }, []);

  // Fetch fare matrix when bound is selected
  useEffect(() => {
    const fetchFareMatrix = async () => {
      if (formData.bound) {
        try {
          const {
            data
          } = await supabase.from('fare_matrix').select('*').eq('route', formData.bound).single();
          setFareMatrix(data);
        } catch (error) {
          console.error('Error fetching fare matrix:', error);
          setFareMatrix(null);
        }
      } else {
        setFareMatrix(null);
      }
    };
    fetchFareMatrix();
  }, [formData.bound]);
  useEffect(() => {
    if (schedule && editMode) {
      setFormData({
        busNo: schedule.busNo,
        bodyNo: schedule.bodyNo,
        operator: schedule.operator,
        bound: schedule.bound,
        lane: schedule.lane,
        time: schedule.time,
        timeType: schedule.timeType
      });
    } else {
      setFormData({
        busNo: '',
        bodyNo: '',
        operator: '',
        bound: '',
        lane: '',
        time: '',
        timeType: 'AM'
      });
    }
  }, [schedule, editMode]);

  // Show all available buses (no filtering by route)
  const availableBuses = buses;

  // Filter available lanes based on selected route
  const availableLanes = lanes.filter(lane => !formData.bound || lane.assigned_route === formData.bound);

  // Handle bus selection and auto-fill data
  const handleBusSelection = (busNumber: string) => {
    const selectedBus = buses.find(bus => bus.bus_number === busNumber);
    if (selectedBus) {
      setFormData(prev => ({
        ...prev,
        busNo: selectedBus.bus_number,
        bodyNo: selectedBus.body_number,
        operator: selectedBus.operator_name,
        bound: selectedBus.route
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.busNo || !formData.bodyNo || !formData.operator || !formData.bound || !formData.lane || !formData.time) {
      return;
    }
    const scheduleData: Schedule = {
      id: schedule?.id || '',
      busNo: formData.busNo,
      bodyNo: formData.bodyNo,
      operator: formData.operator,
      bound: formData.bound,
      lane: formData.lane,
      time: formData.time,
      timeType: formData.timeType
    };
    onSave(scheduleData);
  };
  return <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editMode ? 'Edit Schedule' : 'Add New Schedule'}
            </h2>
            <p className="text-gray-600 text-sm">
              {editMode ? 'Update bus schedule information' : 'Create a new bus schedule'}
            </p>
          </div>
        </div>
        
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="busSelection" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Bus className="h-4 w-4" />
            Select Bus from Inventory
          </Label>
          <Select value={formData.busNo} onValueChange={handleBusSelection} disabled={loadingData}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingData ? "Loading buses..." : "Select a bus from inventory"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {availableBuses.map(bus => <SelectItem key={bus.id} value={bus.bus_number}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bus.bus_number}</span>
                    <span className="text-gray-500">({bus.body_number})</span>
                    <span className="text-green-600">- {bus.operator_name}</span>
                    <span className="text-blue-600 text-xs">→ {bus.route}</span>
                  </div>
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="busNo" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Bus className="h-4 w-4" />
              Bus Number
            </Label>
            <Input id="busNo" type="text" value={formData.busNo} onChange={e => setFormData({
            ...formData,
            busNo: e.target.value
          })} placeholder="Auto-filled from selection" className="w-full bg-gray-50" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bodyNo" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Hash className="h-4 w-4" />
              Body Number
            </Label>
            <Input id="bodyNo" type="text" value={formData.bodyNo} onChange={e => setFormData({
            ...formData,
            bodyNo: e.target.value
          })} placeholder="Auto-filled from selection" className="w-full bg-gray-50" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operator" className="text-sm font-medium text-gray-700">Operator</Label>
            <Input id="operator" type="text" value={formData.operator} onChange={e => setFormData({
            ...formData,
            operator: e.target.value
          })} placeholder="Auto-filled from selection" className="w-full bg-gray-50" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bound" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Route className="h-4 w-4" />
              Route/Bound
            </Label>
            <Select value={formData.bound} onValueChange={value => setFormData({
            ...formData,
            bound: value
          })} disabled={loadingData}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingData ? "Loading routes..." : "Select route"} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {routes.map(route => <SelectItem key={route.id} value={route.route_name}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{route.route_name}</span>
                      <span className="text-gray-500 text-xs">
                        ({route.distance_km} km • {route.estimated_duration} min)
                      </span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lane" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4" />
              Terminal Lane
            </Label>
            <Select value={formData.lane} onValueChange={value => setFormData({
            ...formData,
            lane: value
          })} disabled={loadingData || !formData.bound}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loadingData ? "Loading lanes..." : !formData.bound ? "Select route first" : "Select lane"} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availableLanes.map(lane => <SelectItem key={lane.id} value={lane.lane_number}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lane.lane_number}</span>
                      <span className="text-green-600 text-xs">
                        (assigned to {lane.assigned_route})
                      </span>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fare Matrix Display */}
        {fareMatrix && <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                <DollarSign className="h-5 w-5" />
                Fare Information for {formData.bound}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">Destination</div>
                  <div className="font-semibold text-gray-900">{fareMatrix.destination}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">Distance</div>
                  <div className="font-semibold text-blue-600">{fareMatrix.distance_km} km</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="text-sm text-gray-600">Fare Amount</div>
                  <div className="font-bold text-green-600 text-lg">₱{fareMatrix.fare_amount}</div>
                </div>
              </div>
            </CardContent>
          </Card>}

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hour" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock className="h-4 w-4" />
              Hour
            </Label>
            <Select value={formData.time.split(':')[0] || ''} onValueChange={(hour) => {
              const minute = formData.time.split(':')[1] || '00';
              setFormData({
                ...formData,
                time: `${hour.padStart(2, '0')}:${minute}`
              });
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select hour" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minute" className="text-sm font-medium text-gray-700">Minute</Label>
            <Select value={formData.time.split(':')[1] || ''} onValueChange={(minute) => {
              const hour = formData.time.split(':')[0] || '01';
              setFormData({
                ...formData,
                time: `${hour}:${minute.padStart(2, '0')}`
              });
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select minute" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 overflow-y-auto">
                {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeType" className="text-sm font-medium text-gray-700">Time Type</Label>
            <Select value={formData.timeType} onValueChange={(value: 'AM' | 'PM') => setFormData({
            ...formData,
            timeType: value
          })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1 bg-bcs-green hover:bg-bcs-green/90 text-white">
            {isLoading ? 'Saving...' : editMode ? 'Update Schedule' : 'Add Schedule'}
          </Button>
        </div>
      </form>
    </div>;
};
export default ScheduleForm;