
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  busType: string;
  route: string;
  days: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isVisible, onClose, onApply, onReset }) => {
  const [filters, setFilters] = useState<FilterValues>({
    busType: '',
    route: '',
    days: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({
      busType: '',
      route: '',
      days: '',
    });
    onReset();
  };

  if (!isVisible) return null;

  return (
    <div className="mt-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">Filter Options</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-2 text-gray-600">Bus Type</label>
          <select 
            name="busType"
            value={filters.busType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 bg-white"
          >
            <option value="">All</option>
            <option value="RAYMOND">RAYMOND</option>
            <option value="ISAROG">ISAROG</option>
            <option value="DBT">DBT</option>
            <option value="EXPRESS">EXPRESS</option>
            <option value="PENAFRANCIA">PENAFRANCIA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-600">Route</label>
          <select 
            name="route"
            value={filters.route}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 bg-white"
          >
            <option value="">All</option>
            <option value="LEGAZPE">LEGAZPE</option>
            <option value="RAGAY">RAGAY</option>
            <option value="DAET">DAET</option>
            <option value="PILI">PILI</option>
            <option value="MANILA">MANILA</option>
            <option value="PAMPLONA">PAMPLONA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-600">Days</label>
          <select 
            name="days"
            value={filters.days}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 bg-white"
          >
            <option value="">All</option>
            <option value="1">1 Day</option>
            <option value="2">2 Days</option>
            <option value="3+">3+ Days</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          className="mr-2 border-gray-300"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          className="bg-bcs-green hover:bg-bcs-green/90"
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
