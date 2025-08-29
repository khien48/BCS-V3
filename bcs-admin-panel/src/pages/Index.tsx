
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { authenticateUser, UserCredential } from '../utils/auth';
import { useToast } from '@/hooks/use-toast';

interface IndexProps {
  onLogin: (user: UserCredential) => void;
}

const Index = ({ onLogin }: IndexProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (email: string, password: string, selectedRole: string) => {
    const user = authenticateUser(email, password);
    
    if (user && user.role === selectedRole) {
      onLogin(user);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'cashier') {
        navigate('/cashier');
      } else if (user.role === 'dispatcher') {
        navigate('/dispatcher');
      } else if (user.role === 'assistant') {
        navigate('/assistant-admin/overview');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email, password, or role selection.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/lovable-uploads/c783ea26-96fe-4d20-bf04-a197fec00cf4.png"
            alt="BCS Logo"
            className="h-24 w-24 mb-4"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-bcs-green">
            BCS PORTAL
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w-xs">
            Please enter your username and password to continue.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Index;
