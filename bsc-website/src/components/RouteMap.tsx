import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Route } from "../types/Route";
import { Bus, Navigation } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

// Fix Leaflet marker icon issue
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const startIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "start-marker-icon"
});

const endIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "end-marker-icon"
});

L.Marker.prototype.options.icon = defaultIcon;

interface RouteMapProps {
  selectedRoute: string;
  onRouteChange: (routeName: string) => void;
  routes: Route[];
}

const RouteMap = ({ selectedRoute, onRouteChange, routes }: RouteMapProps) => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<null | { lat: number, lng: number, name: string }>(null);
  const [showStopsOnMap, setShowStopsOnMap] = useState(false);

  // Find the currently selected route
  const currentRoute = routes.find((route) => route.name === selectedRoute);

  // Set up map center based on the selected route or default to BCS Terminal
  const mapCenter: [number, number] = currentRoute?.coordinates?.length 
    ? [currentRoute.coordinates[0].lat, currentRoute.coordinates[0].lng] 
    : [13.619352, 123.189150]; // BCS Terminal

  // Set up route coordinates for the polyline
  const routePath = currentRoute?.coordinates?.map((coord) => [
    coord.lat,
    coord.lng
  ] as [number, number]) || [];

  useEffect(() => {
    setIsMapInitialized(true);
    console.log(`Map initialized with route: ${selectedRoute}`);
  }, [selectedRoute]);

  const routeOptions = routes.map((route) => route.name);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-primary" />
          <h2 className="font-bold text-xl">Bus Route Map</h2>
        </div>
        <div className="w-72 relative z-50">
          <Select value={selectedRoute} onValueChange={onRouteChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Trip Routes" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              {routeOptions.map((route) => (
                <SelectItem key={route} value={route}>
                  {route}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-xl border bg-background shadow-md transition-all hover:shadow-lg">
            <div className="absolute top-4 right-4 z-20">
              <Badge 
                variant="outline" 
                className={cn(
                  "bg-white/80 backdrop-blur-sm cursor-pointer transition-all hover:bg-white",
                  showStopsOnMap ? "border-primary" : ""
                )}
                onClick={() => setShowStopsOnMap(!showStopsOnMap)}
              >
                <Navigation className="h-3.5 w-3.5 mr-1" />
                {showStopsOnMap ? "Hide Stops" : "Show Stops"}
              </Badge>
            </div>
            
            <div className="relative w-full h-[500px] animate-fade-in">
              {!isMapInitialized ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-muted-foreground">Loading map...</div>
                </div>
              ) : (
                <MapContainer 
                  center={mapCenter}
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                  {...({} as any)}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {routePath.length > 0 && (
                    <Polyline 
                      positions={routePath}
                      pathOptions={{ color: "#2563eb", weight: 6, opacity: 0.8 }}
                    />
                  )}
                  {currentRoute?.coordinates && currentRoute.coordinates.length > 0 && (
                    <>
                      <Marker 
                        position={[currentRoute.coordinates[0].lat, currentRoute.coordinates[0].lng]}
                      >
                        <Popup>
                          <div className="font-medium">Starting point</div>
                          <div className="text-sm text-muted-foreground">{currentRoute.from}</div>
                        </Popup>
                      </Marker>
                      
                      <Marker 
                        position={[
                          currentRoute.coordinates[currentRoute.coordinates.length - 1].lat, 
                          currentRoute.coordinates[currentRoute.coordinates.length - 1].lng
                        ]}
                      >
                        <Popup>
                          <div className="font-medium">Destination</div>
                          <div className="text-sm text-muted-foreground">{currentRoute.to}</div>
                        </Popup>
                      </Marker>

                      {showStopsOnMap && currentRoute.stops.map((stop, index) => {
                        // Show stops along the route (excluding first and last which are already shown as markers)
                        if (index === 0 || index === currentRoute.stops.length - 1) return null;
                        
                        // Use intermediate points from coordinates array for stop locations
                        const stopIndex = Math.floor((index) * (currentRoute.coordinates.length - 2) / (currentRoute.stops.length - 1)) + 1;
                        const coordinate = currentRoute.coordinates[stopIndex] || currentRoute.coordinates[index];
                        
                        return (
                          <Marker 
                            key={`stop-${index}`}
                            position={[coordinate.lat, coordinate.lng]}
                          >
                            <Popup>
                              <div className="font-medium">{stop}</div>
                              <div className="text-xs text-muted-foreground">Stop {index + 1}</div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </>
                  )}
                  
                  {hoveredPoint && (
                    <Marker 
                      position={[hoveredPoint.lat, hoveredPoint.lng]}
                    >
                      <Popup>
                        <div className="font-medium">{hoveredPoint.name}</div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 animate-fade-in">
          <div className="border rounded-xl shadow-md overflow-hidden h-[500px] flex flex-col">
            <div className="bg-primary/5 p-3 border-b">
              <h3 className="font-semibold text-sm">Route Stops</h3>
            </div>
            
            <div className="overflow-auto flex-grow p-3">
              <div className="space-y-1">
                {currentRoute?.stops.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === currentRoute.stops.length - 1;
                  
                  // Use start, middle, or end coordinates for the stop
                  let stopCoordinate;
                  if (isFirst) {
                    stopCoordinate = currentRoute.coordinates[0];
                  } else if (isLast) {
                    stopCoordinate = currentRoute.coordinates[currentRoute.coordinates.length - 1];
                  } else {
                    const stopIndex = Math.floor((index) * (currentRoute.coordinates.length - 2) / (currentRoute.stops.length - 1)) + 1;
                    stopCoordinate = currentRoute.coordinates[stopIndex] || currentRoute.coordinates[index];
                  }
                  
                  return (
                    <div 
                      key={stop}
                      className={cn(
                        "flex items-center p-2 rounded-lg transition-all cursor-pointer relative",
                        isFirst ? "text-primary font-medium" : "",
                        isLast ? "text-primary font-medium" : "",
                        "hover:bg-muted"
                      )}
                      onMouseEnter={() => setHoveredPoint({
                        lat: stopCoordinate.lat,
                        lng: stopCoordinate.lng,
                        name: stop
                      })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <div className="flex-shrink-0 mr-2">
                        {isFirst ? (
                          <div className="h-3 w-3 bg-primary rounded-full"></div>
                        ) : isLast ? (
                          <div className="h-3 w-3 bg-primary rounded-full"></div>
                        ) : (
                          <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <span className={cn(isFirst || isLast ? "font-medium" : "")}>{stop}</span>
                        {(isFirst || isLast) && (
                          <span className="text-xs block text-muted-foreground">
                            {isFirst ? 'Starting point' : 'Destination'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;