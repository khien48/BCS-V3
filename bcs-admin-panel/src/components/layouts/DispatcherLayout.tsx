import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, AlertTriangle, LogOut, FileText, Settings, Bell, Package } from 'lucide-react';
import { UserCredential } from '../../utils/auth';
import AnimatedIcon from '@/components/ui/animated-icon';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
interface DispatcherLayoutProps {
  user: UserCredential | null;
}
const DispatcherLayout = ({
  user
}: DispatcherLayoutProps) => {
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
    // Navigate to login page after logout
    navigate('/');
  };
  return <div className="flex h-screen overflow-hidden bg-gray-50 font-poppins">
      {/* Sidebar - Enhanced with better spacing and visual hierarchy */}
      <div className="w-20 bg-white flex flex-col items-center py-8 border-r shadow-sm">
        
        
        <div className="flex flex-col items-center space-y-8">
          <Link to="/dispatcher" className="group">
            <AnimatedIcon icon={<Calendar className="w-6 h-6" />} isActive={isActive('/dispatcher')} />
            <span className={`absolute left-20 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}>
              Schedule List
            </span>
          </Link>
          
          <Link to="/dispatcher/inventory" className="group">
            <AnimatedIcon icon={<Package className="w-6 h-6" />} isActive={isActive('/dispatcher/inventory')} />
            <span className={`absolute left-20 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}>
              Inventory
            </span>
          </Link>
          
          <Link to="/dispatcher/complaints" className="group">
            <AnimatedIcon icon={<AlertTriangle className="w-6 h-6" />} isActive={isActive('/dispatcher/complaints')} />
            <span className={`absolute left-20 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}>
              Report Complain
            </span>
          </Link>
        </div>

        <div className="mt-auto">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Enhanced with shadows and better spacing */}
        <header className="bg-white py-4 px-8 flex justify-between items-center border-b shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            {isActive('/dispatcher') && 'Schedule List'}
            {isActive('/dispatcher/inventory') && 'Transport Inventory'}
            {isActive('/dispatcher/buses') && 'Sleep Bus'}
            {isActive('/dispatcher/analytics') && 'Analytics'}
            {isActive('/dispatcher/profile') && 'Edit Profile'}
            {isActive('/dispatcher/complaints') && 'Report Complain'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-gray-50 hover:bg-gray-100 rounded-full relative group" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center p-0 rounded-full">
                3
              </Badge>
            </Button>
            
            <Button variant="outline" className="bg-gray-50 hover:bg-gray-100 rounded-full" size="icon">
              <FileText className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Button variant="outline" className="bg-gray-50 hover:bg-gray-100 rounded-full" size="icon">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Link to="/dispatcher/profile" className="flex items-center space-x-3 hover:bg-gray-50 rounded-full p-1 transition-colors">
              <Avatar className="border-2 border-gray-100">
                <AvatarImage alt="User" src="/lovable-uploads/c159a3bb-2490-4829-b5ab-b319622b123f.png" />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'Adore, Joana B.'}</div>
                <div className="text-xs text-gray-500">Terminal Operator</div>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area with proper overflow handling */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>;
};
export default DispatcherLayout;