import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const AddBus = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    plate_number: "",
    bus_name: "",
    route: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plate_number || !formData.bus_name || !formData.route) {
      toast("Validation Error", {
        description: "Please fill in all required fields.",
        style: {
          background: 'red',
          color: 'white'
        }
      });
      return;
    }
    try {
      setIsSubmitting(true);

      // Check if bus already exists
      const {
        data: existingBus
      } = await supabase.from('sleep_buses').select('bus_id').eq('plate_number', formData.plate_number).maybeSingle();
      if (existingBus) {
        toast("Bus Already Recorded", {
          description: "This bus has already been recorded as parked overnight.",
          style: {
            background: 'red',
            color: 'white'
          }
        });
        setIsSubmitting(false);
        return;
      }

      // For demonstration purposes, we'll use a fixed UUID for recorded_by
      const demoUserId = "00000000-0000-0000-0000-000000000000";

      // Insert new sleep bus record
      const {
        error
      } = await supabase.from('sleep_buses').insert({
        plate_number: formData.plate_number,
        bus_name: formData.bus_name,
        route: formData.route,
        daily_fee: 30.00,
        // Default daily fee
        recorded_by: demoUserId
      });
      if (error) throw error;
      toast("Success", {
        description: "Bus successfully recorded."
      });

      // Reset form and navigate back to home
      setFormData({
        plate_number: "",
        bus_name: "",
        route: ""
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error adding bus:", error);
      toast("Error", {
        description: error.message || "Failed to add bus. Please try again.",
        style: {
          background: 'red',
          color: 'white'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="font-poppins min-h-screen bg-white px-4 pb-24">
      <div className="pt-8 pb-6 flex flex-col items-center">
        <img src="/lovable-uploads/c6a0641c-de51-4ebd-bb60-ddc95e93d065.png" alt="Bicol Central Station Logo" className="h-16 mb-6" />
        <h1 className="font-semibold text-sm">Add New Sleep Bus</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-base font-medium mb-2 block">Plate Number</label>
          <Input type="text" name="plate_number" placeholder="Enter plate number" className="w-full bg-gray-50 rounded-xl h-12" value={formData.plate_number} onChange={handleChange} />
        </div>

        <div>
          <label className="text-base font-medium mb-2 block">Bus Name</label>
          <Input type="text" name="bus_name" placeholder="Enter bus name" className="w-full bg-gray-50 rounded-xl h-12" value={formData.bus_name} onChange={handleChange} />
        </div>

        <div>
          <label className="text-base font-medium mb-2 block">Route</label>
          <Input type="text" name="route" placeholder="Enter destination" className="w-full bg-gray-50 rounded-xl h-12" value={formData.route} onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full bg-mint text-black hover:bg-mint/90 rounded-xl h-12 mt-8" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>;
};
export default AddBus;