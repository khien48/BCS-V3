
import { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '@/types/auth';
import { getCurrentUser, setupAuthListener } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Subscription } from '@supabase/supabase-js';

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  isLoading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser()
      .then(data => {
        if (data?.profile) {
          setProfile(data.profile);
          
          // Redirect based on role
          if (data.profile.role === 'admin') {
            navigate('/admin');
          } else if (data.profile.role === 'cashier') {
            navigate('/cashier');
          } else {
            navigate('/dashboard');
          }
        }
      })
      .catch(err => {
        setError(err);
        toast({
          title: "Authentication Error",
          description: err.message,
          variant: "destructive"
        });
      })
      .finally(() => setIsLoading(false));

    // Store the subscription object
    const { subscription } = setupAuthListener((profile) => {
      setProfile(profile);
      setIsLoading(false);
    });

    // Return a cleanup function that unsubscribes when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ profile, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
