import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Coins, Users } from 'lucide-react';

const RouteHighlights = () => {
  const [selectedRoute, setSelectedRoute] = useState('Legazpi');

  const routes = [
    {
      name: 'Legazpi',
      duration: '1h 15m',
      fare: '₱210-220',
      discountedFare: '₱160-190',
      distance: '75 km',
      description: 'Scenic route to the heart of Albay province with stunning Mayon Volcano views',
      highlights: ['Mayon Volcano View', 'Daraga Church', 'Legazpi Port'],
      color: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
    },
    {
      name: 'Iriga',
      duration: '45m',
      fare: '₱70-90',
      discountedFare: '₱70',
      distance: '45 km',
      description: 'Gateway to the beautiful highlands of Camarines Sur',
      highlights: ['Mountain Views', 'Cool Climate', 'Lake Buhi Access'],
      color: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop'
    },
    {
      name: 'Tabaco',
      duration: '1h 30m',
      fare: '₱220',
      discountedFare: '₱175',
      distance: '80 km',
      description: 'Coastal city known for its pristine beaches and seafood',
      highlights: ['Beach Access', 'Seafood Markets', 'Island Hopping'],
      color: 'bg-yellow-500',
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop'
    },
    {
      name: 'Polangui',
      duration: '1h 15m',
      fare: '₱130-220',
      discountedFare: 'No discount',
      distance: '65 km',
      description: 'Historic town surrounded by beautiful landscapes',
      highlights: ['Historic Sites', 'Rural Landscapes', 'Local Markets'],
      color: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop'
    }
  ];

  const currentRoute = routes.find(route => route.name === selectedRoute) || routes[0];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Routes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most traveled routes and explore what makes each destination special
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Selection */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Select Destination</h3>
            <div className="space-y-3">
              {routes.map((route) => (
                <button
                  key={route.name}
                  onClick={() => setSelectedRoute(route.name)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedRoute === route.name
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${route.color}`}></div>
                    <div>
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-gray-500">{route.duration} • {route.distance}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Route Details */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="relative h-48 md:h-56">
                <img 
                  src={currentRoute.image} 
                  alt={`${currentRoute.name} destination`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${currentRoute.color}`}></div>
                    <h3 className="text-2xl font-bold text-white">{currentRoute.name}</h3>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <p className="text-gray-600 mb-6">{currentRoute.description}</p>

                {/* Route Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-medium">{currentRoute.duration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-medium">{currentRoute.distance}</div>
                    <div className="text-xs text-gray-500">Distance</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Coins className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-medium">{currentRoute.fare}</div>
                    <div className="text-xs text-gray-500">Regular Fare</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-medium">{currentRoute.discountedFare}</div>
                    <div className="text-xs text-gray-500">Discounted</div>
                  </div>
                </div>

                {/* Route Highlights */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Route Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentRoute.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link to={`/schedule?route=${encodeURIComponent(currentRoute.name)}`}>
                    <Button className="flex-1">
                      View Schedule
                    </Button>
                  </Link>
                  <Link to="/bus-route">
                    <Button variant="outline">
                      View Route Map
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteHighlights;