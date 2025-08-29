
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import RoleSelect from './RoleSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  onLogin: (email: string, password: string, role: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Please select an account type",
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Authentication process
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email, password, selectedRole);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md font-poppins">
      <div className="mb-6">
        <RoleSelect selectedRole={selectedRole} onRoleSelect={setSelectedRole} />
      </div>

      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border-gray-200 bg-slate-50 focus:ring-bcs-green focus:border-bcs-green font-poppins"
        />
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-gray-200 bg-slate-50 focus:ring-bcs-green focus:border-bcs-green font-poppins"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-5 bg-bcs-green hover:bg-bcs-green/90 text-white font-medium rounded-md font-poppins"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Sample credentials:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Admin: admin@bcs.com / admin123</li>
          <li>Cashier: cashier@bcs.com / cashier123</li>
          <li>Assistant: assistant@bcs.com / assistant123</li>
          <li>Dispatcher: dispatcher@bcs.com / dispatcher123</li>
        </ul>
      </div>
    </form>
  );
};

export default LoginForm;
