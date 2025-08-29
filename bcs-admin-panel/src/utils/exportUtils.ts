
import { format } from 'date-fns';

interface ExportOptions {
  fileName: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface BusDataRow {
  plate_number: string;
  bus_name: string;
  route: string;
  daily_fee: number;
  days_parked?: number;
  total_fee?: number;
  date_time_parked: string;
}

export const exportToCSV = (data: BusDataRow[], options: ExportOptions) => {
  // Filter by date range if provided
  const filteredData = options.dateRange?.from 
    ? data.filter(row => {
        const rowDate = new Date(row.date_time_parked);
        if (options.dateRange?.from && rowDate < options.dateRange.from) return false;
        if (options.dateRange?.to && rowDate > options.dateRange.to) return false;
        return true;
      })
    : data;
    
  // Define CSV headers
  const headers = [
    'Plate Number',
    'Bus Name',
    'Route',
    'Days Parked',
    'Date Parked',
    'Daily Fee',
    'Total Fee',
  ];
  
  // Convert data to CSV format
  const csvRows = [
    headers.join(','), // Add header row
    ...filteredData.map(row => {
      const days = row.days_parked || 1;
      const totalFee = row.total_fee || (row.daily_fee * days);
      const dateParkd = format(new Date(row.date_time_parked), 'MMM dd, yyyy');
      
      return [
        `"${row.plate_number}"`,
        `"${row.bus_name}"`,
        `"${row.route}"`,
        days,
        `"${dateParkd}"`,
        row.daily_fee,
        totalFee,
      ].join(',');
    }),
  ];
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create a date string for the filename
  const dateStr = options.dateRange?.from 
    ? `_${format(options.dateRange.from, 'yyyyMMdd')}_to_${options.dateRange.to ? format(options.dateRange.to, 'yyyyMMdd') : 'present'}`
    : `_${format(new Date(), 'yyyyMMdd')}`;
    
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${options.fileName}${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
