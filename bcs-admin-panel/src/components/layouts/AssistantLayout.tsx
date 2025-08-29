
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Store, FileText, User, Edit, UserRound, LogOut, Home, UserPlus, Bus } from 'lucide-react';
import AnimatedIcon from '@/components/ui/animated-icon';
import { useToast } from '@/hooks/use-toast';

// Custom icon for article_person
const ArticlePerson = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <circle cx="12" cy="14" r="4"></circle>
    <path d="M12 13v2"></path>
    <path d="M12 17h.01"></path>
  </svg>
);

interface AssistantLayoutProps {
  children: React.ReactNode;
}

const AssistantLayout: React.FC<AssistantLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-20 bg-white flex flex-col items-center py-6 border-r shadow-sm">
        <div className="flex flex-col items-center space-y-8">
          {/* Home Icon */}
          <Link to="/assistant-admin/overview">
            <AnimatedIcon icon={<Home className="w-6 h-6" />} isActive={isActive('/assistant-admin/overview')} />
          </Link>
          
          {/* Stalls Icon */}
          <Link to="/assistant-admin/stalls">
            <AnimatedIcon icon={<Store className="w-6 h-6" />} isActive={isActive('/assistant-admin/stalls')} />
          </Link>
          
          {/* Account Circle Icon */}
          <Link to="/assistant-admin/accounts">
            <AnimatedIcon icon={<User className="w-6 h-6" />} isActive={isActive('/assistant-admin/accounts')} />
          </Link>
          
          {/* New Applicants Icon */}
          <Link to="/assistant-admin/new-applicants">
            <AnimatedIcon icon={<UserPlus className="w-6 h-6" />} isActive={isActive('/assistant-admin/new-applicants')} />
          </Link>
          
          {/* New Operators Icon */}
          <Link to="/assistant-admin/new-operators">
            <AnimatedIcon icon={<Bus className="w-6 h-6" />} isActive={isActive('/assistant-admin/new-operators')} />
          </Link>
          
          {/* Contract Edit Icon */}
          <Link to="/assistant-admin/contracts">
            <AnimatedIcon icon={<Edit className="w-6 h-6" />} isActive={isActive('/assistant-admin/contracts')} />
          </Link>
          
          {/* Face Icon */}
          <Link to="/assistant-admin/profile">
            <AnimatedIcon icon={<UserRound className="w-6 h-6" />} isActive={isActive('/assistant-admin/profile')} />
          </Link>
          
          {/* Article Person Icon - Updated to use custom icon */}
          <Link to="/assistant-admin/records">
            <AnimatedIcon icon={<ArticlePerson className="w-6 h-6" />} isActive={isActive('/assistant-admin/records')} />
          </Link>
          
          {/* Reports Icon */}
          <Link to="/assistant-admin/reports">
            <AnimatedIcon icon={<FileText className="w-6 h-6" />} isActive={isActive('/assistant-admin/reports')} />
          </Link>
        </div>

        <div className="mt-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white py-4 px-6 flex justify-between items-center border-b shadow-sm">
          <h1 className="text-2xl font-bold">
            {isActive('/assistant-admin/overview') && 'Dashboard Overview'}
            {isActive('/assistant-admin/stalls') && 'Stalls Management'}
            {isActive('/assistant-admin/accounts') && 'Applicants'}
            {isActive('/assistant-admin/new-applicants') && 'New Applicants'}
            {isActive('/assistant-admin/new-operators') && 'New Operators'}
            {isActive('/assistant-admin/contracts') && 'Renewal Contracts'}
            {isActive('/assistant-admin/profile') && 'Tenant Profile\'s'}
            {isActive('/assistant-admin/records') && 'Statement of The Account'}
            {isActive('/assistant-admin/reports') && 'Reports & Payment Tracking'}
            {isActive('/assistant-admin/profile/edit') && 'Edit Profile'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-gray-50 hover:bg-gray-100 rounded-full" size="icon">
              <FileText className="h-5 w-5 text-gray-600" />
            </Button>
            
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => navigate('/assistant-admin/profile/edit')}
            >
              <Avatar>
                <AvatarImage src="/lovable-uploads/cf783b74-6ef0-4c46-ac99-87bfd5d9f515.png" alt="User" />
                <AvatarFallback>JA</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Adore, Joana B.</div>
                <div className="text-xs text-gray-500">Assistant Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with proper spacing */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantLayout;
