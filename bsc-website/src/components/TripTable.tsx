
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export interface Trip {
  plateNumber: string;
  bodyNumber?: string;
  operator: string;
  lane?: string;
  route: string;
  departureTime: string;
  fare?: string;
  discountedFare?: string;
}
interface TripTableProps {
  trips: Trip[];
  isLoading?: boolean;
}
const TripTable: React.FC<TripTableProps> = ({
  trips,
  isLoading = false
}) => {
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-md p-8 text-center">
          <p className="text-gray-500">Loading trip schedules...</p>
        </div>
      </div>;
  }
  if (trips.length === 0) {
    return <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-md p-8 text-center">
          <p className="text-gray-500">No trips found matching your search criteria.</p>
        </div>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate Number</TableHead>
              <TableHead>Body Number</TableHead>
              <TableHead>Bus Operator</TableHead>
              <TableHead>Lane</TableHead>
              <TableHead>Routes</TableHead>
              <TableHead>Departure Time</TableHead>
              <TableHead>Fare</TableHead>
              <TableHead>Discounted Fare</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip, index) => <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium">{trip.plateNumber}</TableCell>
                <TableCell>{trip.bodyNumber || 'N/A'}</TableCell>
                <TableCell>{trip.operator}</TableCell>
                <TableCell>{trip.lane || 'N/A'}</TableCell>
                <TableCell>{trip.route}</TableCell>
                <TableCell>{trip.departureTime}</TableCell>
                <TableCell>{trip.fare || '₱50.00'}</TableCell>
                <TableCell>{trip.discountedFare || '₱40.00'}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    </div>;
};
export default TripTable;
