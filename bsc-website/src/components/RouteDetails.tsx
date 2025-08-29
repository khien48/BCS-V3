import { Bus, Clock, MapPin, Banknote, Calendar, Users, Navigation } from "lucide-react";
import { Badge } from "./ui/badge";
import { Route } from "../types/Route";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
type RouteDetailsProps = {
  route?: Route;
};
const RouteDetails = ({
  route
}: RouteDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  if (!route) {
    return <div className="p-6 text-center text-muted-foreground">
        Please select a route to view details
      </div>;
  }

  // Calculate estimated arrival time (for demo purposes)
  const getEstimatedTime = () => {
    const hours = Math.floor(route.duration / 60);
    const minutes = route.duration % 60;
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      timeString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return timeString;
  };

  // Calculate average speed (for demo purposes)
  const getAverageSpeed = () => {
    // Assuming average route length based on duration
    const estimatedDistance = route.duration * 0.8; // km
    return Math.round(estimatedDistance / (route.duration / 60)); // km/h
  };

  // Calculate estimated distances based on duration (for demo)
  const getEstimatedDistance = () => {
    return Math.round(route.duration * 0.8); // km
  };
  return <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all animate-fade-in">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center text-xl">
                <Bus className="h-5 w-5 mr-2" />
                {route.name} Route Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="bg-transparent h-12 p-0 w-full rounded-none justify-start">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                      Schedule
                    </TabsTrigger>
                    <TabsTrigger value="buses" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                      Available Buses
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-6 m-0 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Route
                        </h4>
                        <div className="flex items-center gap-x-2 flex-wrap">
                          <Badge variant="outline" className="text-primary font-medium px-3 py-1">
                            {route.from}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="outline" className="text-primary font-medium px-3 py-1">
                            {route.to}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Trip Duration
                        </h4>
                        <p className="text-lg font-medium">{getEstimatedTime()}</p>
                        <p className="text-sm text-muted-foreground">Approx. {getEstimatedDistance()} km • {getAverageSpeed()} km/h avg. speed</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          Fare Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Regular Fare:</span>
                            <span className="font-medium">₱{route.fare.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-primary">
                            <span>Discounted Fare:</span>
                            <span className="font-medium">₱{route.discountedFare.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            *20% discount for senior citizens, PWDs, and students
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <Navigation className="h-4 w-4" />
                          Travel Info
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="text-sm">{route.stops.length} stops along the route</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="text-sm">Daily departures from 5:00 AM to 7:00 PM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span className="text-sm">Air-conditioned buses available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="schedule" className="p-6 m-0 animate-fade-in">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Daily Departure Schedule</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted px-3 py-2 font-medium text-sm">Morning Departures</div>
                        <div className="p-3 space-y-2">
                          {["5:00 AM", "6:30 AM", "8:00 AM", "9:30 AM", "11:00 AM"].map(time => <div key={time} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
                              <span>{time}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.random() > 0.7 ? "Limited Seats" : "Available"}
                              </Badge>
                            </div>)}
                        </div>
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted px-3 py-2 font-medium text-sm">Afternoon Departures</div>
                        <div className="p-3 space-y-2">
                          {["12:30 PM", "2:00 PM", "3:30 PM", "5:00 PM", "7:00 PM"].map(time => <div key={time} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
                              <span>{time}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.random() > 0.7 ? "Limited Seats" : "Available"}
                              </Badge>
                            </div>)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-4">
                      * Schedule may vary on weekends and holidays. Please check with terminal for confirmation.
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="buses" className="p-6 m-0 animate-fade-in">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Bus className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Buses Servicing This Route</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {route.buses.map((bus, index) => <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{bus}</div>
                            <Badge variant={index % 3 === 0 ? "default" : "secondary"} className="text-xs">
                              {index % 3 === 0 ? "Premium" : "Standard"}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            <span>{35 + index * 5} seating capacity</span>
                          </div>
                        </div>)}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3 lg:w-1/4 animate-fade-in">
          <Card className="overflow-hidden border-none shadow-md">
            
            
          </Card>
        </div>
      </div>
    </div>;
};
export default RouteDetails;