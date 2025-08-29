
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bus, Plus } from 'lucide-react';

const AddNewBusPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    busName: '',
    plateNumber: '',
    route: '',
    capacity: '',
    busType: '',
    operator: '',
    status: 'active',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.busName || !formData.plateNumber || !formData.route) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to database
    console.log('New bus data:', formData);
    
    toast({
      title: "Success",
      description: "New bus has been added to the inventory"
    });
    
    // Navigate back or reset form
    navigate('/dispatcher');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dispatcher')}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Bus</h1>
            <p className="text-gray-600">Add a new bus to the terminal inventory</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Bus Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="busName">Bus Name *</Label>
                <Input
                  id="busName"
                  value={formData.busName}
                  onChange={(e) => handleInputChange('busName', e.target.value)}
                  placeholder="Enter bus name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plateNumber">Plate Number *</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                  placeholder="Enter plate number"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route *</Label>
                <Input
                  id="route"
                  value={formData.route}
                  onChange={(e) => handleInputChange('route', e.target.value)}
                  placeholder="Enter route"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="Enter passenger capacity"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="busType">Bus Type</Label>
                <Select onValueChange={(value) => handleInputChange('busType', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select bus type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Bus</SelectItem>
                    <SelectItem value="aircon">Air-conditioned Bus</SelectItem>
                    <SelectItem value="deluxe">Deluxe Bus</SelectItem>
                    <SelectItem value="mini">Mini Bus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operator">Operator</Label>
                <Input
                  id="operator"
                  value={formData.operator}
                  onChange={(e) => handleInputChange('operator', e.target.value)}
                  placeholder="Enter operator name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter any additional notes or remarks"
                rows={4}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" className="flex-1 md:flex-none md:px-8">
                <Plus className="h-4 w-4 mr-2" />
                Add Bus
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dispatcher')}
                className="flex-1 md:flex-none md:px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewBusPage;
