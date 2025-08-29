
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BusOperator {
  id: string;
  name: string;
  busNumber: string;
  route: string;
  status: 'Active' | 'Inactive' | 'Pending';
  franchise: string;
  contact: string;
  email: string;
}

interface BusOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (operator: any) => void;
  operator: BusOperator | null;
  mode: 'add' | 'edit';
}

const BusOperatorModal: React.FC<BusOperatorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  operator,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    busPlateNumber: '',
    route: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Pending',
    franchise: '',
    contact: '',
    email: '',
    address: '',
    licenseNumber: '',
    dateRegistered: '',
    busImage: null as File | null
  });

  const routes = [
    'NAGA - IRIGA',
    'NAGA - LEGAZPI', 
    'NAGA - SIPOCOT'
  ];

  useEffect(() => {
    if (operator && mode === 'edit') {
      setFormData({
        name: operator.name,
        busPlateNumber: operator.busNumber,
        route: operator.route,
        status: operator.status,
        franchise: operator.franchise,
        contact: operator.contact,
        email: operator.email,
        address: '',
        licenseNumber: '',
        dateRegistered: '',
        busImage: null
      });
    } else {
      setFormData({
        name: '',
        busPlateNumber: '',
        route: '',
        status: 'Active',
        franchise: '',
        contact: '',
        email: '',
        address: '',
        licenseNumber: '',
        dateRegistered: '',
        busImage: null
      });
    }
  }, [operator, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      busImage: file
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Bus Operator' : 'Edit Bus Operator'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Operator Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter operator name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="busPlateNumber">Bus Plate Number *</Label>
              <Input
                id="busPlateNumber"
                value={formData.busPlateNumber}
                onChange={(e) => handleChange('busPlateNumber', e.target.value)}
                placeholder="Enter bus plate number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Route *</Label>
              <Select value={formData.route} onValueChange={(value) => handleChange('route', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route} value={route}>{route}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'Active' | 'Inactive' | 'Pending') => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                placeholder="Enter contact number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                placeholder="Enter license number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRegistered">Date Registered</Label>
              <Input
                id="dateRegistered"
                type="date"
                value={formData.dateRegistered}
                onChange={(e) => handleChange('dateRegistered', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="busImage">Bus Image</Label>
            <Input
              id="busImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {formData.busImage && (
              <p className="text-sm text-gray-500">Selected: {formData.busImage.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-bcs-green hover:bg-bcs-green/90 text-white">
              {mode === 'add' ? 'Add Operator' : 'Update Operator'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BusOperatorModal;
