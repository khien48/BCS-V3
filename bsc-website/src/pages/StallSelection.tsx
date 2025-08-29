
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TerminalMap from "../components/TerminalMap";
import StallDetails from "../components/StallDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";

export interface Stall {
  id: string;
  number: string;
  size: string;
  status: 'available' | 'occupied' | 'bidding in progress';
  monthlyRent: number;
  area: number; // in square meters
  location: string;
  amenities: string[];
  x: number; // position on map
  y: number; // position on map
}

const StallSelection = () => {
  const navigate = useNavigate();
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [hoveredStall, setHoveredStall] = useState<Stall | null>(null);

  const handleStallSelect = (stall: Stall) => {
    if (stall.status === 'available') {
      setSelectedStall(stall);
    }
  };

  const handleContinueApplication = () => {
    if (selectedStall) {
      // Navigate to application form with selected stall info
      navigate("/application-for-leasehold-tenancy/apply", { 
        state: { selectedStall } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/application-for-leasehold-tenancy")}
              className="p-2 rounded-full"
            >
              <ArrowLeft size={24} className="text-gray-500" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Select Your Stall</h1>
              <p className="text-muted-foreground mt-1">
                Choose an available stall from the terminal station map
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Terminal Station Layout</h2>
                </div>
                <TerminalMap
                  onStallSelect={handleStallSelect}
                  onStallHover={setHoveredStall}
                  selectedStall={selectedStall}
                  hoveredStall={hoveredStall}
                />
              </div>
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-1">
              <StallDetails 
                stall={hoveredStall || selectedStall} 
                isSelected={!!selectedStall}
              />
              
              {selectedStall && (
                <div className="mt-4">
                  <Button 
                    onClick={handleContinueApplication}
                    className="w-full bg-green-700 hover:bg-green-800 text-white py-3"
                    size="lg"
                  >
                    Continue Application for Stall {selectedStall.number}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold mb-3">Map Legend</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Bidding in Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 border-2 border-blue-700 rounded"></div>
                <span className="text-sm">Selected</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StallSelection;
