import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Home, Bus, BarChart2, LogOut, FileText, Settings } from 'lucide-react';
import { UserCredential } from '../../utils/auth';
import { useToast } from '@/components/ui/use-toast';
interface CashierLayoutProps {
  user: UserCredential | null;
  children: React.ReactNode;
}
const CashierLayout: React.FC<CashierLayoutProps> = ({
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
    // Navigate to login page after logout
    navigate('/');
  };
  return <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-white flex flex-col items-center py-8 border-r shadow-sm">
        <div className="flex flex-col items-center space-y-8">
          <Link to="/cashier" className={`p-3 rounded-xl ${isActive('/cashier') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Home className="w-6 h-6" />
          </Link>
          
          <Link to="/cashier/buses" className={`p-3 rounded-xl ${isActive('/cashier/buses') ? 'bg-bcs-green text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Bus className="w-6 h-6" />
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
            {isActive('/cashier') && 'Home'}
            {isActive('/cashier/buses') && 'Sleep Bus'}
            {isActive('/cashier/analytics') && 'Analytics'}
            {isActive('/cashier/profile') && 'Edit Profile'}
          </h1>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 rounded-full" size="icon">
              <FileText className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 rounded-full" size="icon">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Link to="/cashier/profile" className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'Adore, Joana B.'}</div>
                <div className="text-xs text-gray-500">Cashier</div>
              </div>
              <Avatar>
                <AvatarImage alt="User" src="/lovable-uploads/cf783b74-6ef0-4c46-ac99-87bfd5d9f515.png" />
                <AvatarFallback>{user?.name?.[0] || 'J'}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Content Area with proper overflow handling */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>;
};
export default CashierLayout;