
import React, { useState } from 'react';
import { X, Pencil, Trash2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SleepBusData {
  bus_id: string;
  bus_name: string;
  plate_number: string;
  route: string;
  daily_fee: number;
  days_parked?: number;
  total_fee?: number;
  date_time_parked: string;
  recorded_by?: string;
  last_updated?: string;
}

interface SleepBusDetailsProps {
  bus: SleepBusData;
  onClose: () => void;
  onBusDeleted: () => void;
  onBusUpdated: (updatedBus: SleepBusData) => void;
}

const SleepBusDetails: React.FC<SleepBusDetailsProps> = ({ bus, onClose, onBusDeleted, onBusUpdated }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    plate_number: bus.plate_number,
    bus_name: bus.bus_name,
    route: bus.route,
  });
  
  // Use the days_parked and total_fee from the database if available
  const daysParked = bus.days_parked || 1;
  const totalFee = bus.total_fee || (bus.daily_fee * daysParked);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('sleep_buses')
        .delete()
        .eq('bus_id', bus.bus_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bus record has been deleted successfully.",
      });
      onBusDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast({
        title: "Error",
        description: "Failed to delete bus record.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('sleep_buses')
        .update(editedData)
        .eq('bus_id', bus.bus_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bus details updated successfully.",
      });
      
      onBusUpdated({ ...bus, ...editedData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bus:', error);
      toast({
        title: "Error",
        description: "Failed to update bus details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md p-0 font-poppins overflow-hidden rounded-xl">
        {/* Header */}
        <div className="bg-bcs-green text-white p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Bus Details</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <div className="mt-3 flex justify-between items-end">
            <div>
              <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                {bus.plate_number}
              </Badge>
              <div className="text-2xl font-bold">{bus.bus_name}</div>
              <div className="text-white/80 text-sm mt-1">{bus.route} Route</div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm">Total Fee</div>
              <div className="text-3xl font-bold">₱{totalFee}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Parking Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-bcs-green mr-2" />
                <span className="text-gray-700 font-medium">Parking Duration</span>
              </div>
              <Badge 
                className="bg-bcs-green text-white px-3 py-1 text-sm"
              >
                {daysParked} {daysParked === 1 ? 'day' : 'days'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-bcs-green mr-2" />
                <span className="text-gray-700 font-medium">Parked Since</span>
              </div>
              <span className="text-sm text-gray-600">
                {format(new Date(bus.date_time_parked), 'MMM dd, yyyy, HH:mm')}
              </span>
            </div>
            
            {bus.last_updated && (
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-gray-700 font-medium">Last Updated</span>
                </div>
                <span className="text-sm text-gray-600">
                  {format(new Date(bus.last_updated), 'MMM dd, yyyy, HH:mm')}
                </span>
              </div>
            )}
          </div>

          {/* Details Fields */}
          <div className="space-y-5">
            {isEditing ? (
              <>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                  <Input
                    value={editedData.plate_number}
                    onChange={(e) => setEditedData({ ...editedData, plate_number: e.target.value })}
                    className="w-full border-gray-300"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Bus Name</label>
                  <Input
                    value={editedData.bus_name}
                    onChange={(e) => setEditedData({ ...editedData, bus_name: e.target.value })}
                    className="w-full border-gray-300"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Route</label>
                  <Input
                    value={editedData.route}
                    onChange={(e) => setEditedData({ ...editedData, route: e.target.value })}
                    className="w-full border-gray-300"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Daily Fee</span>
                  <span className="font-medium">₱{bus.daily_fee}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Recorded By</span>
                  <span className="font-medium">{bus.recorded_by || "System"}</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white hover:bg-gray-50 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-bcs-green hover:bg-bcs-green/90 text-white"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-white hover:bg-gray-50 border-bcs-green text-bcs-green border"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-white hover:bg-gray-50 border-red-500 text-red-500 border"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SleepBusDetails;
