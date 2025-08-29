import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCredential } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Pencil, ChevronDown, Eye, EyeOff } from 'lucide-react';
interface ProfilePageProps {
  user: UserCredential | null;
}
const DispatcherProfilePage: React.FC<ProfilePageProps> = ({
  user
}) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [formData, setFormData] = useState({
    yourName: user?.name || 'Adote, Joana B.',
    userName: user?.name || 'Adote, Joana B.',
    email: user?.email || 'joanadore@gmail.com',
    role: 'Terminal Operator',
    password: '**************',
    newPassword: '',
    confirmPassword: '',
    dateOfBirth: '25 January 1990',
    presentAddress: 'San Jose, California, USA',
    permanentAddress: 'San Jose',
    postalCode: '45962',
    city: 'San Jose'
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully"
    });
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  const handlePasswordClick = () => {
    if (isEditing) {
      setShowPasswordDialog(true);
    }
  };
  return <div className="p-6">
      <div className="bg-white rounded-xl shadow p-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden">
                <img alt="Profile" className="w-full h-full object-cover" src="/lovable-uploads/d3e2a9de-0954-45da-a1bb-1d2d2bee7624.png" />
              </div>
              
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="yourName">Your Name</Label>
                <Input id="yourName" name="yourName" value={formData.yourName} onChange={handleInputChange} className="mt-1 w-full" readOnly={!isEditing} />
              </div>
              
              <div>
                <Label htmlFor="userName">User Name</Label>
                <Input id="userName" name="userName" value={formData.userName} onChange={handleInputChange} className="mt-1 w-full" readOnly={!isEditing} />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full" readOnly={!isEditing} />
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" value={formData.role} readOnly className="mt-1 w-full bg-gray-50" />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} readOnly className="mt-1 w-full cursor-pointer" onClick={handlePasswordClick} />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Input id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="mt-1 w-full pr-10" readOnly={!isEditing} />
                  <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="presentAddress">Present Address</Label>
                <Input id="presentAddress" name="presentAddress" value={formData.presentAddress} onChange={handleInputChange} className="mt-1 w-full" readOnly={!isEditing} />
              </div>
              
              <div>
                <Label htmlFor="permanentAddress">Permanent Address</Label>
                <Input id="permanentAddress" name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} className="mt-1 w-full" readOnly={!isEditing} />
              </div>
              
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="mt-1 w-full" readOnly={!isEditing} />
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 w-full" readOnly={!isEditing} />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-4">
                <Button type="button" onClick={toggleEdit} className="text-white px-8 bg-bcs-green">
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                <Button type="submit" disabled={!isEditing} className="text-white px-8 bg-bcs-green">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>;
};
export default DispatcherProfilePage;