
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { destinationRoutes, DestinationRoute } from "../data/destinationRoutes";
import { MapPin, Clock, Route, Coins } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

// Fix Leaflet marker icon issue
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// BCS Terminal marker (different color)
const terminalIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "terminal-marker-icon"
});

L.Marker.prototype.options.icon = defaultIcon;

const DestinationsMap = () => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<DestinationRoute | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  // BCS Terminal coordinates
  const bcsTerminal = { lat: 13.619352, lng: 123.189150 };

  useEffect(() => {
    setIsMapInitialized(true);
  }, []);

  const handleDestinationClick = (route: DestinationRoute) => {
    if (mapInstance) {
      // Center the map on the selected destination with a closer zoom level
      mapInstance.setView([route.coordinates.lat, route.coordinates.lng], 12, {
        animate: true,
        duration: 1
      });
      
      // Set the route as hovered to highlight it
      setHoveredRoute(route);
      
      // Open the popup for the selected marker
      const marker = markersRef.current[route.id];
      if (marker) {
        marker.openPopup();
      }
      
      // Clear the hover state after a short delay
      setTimeout(() => {
        setHoveredRoute(null);
      }, 2000);
    }
  };

  const handleMarkerClick = (route: DestinationRoute, marker: L.Marker) => {
    // Store marker reference for later use
    markersRef.current[route.id] = marker;
    
    // Set the route as hovered to highlight it in the list
    setHoveredRoute(route);
    
    // Clear the hover state after a short delay
    setTimeout(() => {
      setHoveredRoute(null);
    }, 2000);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Route Network</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore all our destinations across the Bicol region. Click or hover over any location to see fare information and travel details.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Map Section */}
          <div className="xl:col-span-3">
            <div className="relative overflow-hidden rounded-xl border bg-background shadow-lg">
              <div className="relative w-full h-[600px]">
                {!isMapInitialized ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-muted-foreground">Loading destinations map...</div>
                  </div>
                ) : (
                  <MapContainer 
                    center={[13.5, 123.4]}
                    zoom={9}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                    ref={setMapInstance}
                    {...({} as any)}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* BCS Terminal */}
                    <Marker 
                      position={[bcsTerminal.lat, bcsTerminal.lng]}
                      {...({ icon: terminalIcon } as any)}
                    >
                      <Popup>
                        <div className="font-medium text-primary">Bicol Central Station</div>
                        <div className="text-sm text-muted-foreground">Main Terminal</div>
                      </Popup>
                    </Marker>

                    {/* Destination markers */}
                    {destinationRoutes.map((route) => (
                      <Marker 
                        key={route.id}
                        position={[route.coordinates.lat, route.coordinates.lng]}
                        eventHandlers={{
                          mouseover: () => setHoveredRoute(route),
                          mouseout: () => setHoveredRoute(null),
                          click: (e) => handleMarkerClick(route, e.target),
                        }}
                        ref={(marker) => {
                          if (marker) {
                            markersRef.current[route.id] = marker;
                          }
                        }}
                      >
                        <Popup>
                          <div className="min-w-[200px]">
                            <div className="font-medium text-lg mb-2">{route.name}</div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-sm">{route.estimatedDuration}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Route className="h-4 w-4 text-primary" />
                                <span className="text-sm">{route.distance}</span>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Coins className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">Regular: {route.regularFare}</span>
                                </div>
                                {route.discountedFare && (
                                  <div className="flex items-center gap-2 ml-6">
                                    <span className="text-sm text-green-600">Discounted: {route.discountedFare}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
            </div>
          </div>

          {/* Route List Section */}
          <div className="xl:col-span-1">
            <Card className="h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="bg-primary/5 p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    All Destinations
                  </h3>
                </div>
                
                <div className="overflow-auto flex-grow p-4">
                  <div className="space-y-3">
                    {destinationRoutes.map((route) => (
                      <div 
                        key={route.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          hoveredRoute?.id === route.id 
                            ? 'bg-primary/10 border-primary shadow-md' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => setHoveredRoute(route)}
                        onMouseLeave={() => setHoveredRoute(null)}
                        onClick={() => handleDestinationClick(route)}
                      >
                        <div className="font-medium text-sm mb-1">{route.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{route.distance} • {route.estimatedDuration}</div>
                        
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {route.regularFare}
                          </Badge>
                          {route.discountedFare && (
                            <Badge variant="secondary" className="text-xs ml-1">
                              {route.discountedFare}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationsMap;
