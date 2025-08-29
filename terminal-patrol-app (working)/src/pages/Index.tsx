import { useState, useEffect } from "react";
import { Search, Bus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
type SleepBus = {
  bus_id: string;
  plate_number: string;
  bus_name: string;
  route: string;
  days_parked: number;
  date_time_parked: string;
  total_fee: number;
};
const Index = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<SleepBus[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('sleep_buses').select('*').order('date_time_parked', {
          ascending: false
        });
        if (error) throw error;
        setBuses(data || []);
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBuses();
  }, []);
  const filteredBuses = buses.filter(bus => bus.plate_number.toLowerCase().includes(searchQuery.toLowerCase()) || bus.bus_name.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleBusClick = (busId: string) => {
    navigate(`/bus/${busId}`);
  };
  return <div className="font-poppins min-h-screen bg-white px-4 pb-24">
      <div className="pt-8 pb-6 flex flex-col items-center">
        <img src="/lovable-uploads/c6a0641c-de51-4ebd-bb60-ddc95e93d065.png" alt="Bicol Central Station Logo" className="h-16 mb-6" />
        
      </div>
      
      <div className="relative mb-8">
        <Input type="text" placeholder="Search plate number or bus name" className="w-full bg-gray-50 rounded-full pl-12 h-12" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {isLoading ? <div className="text-center py-8">Loading buses...</div> : filteredBuses.length === 0 ? <div className="text-center py-8 text-gray-500">
          {searchQuery ? "No buses found matching your search" : "No buses recorded yet"}
        </div> : <div className="space-y-4">
          {filteredBuses.map(bus => <div key={bus.bus_id} onClick={() => handleBusClick(bus.bus_id)} className="rounded-xl p-4 flex justify-between items-center cursor-pointer transition-colors bg-[#e9f3ef]">
              <div className="flex items-center gap-3">
                <Bus className="w-6 h-6" />
                <div>
                  <span className="font-medium block">{bus.plate_number}</span>
                  <span className="text-sm text-gray-600 block">{bus.bus_name} - {bus.route}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium block">{bus.days_parked || 0} day{bus.days_parked !== 1 ? 's' : ''}</span>
                <span className="text-xs text-gray-600 block">₱{bus.total_fee || 0}</span>
              </div>
            </div>)}
        </div>}
    </div>;
};
export default Index;