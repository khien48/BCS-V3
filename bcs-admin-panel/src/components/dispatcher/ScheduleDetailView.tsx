import React from 'react';
import { Button } from '@/components/ui/button';
import { Schedule } from '@/types/schedule';
import { Edit, Trash2, Bus, MapPin, Clock, Hash, User, Calendar } from 'lucide-react';
interface ScheduleDetailViewProps {
  schedule: Schedule;
  onDelete: (id: string) => void;
  onEdit: (schedule: Schedule) => void;
  isLoading: boolean;
}
const ScheduleDetailView: React.FC<ScheduleDetailViewProps> = ({
  schedule,
  onDelete,
  onEdit,
  isLoading
}) => {
  return <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        
        <div>
          <h2 className="text-xl font-bold text-gray-800">Schedule Details</h2>
          <p className="text-gray-600 text-sm">Bus schedule information</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bus className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Bus Number</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{schedule.busNo}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Body Number</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{schedule.bodyNo}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Operator</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">{schedule.operator}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Bound</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{schedule.bound}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-600">Lane</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{schedule.lane}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Schedule Time</span>
          </div>
          <p className="text-lg font-semibold text-gray-800">{schedule.time} {schedule.timeType}</p>
        </div>

        {schedule.date && <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Date</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{schedule.date.toLocaleDateString()}</p>
          </div>}
      </div>

      <div className="flex gap-3 pt-6">
        <Button onClick={() => onEdit(schedule)} disabled={isLoading} className="flex-1 text-white flex items-center gap-2 bg-[#1f7f56]">
          <Edit className="h-4 w-4" />
          Edit Schedule
        </Button>
        <Button onClick={() => onDelete(schedule.id)} disabled={isLoading} variant="destructive" className="flex-1 flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Schedule
        </Button>
      </div>
    </div>;
};
export default ScheduleDetailView;