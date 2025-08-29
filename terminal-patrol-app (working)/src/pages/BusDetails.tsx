import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
type BusDetails = {
  bus_id: string;
  plate_number: string;
  bus_name: string;
  route: string;
  days_parked: number;
  date_time_parked: string;
  total_fee: number;
};
const BusDetails = () => {
  const {
    id
  } = useParams();
  const [bus, setBus] = useState<BusDetails | null>(null);
  useEffect(() => {
    const fetchBusDetails = async () => {
      const {
        data,
        error
      } = await supabase.from('sleep_buses').select('*').eq('bus_id', id).single();
      if (error) {
        console.error('Error fetching bus details:', error);
        return;
      }
      setBus(data);
    };
    fetchBusDetails();
  }, [id]);
  if (!bus) return <div className="p-4">Loading...</div>;
  return <div className="font-poppins min-h-screen bg-white pb-24 px-[16px]">
      <div className="pt-8 mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-600">
          <ArrowLeft className="w-6 h-6" />
          <div>
            <h1 className="font-semibold text-black text-base px-0">View Details</h1>
            <p className="text-sm px-0">Sleep Bus</p>
          </div>
        </Link>
      </div>

       <Separator className="mb-4 mx-0 px-0 py-0 my-[50px]" />

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="text-xl font-semibold">₱ {bus.total_fee || 0}</span>
          </div>

          <div className="flex justify-between items-center pb-4">
            <span className="text-gray-600">Day</span>
            <Badge variant="secondary" className="bg-[#F2FCE2] text-black hover:bg-[#F2FCE2] hover:text-black">
              {bus.days_parked || 0} {bus.days_parked === 1 ? 'day' : 'days'}
            </Badge>
          </div>

          <Separator className="mb-4" />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plate Number</span>
              <span className="font-medium">{bus.plate_number}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bus</span>
              <span className="font-medium">{bus.bus_name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Route</span>
              <span className="font-medium">{bus.route}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Entry Created</span>
              <span className="font-medium">
                {format(new Date(bus.date_time_parked), "MMM dd, yyyy, HH:mm:ss")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BusDetails;