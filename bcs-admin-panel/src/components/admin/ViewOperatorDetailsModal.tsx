
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, Mail, MapPin, Calendar, FileText, Image } from 'lucide-react';

interface BusOperator {
  id: string;
  name: string;
  busNumber: string;
  route: string;
  status: 'Active' | 'Inactive' | 'Pending';
  franchise: string;
  contact: string;
  email: string;
  busImage?: string;
}

interface ViewOperatorDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: BusOperator | null;
}

const ViewOperatorDetailsModal: React.FC<ViewOperatorDetailsModalProps> = ({
  isOpen,
  onClose,
  operator
}) => {
  if (!operator) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'Inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bus Operator Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-bcs-green/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-bcs-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{operator.name}</h3>
                    <p className="text-gray-500">Bus Operator</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(operator.status)}
                  <p className="text-sm text-gray-500 mt-2">Plate #{operator.busNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bus Image */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Bus Image</h4>
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {operator.busImage ? (
                    <img 
                      src={operator.busImage} 
                      alt="Bus" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No image uploaded</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{operator.contact}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{operator.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">Route: {operator.route}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Information */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Business Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Franchise Status</label>
                  <p className="text-gray-800 mt-1">{operator.franchise}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">License Number</label>
                  <p className="text-gray-800 mt-1">LIC-{operator.busNumber}-2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-gray-800 mt-1">January 15, 2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Operator ID</label>
                  <p className="text-gray-800 mt-1">OP-{operator.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-3">
              <Button variant="outline" className="border-bcs-green text-bcs-green hover:bg-bcs-green/10">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            </div>
            <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOperatorDetailsModal;
