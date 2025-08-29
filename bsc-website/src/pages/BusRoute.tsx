
import { useState, useEffect } from "react";
import Header from "../components/Header";
import RouteMap from "../components/RouteMap";
import RouteDetails from "../components/RouteDetails";
import { Route } from "../types/Route";
import { useToast } from "../components/ui/use-toast";

const BusRoute = () => {
  // Mock data for bus routes with more detailed coordinates
  const routes: Route[] = [
    {
      id: "1",
      name: "Legazpi",
      from: "BCS Terminal",
      to: "Legazpi City",
      duration: 75,
      fare: 130,
      discountedFare: 104,
      buses: ["Bus 101", "Bus 102", "Bus 103"],
      stops: ["BCS Terminal", "Pili", "Ocampo", "Polangui", "Ligao", "Guinobatan", "Camalig", "Daraga", "Legazpi City"],
      coordinates: [
        { lat: 13.5822, lng: 123.2912 }, // BCS Terminal
        { lat: 13.5560, lng: 123.3412 }, // Pili
        { lat: 13.5010, lng: 123.3755 }, // Ocampo
        { lat: 13.4212, lng: 123.4855 }, // Polangui
        { lat: 13.2401, lng: 123.5253 }, // Ligao
        { lat: 13.1933, lng: 123.5768 }, // Guinobatan
        { lat: 13.1823, lng: 123.6412 }, // Camalig
        { lat: 13.1573, lng: 123.7002 }, // Daraga
        { lat: 13.1391, lng: 123.7438 }, // Legazpi
      ],
    },
    {
      id: "2",
      name: "Polangui",
      from: "BCS Terminal",
      to: "Polangui",
      duration: 45,
      fare: 65,
      discountedFare: 52,
      buses: ["Bus 201", "Bus 202"],
      stops: ["BCS Terminal", "Pili", "Ocampo", "Iriga", "Polangui"],
      coordinates: [
        { lat: 13.5822, lng: 123.2912 }, // BCS Terminal
        { lat: 13.5560, lng: 123.3412 }, // Pili
        { lat: 13.5010, lng: 123.3755 }, // Ocampo
        { lat: 13.4512, lng: 123.4125 }, // Iriga
        { lat: 13.4212, lng: 123.4855 }, // Polangui
      ],
    },
    {
      id: "3",
      name: "Pili",
      from: "BCS Terminal",
      to: "Pili",
      duration: 15,
      fare: 20,
      discountedFare: 16,
      buses: ["Bus 301", "Bus 302", "Bus 303", "Bus 304"],
      stops: ["BCS Terminal", "Concepcion Grande", "Peñafrancia", "SM City Naga", "Robinsons Place Naga", "Pili Town Center"],
      coordinates: [
        { lat: 13.619352, lng: 123.189150 }, // BCS Terminal (actual coordinates)
        { lat: 13.618500, lng: 123.195000 }, // Along national highway towards Concepcion Grande
        { lat: 13.617200, lng: 123.205000 }, // Concepcion Grande area along highway
        { lat: 13.615800, lng: 123.215000 }, // Peñafrancia area along highway
        { lat: 13.614000, lng: 123.225000 }, // SM City Naga area along highway
        { lat: 13.612000, lng: 123.235000 }, // Robinsons Place Naga area along highway
        { lat: 13.608000, lng: 123.245000 }, // Continue along national highway
        { lat: 13.600000, lng: 123.255000 }, // Further along national highway
        { lat: 13.585000, lng: 123.265000 }, // Approaching Pili along highway
        { lat: 13.556424, lng: 123.273628 }, // Pili Town Center (actual coordinates)
      ],
    },
    {
      id: "4",
      name: "Goa",
      from: "BCS Terminal",
      to: "Goa",
      duration: 60,
      fare: 90,
      discountedFare: 72,
      buses: ["Bus 401", "Bus 402"],
      stops: ["BCS Terminal", "Pili", "Ocampo", "Naga", "Tinambac", "Goa"],
      coordinates: [
        { lat: 13.5822, lng: 123.2912 }, // BCS Terminal
        { lat: 13.5560, lng: 123.3412 }, // Pili
        { lat: 13.5010, lng: 123.3755 }, // Ocampo
        { lat: 13.6212, lng: 123.2001 }, // Naga
        { lat: 13.6501, lng: 123.3255 }, // Tinambac
        { lat: 13.6980, lng: 123.5031 }, // Goa
      ],
    },
    {
      id: "5",
      name: "Daet",
      from: "BCS Terminal",
      to: "Daet",
      duration: 120,
      fare: 270,
      discountedFare: 216,
      buses: ["Bus 501"],
      stops: ["BCS Terminal", "Sipocot", "Libmanan", "Labo", "San Vicente", "Daet"],
      coordinates: [
        { lat: 13.5822, lng: 123.2912 }, // BCS Terminal
        { lat: 13.7443, lng: 123.1172 }, // Sipocot
        { lat: 13.8292, lng: 123.0645 }, // Libmanan
        { lat: 14.0321, lng: 122.9851 }, // Labo
        { lat: 14.0782, lng: 122.9702 }, // San Vicente
        { lat: 14.1121, lng: 122.9552 }, // Daet
      ],
    }
  ];

  const [selectedRouteId, setSelectedRouteId] = useState<string>("3"); // Default to Pili route
  const { toast } = useToast();
  
  const selectedRoute = routes.find(route => route.id === selectedRouteId) || routes[0];
  
  const handleRouteChange = (routeName: string) => {
    const route = routes.find(r => r.name === routeName);
    if (route) {
      setSelectedRouteId(route.id);
      toast({
        title: "Route Selected",
        description: `Now viewing the ${routeName} route`,
        duration: 2000
      });
    }
  };

  useEffect(() => {
    // Display welcome toast when component mounts
    toast({
      title: "Welcome to the Bus Route Explorer",
      description: "Select a route to see details and interactive map",
      duration: 3000
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/10">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight">Bus Routes</h1>
            <p className="text-muted-foreground mt-2">
              Explore bus routes, stops, and schedules throughout the Bicol Region
            </p>
          </div>
          
          <RouteMap 
            selectedRoute={selectedRoute.name} 
            onRouteChange={handleRouteChange}
            routes={routes}
          />
          
          <RouteDetails route={selectedRoute} />
        </div>
      </main>
    </div>
  );
};

export default BusRoute;
