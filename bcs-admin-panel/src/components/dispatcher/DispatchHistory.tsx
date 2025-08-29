import React, { useState, useEffect } from 'react';
import { Clock, History, Search, CalendarDays, Bus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DispatchHistory } from '@/types/schedule';
import DateRangeFilter from '@/components/DateRangeFilter';
interface DispatchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}
const DispatchHistoryComponent: React.FC<DispatchHistoryProps> = ({
  isOpen,
  onClose
}) => {
  const [dispatchHistory, setDispatchHistory] = useState<DispatchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  useEffect(() => {
    if (isOpen) {
      fetchDispatchHistory();
    }
  }, [isOpen]);
  const fetchDispatchHistory = async () => {
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('dispatch_history').select('*').order('dispatched_at', {
        ascending: false
      });
      if (error) throw error;
      if (data) {
        const formattedHistory: DispatchHistory[] = data.map(record => ({
          id: record.id,
          schedule_id: record.schedule_id,
          bus_no: record.bus_no,
          body_no: record.body_no || '',
          operator: record.operator,
          bound: record.bound,
          lane: record.lane || '',
          time: record.time,
          time_type: record.time_type as 'AM' | 'PM',
          dispatched_at: record.dispatched_at,
          dispatched_by: record.dispatched_by
        }));
        setDispatchHistory(formattedHistory);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching dispatch history",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
  };
  const filteredHistory = dispatchHistory.filter(record => {
    const matchesSearch = record.bus_no.toLowerCase().includes(searchTerm.toLowerCase()) || record.operator.toLowerCase().includes(searchTerm.toLowerCase()) || record.bound.toLowerCase().includes(searchTerm.toLowerCase());
    let withinDateRange = true;
    if (dateRange.from || dateRange.to) {
      const dispatchDate = new Date(record.dispatched_at);
      if (dateRange.from && dispatchDate < dateRange.from) withinDateRange = false;
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (dispatchDate > endDate) withinDateRange = false;
      }
    }
    return matchesSearch && withinDateRange;
  });
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dispatch History</h2>
              <p className="text-gray-600">View all dispatched buses</p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-full">
            ✕
          </Button>
        </div>

        <div className="p-6 border-b">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search by bus number, operator, or bound" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
          </div>
        </div>

        <div className="overflow-auto max-h-[60vh]">
          {isLoading ? <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div> : filteredHistory.length === 0 ? <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No dispatch history found</p>
            </div> : <div className="p-6">
              <div className="grid gap-4">
                {filteredHistory.map(record => <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <Bus className="h-4 w-4 text-blue-600 bg-[1F7F56]" />
                          <span className="font-semibold text-gray-800">{record.bus_no}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Body:</span> {record.body_no}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Operator:</span> {record.operator}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{record.bound}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Lane:</span> {record.lane}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <Clock className="h-3 w-3" />
                          <span>{record.time} {record.time_type}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(record.dispatched_at).toLocaleDateString()} at {new Date(record.dispatched_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default DispatchHistoryComponent;