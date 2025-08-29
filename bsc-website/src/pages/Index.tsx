import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { ArrowRight, Bus, Clock, Shield } from "lucide-react";
import OverviewSchedules from "../components/OverviewSchedules";
import RouteHighlights from "../components/RouteHighlights";
import DestinationsMap from "../components/DestinationsMap";
const Index = () => {
  return <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 w-full bg-cover bg-center" style={{
          backgroundImage: "url('/lovable-uploads/627f5364-dfc4-42f7-9e1a-b71867195870.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100%",
          width: "100%"
        }}>
            
          </div>
          
          
        </div>
        
        {/* Overview Schedules */}
        <OverviewSchedules />
        
        {/* Destinations Map */}
        <DestinationsMap />
        
        {/* Route Highlights */}
        <RouteHighlights />
        
        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Bicol Central Station?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Bus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Modern Fleet</h3>
                  <p className="text-gray-600">Our buses are regularly maintained and equipped with modern amenities for your comfort.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Reliable Schedules</h3>
                  <p className="text-gray-600">We adhere to strict departure and arrival times to ensure you reach your destination on time.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Safe Travel</h3>
                  <p className="text-gray-600">Your safety is our priority with professionally trained drivers and safety protocols.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        
        {/* CTA Section */}
        <div className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/3 py-8 md:py-0">
                <img src="/lovable-uploads/0add709e-a5c8-4055-ad00-2013d4aa31da.png" alt="Travel App" className="w-full max-w-xs mx-auto md:mx-0 h-full object-contain" />
              </div>
              <div className="md:w-2/3 text-center md:text-left py-16">
                <h2 className="text-3xl font-bold mb-6">Ready to Travel?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto md:mx-0">Check our trip schedules and plan your journey across the beautiful Bicol region.</p>
                <Link to="/schedule">
                  <Button variant="outline" size="lg" className="bg-white text-primary rounded-full px-8 py-6 text-xl font-semibold hover:bg-gray-100 transition-all">
                    View Trip Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <img src="/lovable-uploads/364d80fc-70d5-4ec1-9a51-e210aa9ea024.png" alt="BCS Logo" className="h-12 w-auto mb-4" />
                <p className="text-gray-300 max-w-md">
                  Your trusted transportation partner serving the Bicol region with safe, reliable, and comfortable bus services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/schedule" className="text-gray-300 hover:text-white transition-colors">Schedule</Link></li>
                  <li><Link to="/bus-route" className="text-gray-300 hover:text-white transition-colors">Routes</Link></li>
                  <li><Link to="/track-bus" className="text-gray-300 hover:text-white transition-colors">Track Bus</Link></li>
                  <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <div className="space-y-2 text-gray-300">
                  <p>📍 Naga City, Camarines Sur</p>
                  <p>📞 (054) 123-4567</p>
                  <p>✉️ info@bicolcentral.com</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300">&copy; {new Date().getFullYear()} Bicol Central Station. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <span className="text-gray-300">Follow us:</span>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>;
};
export default Index;