import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Home, Users, Bus, Building, BarChart2, Settings, LogOut, Bell, Calculator, MapPin, UserCheck } from 'lucide-react';
import { UserCredential } from '../../utils/auth';
import { useToast } from '@/components/ui/use-toast';
interface AdminLayoutProps {
  user: UserCredential | null;
  children: React.ReactNode;
}
const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  children
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate('/');
  };
  return <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-white flex flex-col items-center py-8 border-r shadow-sm">
        <div className="flex flex-col items-center space-y-8">
          <Link to="/admin" className={`p-3 rounded-xl ${isActive('/admin') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Home className="w-6 h-6" />
          </Link>
          
          
          
          <Link to="/admin/applicants" className={`p-3 rounded-xl ${isActive('/admin/applicants') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <UserCheck className="w-6 h-6" />
          </Link>
          
          <Link to="/admin/bus-operators" className={`p-3 rounded-xl ${isActive('/admin/bus-operators') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Bus className="w-6 h-6" />
          </Link>
          
          <Link to="/admin/fare-matrix" className={`p-3 rounded-xl ${isActive('/admin/fare-matrix') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Calculator className="w-6 h-6" />
          </Link>
          
          <Link to="/admin/route-map" className={`p-3 rounded-xl ${isActive('/admin/route-map') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <MapPin className="w-6 h-6" />
          </Link>
          
          <Link to="/admin/terminal" className={`p-3 rounded-xl ${isActive('/admin/terminal') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Building className="w-6 h-6" />
          </Link>
          
          <Link to="/admin/reports" className={`p-3 rounded-xl ${isActive('/admin/reports') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <BarChart2 className="w-6 h-6" />
          </Link>
          
          
        </div>

        <div className="mt-auto mb-4">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100" onClick={handleLogout}>
            <LogOut className="h-6 w-6 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white py-4 px-6 flex justify-between items-center border-b">
          <h1 className="text-2xl font-bold">
            {isActive('/admin') && 'Admin Dashboard'}
            {isActive('/admin/users') && 'User Management'}
            {isActive('/admin/applicants') && 'Applicants Management'}
            {isActive('/admin/bus-operators') && 'Bus Operators'}
            {isActive('/admin/fare-matrix') && 'Fare Matrix'}
            {isActive('/admin/route-map') && 'Route Map Management'}
            {isActive('/admin/terminal') && 'Terminal Management'}
            {isActive('/admin/reports') && 'Reports'}
            {isActive('/admin/settings') && 'Settings'}
          </h1>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 rounded-full" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <Avatar>
                <AvatarImage alt="Admin" />
                <AvatarFallback>{user?.name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>;
};
export default AdminLayout;