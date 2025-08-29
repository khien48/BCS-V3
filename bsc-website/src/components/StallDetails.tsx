
import { Stall } from "../pages/StallSelection";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, Ruler, DollarSign, Zap, Droplets, Wind, Archive, Eye, ArrowUpDown } from "lucide-react";

interface StallDetailsProps {
  stall: Stall | null;
  isSelected: boolean;
}

const StallDetails = ({ stall, isSelected }: StallDetailsProps) => {
  if (!stall) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stall Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Hover or click on a stall to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-300';
      case 'bidding in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'electricity': return <Zap className="h-4 w-4" />;
      case 'ventilation': return <Wind className="h-4 w-4" />;
      case 'air conditioning': return <Wind className="h-4 w-4" />;
      case 'storage': return <Archive className="h-4 w-4" />;
      case 'display window': return <Eye className="h-4 w-4" />;
      case 'private entrance': return <ArrowUpDown className="h-4 w-4" />;
      case 'double entry': return <ArrowUpDown className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className={isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Stall {stall.number}</CardTitle>
          <Badge className={getStatusColor(stall.status)}>
            {stall.status.charAt(0).toUpperCase() + stall.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{stall.size}</p>
              <p className="text-xs text-muted-foreground">{stall.area} sq.m</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">₱{stall.monthlyRent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-xs text-muted-foreground">{stall.location}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {stall.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {stall.status === 'available' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">✓ Available for Lease</p>
            <p className="text-xs text-green-600 mt-1">
              Ready for immediate occupancy
            </p>
          </div>
        )}

        {stall.status === 'occupied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">✗ Currently Occupied</p>
            <p className="text-xs text-red-600 mt-1">
              This stall is not available for lease
            </p>
          </div>
        )}

        {stall.status === 'bidding in progress' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 font-medium">⏳ Bidding in Progress</p>
            <p className="text-xs text-yellow-600 mt-1">
              This stall is currently in bidding process
            </p>
          </div>
        )}

        {isSelected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">🎯 Selected</p>
            <p className="text-xs text-blue-600 mt-1">
              Click "Continue Application" to proceed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StallDetails;
