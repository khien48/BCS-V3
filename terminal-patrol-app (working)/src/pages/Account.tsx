
import { HelpCircle, Info, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const Account = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error('Error loading profile: ' + error.message);
          return;
        }
        
        setProfile(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error('Unexpected error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pb-24">
        <div className="flex flex-col items-center pt-8">
          <Skeleton className="w-48 h-12 mb-4" />
          <Skeleton className="w-24 h-24 rounded-full mb-4" />
          <Skeleton className="h-8 w-48 mb-1" />
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="w-full space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pb-24 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-4">There was a problem loading your profile.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-24">
      <div className="flex flex-col items-center pt-8">
        <img 
          src="/lovable-uploads/c6a0641c-de51-4ebd-bb60-ddc95e93d065.png" 
          alt="Bicol Central Station Logo" 
          className="h-16 mb-4"
        />
        
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={profile.profile_picture || undefined} />
          <AvatarFallback>{`${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`}</AvatarFallback>
        </Avatar>
        
        <h1 className="text-2xl font-bold mb-1 uppercase">
          {`${profile.first_name || ''} ${profile.last_name || ''}`}
        </h1>
        
        <p className="text-gray-400 mb-4">{profile.role}</p>
        
        <Button 
          variant="outline" 
          className="bg-mint hover:bg-mint/90 text-foreground mb-8 rounded-full px-8"
        >
          Edit Profile
        </Button>

        <div className="w-full max-w-md space-y-4">
          <Card className="rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              <Link to="#" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F3F1] flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-[#208056]" />
                  </div>
                  <span className="font-medium">Help & Support</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                </svg>
              </Link>

              <Link to="#" className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F3F1] flex items-center justify-center">
                    <Info className="w-5 h-5 text-[#208056]" />
                  </div>
                  <span className="font-medium">About App</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
                </svg>
              </Link>
            </div>
          </Card>

          <Card className="rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F3F1] flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-[#208056]" />
                </div>
                <span className="font-medium">Logout</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"/>
              </svg>
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Account;
