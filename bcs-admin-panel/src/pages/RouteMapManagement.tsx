
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '../components/layouts/AdminLayout';
import { MapPin, Save, Trash2, Edit, Plus } from 'lucide-react';

interface RoutePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'start' | 'end' | 'waypoint';
}

interface Route {
  id: string;
  name: string;
  points: RoutePoint[];
  roadType: 'highway' | 'main-road' | 'local-road';
  color: string;
  isActive: boolean;
}

const RouteMapManagement: React.FC = () => {
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: '1',
      name: 'Bacolod to Silay Route',
      points: [
        { id: 'p1', name: 'Bacolod Terminal', lat: 10.6740, lng: 122.9532, type: 'start' },
        { id: 'p2', name: 'Silay Terminal', lat: 10.7951, lng: 123.0182, type: 'end' }
      ],
      roadType: 'highway',
      color: '#10b981',
      isActive: true
    }
  ]);
  
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [selectedRoadType, setSelectedRoadType] = useState<'highway' | 'main-road' | 'local-road'>('highway');
  const [mapClickMode, setMapClickMode] = useState<'none' | 'start' | 'end' | 'waypoint'>('none');

  // Mock map initialization (in real implementation, you'd use Google Maps, Mapbox, etc.)
  useEffect(() => {
    if (mapRef.current) {
      // Initialize map here
      console.log('Map initialized');
    }
  }, []);

  const handleCreateNewRoute = () => {
    if (!newRouteName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a route name",
        variant: "destructive"
      });
      return;
    }

    const newRoute: Route = {
      id: Date.now().toString(),
      name: newRouteName,
      points: [],
      roadType: selectedRoadType,
      color: getColorForRoadType(selectedRoadType),
      isActive: true
    };

    setRoutes([...routes, newRoute]);
    setSelectedRoute(newRoute);
    setIsEditing(true);
    setNewRouteName('');
    
    toast({
      title: "Route Created",
      description: `Route "${newRouteName}" has been created. Click on the map to add points.`
    });
  };

  const getColorForRoadType = (roadType: string): string => {
    switch (roadType) {
      case 'highway': return '#10b981';
      case 'main-road': return '#3b82f6';
      case 'local-road': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mapClickMode === 'none' || !selectedRoute || !isEditing) return;

    // Mock coordinates (in real implementation, get from map click event)
    const mockLat = 10.6740 + (Math.random() - 0.5) * 0.2;
    const mockLng = 122.9532 + (Math.random() - 0.5) * 0.2;

    const newPoint: RoutePoint = {
      id: Date.now().toString(),
      name: `${mapClickMode} Point`,
      lat: mockLat,
      lng: mockLng,
      type: mapClickMode as 'start' | 'end' | 'waypoint'
    };

    const updatedRoute = {
      ...selectedRoute,
      points: [...selectedRoute.points, newPoint]
    };

    setSelectedRoute(updatedRoute);
    setRoutes(routes.map(r => r.id === selectedRoute.id ? updatedRoute : r));
    setMapClickMode('none');

    toast({
      title: "Point Added",
      description: `${mapClickMode} point added to route`
    });
  };

  const handleDeletePoint = (pointId: string) => {
    if (!selectedRoute) return;

    const updatedRoute = {
      ...selectedRoute,
      points: selectedRoute.points.filter(p => p.id !== pointId)
    };

    setSelectedRoute(updatedRoute);
    setRoutes(routes.map(r => r.id === selectedRoute.id ? updatedRoute : r));
  };

  const handleSaveRoute = () => {
    if (!selectedRoute) return;

    setIsEditing(false);
    toast({
      title: "Route Saved",
      description: `Route "${selectedRoute.name}" has been saved successfully`
    });
  };

  const handleDeleteRoute = (routeId: string) => {
    setRoutes(routes.filter(r => r.id !== routeId));
    if (selectedRoute?.id === routeId) {
      setSelectedRoute(null);
      setIsEditing(false);
    }
    
    toast({
      title: "Route Deleted",
      description: "Route has been deleted successfully"
    });
  };

  return (
    <AdminLayout user={null}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Route Map Management</h1>
            <p className="text-gray-600">Create and manage bus routes with interactive mapping</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Creation Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="routeName">Route Name</Label>
                  <Input
                    id="routeName"
                    value={newRouteName}
                    onChange={(e) => setNewRouteName(e.target.value)}
                    placeholder="Enter route name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="roadType">Road Type</Label>
                  <Select value={selectedRoadType} onValueChange={(value: any) => setSelectedRoadType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highway">Highway</SelectItem>
                      <SelectItem value="main-road">Main Road</SelectItem>
                      <SelectItem value="local-road">Local Road</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreateNewRoute} className="w-full bg-bcs-green hover:bg-bcs-green/90">
                  Create Route
                </Button>
              </CardContent>
            </Card>

            {/* Route List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {routes.map((route) => (
                    <div
                      key={route.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoute?.id === route.id ? 'border-bcs-green bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{route.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" style={{ borderColor: route.color, color: route.color }}>
                              {route.roadType}
                            </Badge>
                            <span className="text-sm text-gray-500">{route.points.length} points</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoute(route);
                              setIsEditing(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRoute(route.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Interactive Route Map
                  </CardTitle>
                  {selectedRoute && isEditing && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={mapClickMode === 'start' ? 'default' : 'outline'}
                        onClick={() => setMapClickMode(mapClickMode === 'start' ? 'none' : 'start')}
                        className={mapClickMode === 'start' ? 'bg-green-600' : ''}
                      >
                        Add Start Point
                      </Button>
                      <Button
                        size="sm"
                        variant={mapClickMode === 'waypoint' ? 'default' : 'outline'}
                        onClick={() => setMapClickMode(mapClickMode === 'waypoint' ? 'none' : 'waypoint')}
                        className={mapClickMode === 'waypoint' ? 'bg-blue-600' : ''}
                      >
                        Add Waypoint
                      </Button>
                      <Button
                        size="sm"
                        variant={mapClickMode === 'end' ? 'default' : 'outline'}
                        onClick={() => setMapClickMode(mapClickMode === 'end' ? 'none' : 'end')}
                        className={mapClickMode === 'end' ? 'bg-red-600' : ''}
                      >
                        Add End Point
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveRoute}
                        className="bg-bcs-green hover:bg-bcs-green/90"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="h-full p-0">
                <div
                  ref={mapRef}
                  className="w-full h-full bg-gray-100 rounded-b-lg cursor-crosshair relative overflow-hidden"
                  onClick={handleMapClick}
                >
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100" />
                  
                  {/* Instructions */}
                  <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs">
                    {selectedRoute && isEditing ? (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Editing: {selectedRoute.name}</h4>
                        <p className="text-xs text-gray-600">
                          {mapClickMode === 'none' 
                            ? 'Select a point type above and click on the map to add points'
                            : `Click on the map to add a ${mapClickMode} point`
                          }
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Route Map</h4>
                        <p className="text-xs text-gray-600">
                          Select a route from the list to view it on the map
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Route Points Display */}
                  {selectedRoute && selectedRoute.points.map((point, index) => (
                    <div
                      key={point.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${30 + index * 15}%`,
                        top: `${40 + index * 10}%`
                      }}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                          point.type === 'start' ? 'bg-green-600' :
                          point.type === 'end' ? 'bg-red-600' :
                          'bg-blue-600'
                        }`}
                      >
                        {point.type === 'start' ? 'S' : point.type === 'end' ? 'E' : index}
                      </div>
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-md whitespace-nowrap">
                        {point.name}
                        {isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePoint(point.id);
                            }}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Mock Road Highlight */}
                  {selectedRoute && selectedRoute.points.length > 1 && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path
                        d={`M ${30}% ${40}% ${selectedRoute.points.map((_, i) => 
                          `L ${30 + i * 15}% ${40 + i * 10}%`
                        ).join(' ')}`}
                        stroke={selectedRoute.color}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={selectedRoute.roadType === 'local-road' ? '5,5' : 'none'}
                      />
                    </svg>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RouteMapManagement;
