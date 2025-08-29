
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCredential } from '../utils/auth';
import { useToast } from "@/components/ui/use-toast";

interface DashboardProps {
  user: UserCredential | null;
}

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    // Route users based on their role
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'cashier':
        navigate('/cashier');
        break;
      case 'dispatcher':
        navigate('/dispatcher');
        break;
      case 'assistant':
        navigate('/assistant-admin/accounts');
        break;
      // Default stays on dashboard
    }

    toast({
      title: `Welcome, ${user.name}`,
      description: `You're logged in as ${getRoleDisplay()}`
    });
  }, [user, navigate]);

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'admin':
        return 'BCS Admin';
      case 'cashier':
        return 'BCS Cashier';
      case 'assistant':
        return 'BCS Admin Assistant';
      case 'dispatcher':
        return 'Terminal Operator';
      default:
        return 'Unknown Role';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="bg-bcs-green text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">BCS Portal</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white text-bcs-green rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
          <p className="text-gray-600">
            Redirecting you to the {getRoleDisplay()} portal...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
