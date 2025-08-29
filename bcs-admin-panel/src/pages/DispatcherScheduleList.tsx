import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader, X, SlidersHorizontal, ChevronLeft, ChevronRight, Send, History, Bus, MapPin, Clock } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ScheduleDetailView from '@/components/dispatcher/ScheduleDetailView';
import ScheduleForm from '@/components/dispatcher/ScheduleForm';
import DispatchHistory from '@/components/dispatcher/DispatchHistory';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Schedule, DbSchedule } from '@/types/schedule';
import { supabase } from "@/integrations/supabase/client";

const DispatcherScheduleList = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [totalDispatched, setTotalDispatched] = useState(0);
  const [onQueue, setOnQueue] = useState(0);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
    fetchDispatchCount();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bus_schedules')
        .select('*')
        .returns<DbSchedule[]>();

      if (error) {
        throw error;
      }

      if (data) {
        const formattedSchedules: Schedule[] = data.map(schedule => ({
          id: schedule.id,
          busNo: schedule.bus_no,
          bodyNo: schedule.body_no || '',
          operator: schedule.operator,
          bound: schedule.bound,
          lane: schedule.lane || '',
          time: schedule.time,
          timeType: schedule.time_type as 'AM' | 'PM',
          date: schedule.date ? new Date(schedule.date) : undefined,
        }));
        
        setSchedules(formattedSchedules);
        setOnQueue(formattedSchedules.length);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching schedules",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDispatchCount = async () => {
    try {
      const { count, error } = await supabase
        .from('dispatch_history')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalDispatched(count || 0);
    } catch (error: any) {
      console.error('Error fetching dispatch count:', error);
    }
  };

  const handleDispatch = async (schedule: Schedule) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('dispatch_history')
        .insert({
          schedule_id: schedule.id,
          bus_no: schedule.busNo,
          body_no: schedule.bodyNo,
          operator: schedule.operator,
          bound: schedule.bound,
          lane: schedule.lane,
          time: schedule.time,
          time_type: schedule.timeType,
          dispatched_at: new Date().toISOString(),
          dispatched_by: 'current_user' // This should be replaced with actual user ID
        });

      if (error) throw error;

      // Remove from schedules list
      setSchedules(schedules.filter(s => s.id !== schedule.id));
      
      // Delete from bus_schedules table
      await supabase
        .from('bus_schedules')
        .delete()
        .eq('id', schedule.id);

      setTotalDispatched(prev => prev + 1);
      toast({
        title: "Bus Dispatched Successfully",
        description: `Bus ${schedule.busNo} has been dispatched to ${schedule.bound}`
      });
    } catch (error: any) {
      toast({
        title: "Error dispatching bus",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.busNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          schedule.operator.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          schedule.bound.toLowerCase().includes(searchTerm.toLowerCase());

    // Time type filter
    if (filterType === "AM") {
      return matchesSearch && schedule.timeType === "AM";
    } else if (filterType === "PM") {
      return matchesSearch && schedule.timeType === "PM";
    } else if (filterType === "LEGAZPI" || filterType === "RAGAY" || filterType === "DAET" || 
              filterType === "PILI" || filterType === "GOA") {
      return matchesSearch && schedule.bound === filterType;
    }

    return matchesSearch;
  });

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setEditMode(false);
    setIsViewOpen(true);
  };

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setEditMode(false);
    setIsAddOpen(true);
  };

  const handleDeleteSchedule = async (id: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('bus_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSchedules(schedules.filter(schedule => schedule.id !== id));
      setIsViewOpen(false);
      toast({
        title: "Success",
        description: "Schedule deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditMode(true);
    setSelectedSchedule(schedule);
    setIsViewOpen(false);
    setIsAddOpen(true);
  };

  const handleSaveSchedule = async (schedule: Schedule) => {
    setIsLoading(true);

    try {
      if (editMode && selectedSchedule) {
        const { error } = await supabase
          .from('bus_schedules')
          .update({
            bus_no: schedule.busNo,
            body_no: schedule.bodyNo,
            operator: schedule.operator,
            bound: schedule.bound,
            lane: schedule.lane,
            time: schedule.time,
            time_type: schedule.timeType,
            date: schedule.date?.toISOString()
          })
          .eq('id', schedule.id);

        if (error) throw error;

        setSchedules(schedules.map(s => s.id === schedule.id ? schedule : s));
        toast({
          title: "Success",
          description: "Schedule updated successfully"
        });
      } else {
        const { data, error } = await supabase
          .from('bus_schedules')
          .insert({
            bus_no: schedule.busNo,
            body_no: schedule.bodyNo,
            operator: schedule.operator,
            bound: schedule.bound,
            lane: schedule.lane,
            time: schedule.time,
            time_type: schedule.timeType,
            date: schedule.date?.toISOString()
          })
          .select()
          .single();

        if (error) throw error;

        const newSchedule: Schedule = {
          id: data.id,
          busNo: data.bus_no,
          bodyNo: data.body_no,
          operator: data.operator,
          bound: data.bound,
          lane: data.lane,
          time: data.time,
          timeType: data.time_type as 'AM' | 'PM',
          date: data.date ? new Date(data.date) : undefined,
        };

        setSchedules([...schedules, newSchedule]);
        toast({
          title: "Success",
          description: "Schedule added successfully"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsAddOpen(false);
    }
  };

  const handleFilter = (type: string | null) => {
    setFilterType(type);
    toast({
      title: type ? `Filtered by ${type}` : "All schedules",
      description: type ? `Showing ${type} schedules` : "Showing all schedules"
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Update statistics
  useEffect(() => {
    setOnQueue(schedules.length);
  }, [schedules]);

  const getFilterDisplayText = () => {
    if (!filterType) return "";
    if (filterType === "AM" || filterType === "PM") {
      return `(${filterType} Schedules)`;
    }
    return `(${filterType} Bound)`;
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule List</h1>
        <p className="text-gray-600">Monitor and manage all busses</p>
      </div>

      {/* Enhanced Statistics cards matching the image design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Dispatched Bus</p>
              <p className="text-3xl font-bold text-gray-900">{totalDispatched}</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <Bus className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">On Queue</p>
              <p className="text-3xl font-bold text-gray-900">{onQueue}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Bus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setIsHistoryOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Dispatch History</p>
              <p className="text-3xl font-bold text-gray-900">123</p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <History className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and actions bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm">
            <div className="pl-5 pr-2 py-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by bus number, operator, or bound" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="flex-1 py-3 pr-10 outline-none border-none text-sm" 
            />
            {searchTerm && (
              <button 
                className="absolute right-5 top-1/2 -translate-y-1/2" 
                onClick={clearSearch}
              >
                <div className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <X className="h-3 w-3" />
                </div>
              </button>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full flex gap-2 items-center px-5 py-3 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm font-medium">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuLabel>Filter by Time</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleFilter(null)}>
              All Schedules
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("AM")}>
              Morning Schedules (AM)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("PM")}>
              Afternoon Schedules (PM)
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Bound</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleFilter("LEGAZPI")}>
              LEGAZPI
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("RAGAY")}>
              RAGAY
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("DAET")}>
              DAET
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("PILI")}>
              PILI
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("GOA")}>
              GOA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={handleAddSchedule} 
          className="bg-bcs-green text-white hover:bg-bcs-green/90 rounded-full flex gap-2 items-center px-5 py-3 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Schedule</span>
        </Button>
      </div>

      {/* Enhanced Schedule table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <h2 className="text-xl font-bold px-8 pt-6 pb-4 text-gray-800 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-bcs-green" />
          Schedule Queue
          {filterType && (
            <span className="text-sm font-medium text-gray-500 ml-2">
              {getFilterDisplayText()}
            </span>
          )}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <Bus className="h-4 w-4" />
                    Bus No.
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Body No.</th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Operator</th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Bound
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Lane</th>
                <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-gray-600 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-10 text-center">
                    <div className="flex justify-center">
                      <Loader className="h-8 w-8 animate-spin text-bcs-green" />
                    </div>
                    <p className="mt-3 text-gray-500 font-medium">Loading schedules...</p>
                  </td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-10 text-center">
                    <div className="flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a7 7 0 110-14 7 7 0 010 14z" />
                      </svg>
                    </div>
                    <p className="mt-3 text-gray-500 font-medium">No schedules found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map(schedule => (
                  <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="inline-flex py-2 px-3 bg-blue-50 rounded-full text-blue-700 font-semibold text-sm">
                        {schedule.busNo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium">{schedule.bodyNo}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{schedule.operator}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                        {schedule.bound}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium">{schedule.lane}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-bcs-green font-semibold flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {schedule.time} {schedule.timeType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button 
                          onClick={() => handleViewDetails(schedule)} 
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-md text-sm"
                        >
                          View
                        </Button>
                        <Button 
                          onClick={() => handleDispatch(schedule)} 
                          className="bg-bcs-green hover:bg-bcs-green/90 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" />
                          Dispatch
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-8 py-5 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredSchedules.length}</span> schedules
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white" disabled>
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </button>
            <span className="text-sm font-medium bg-bcs-green text-white h-8 w-8 rounded-full flex items-center justify-center">1</span>
            <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white" disabled>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-lg">
          {selectedSchedule && (
            <ScheduleDetailView 
              schedule={selectedSchedule} 
              onDelete={handleDeleteSchedule} 
              onEdit={handleEditSchedule} 
              isLoading={isLoading} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ScheduleForm 
            schedule={selectedSchedule} 
            onSave={handleSaveSchedule}
            onCancel={() => setIsAddOpen(false)}
            editMode={editMode} 
            isLoading={isLoading} 
          />
        </DialogContent>
      </Dialog>

      <DispatchHistory 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </div>
  );
};

export default DispatcherScheduleList;
