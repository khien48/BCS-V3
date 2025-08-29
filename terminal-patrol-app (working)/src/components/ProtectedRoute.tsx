
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session } = useAuth();
  const location = useLocation();
  
  // Check if we're still determining authentication status
  if (session === undefined) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-full max-w-md mb-4" />
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }
  
  if (!user) {
    // Redirect to auth page and remember where they were trying to go
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
