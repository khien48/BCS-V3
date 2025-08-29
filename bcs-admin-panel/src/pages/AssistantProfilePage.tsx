
import React, { useState } from 'react';
import AssistantLayout from '../components/layouts/AssistantLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssistantProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    yourName: 'Mike Assitant',
    userName: 'Mike Assitant',
    email: 'assitant@bcs.com',
    role: 'Cashier',
    password: '**************',
    dateOfBirth: '25 January 1990',
    presentAddress: 'San Jose, California, USA',
    permanentAddress: 'San Jose',
    postalCode: '45962',
    city: 'San Jose'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully"
    });
    navigate('/assistant-admin/overview');
  };

  const handleCancel = () => {
    navigate('/assistant-admin/overview');
  };

  return (
    <AssistantLayout>
      <div className="bg-white rounded-xl shadow">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/cf783b74-6ef0-4c46-ac99-87bfd5d9f515.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="yourName">Your Name</Label>
                <Input 
                  id="yourName" 
                  name="yourName" 
                  value={formData.yourName} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full" 
                />
              </div>

              <div>
                <Label htmlFor="userName">User Name</Label>
                <Input 
                  id="userName" 
                  name="userName" 
                  value={formData.userName} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full" 
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full" 
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  name="role" 
                  value={formData.role} 
                  readOnly 
                  className="mt-1 w-full bg-gray-50" 
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password} 
                    className="mt-1 w-full" 
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Input 
                    id="dateOfBirth" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full pr-10" 
                  />
                  <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="presentAddress">Present Address</Label>
                <Input 
                  id="presentAddress" 
                  name="presentAddress" 
                  value={formData.presentAddress} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full" 
                />
              </div>

              <div>
                <Label htmlFor="permanentAddress">Permanent Address</Label>
                <Input 
                  id="permanentAddress" 
                  name="permanentAddress" 
                  value={formData.permanentAddress} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full" 
                />
              </div>

              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input 
                  id="postalCode" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full" 
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full" 
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                <Button 
                  type="button" 
                  onClick={handleCancel} 
                  variant="outline" 
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AssistantLayout>
  );
};

export default AssistantProfilePage;
