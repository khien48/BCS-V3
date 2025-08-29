
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [applicantNo, setApplicantNo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicantNo || !password) {
      toast({
        title: "Login Failed",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would validate credentials here
    // For now, we'll just redirect to homepage
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img 
            src="/lovable-uploads/bc12c6f2-0a22-46ca-b545-a6befb045b6b.png" 
            alt="BCS Tenant Portal Logo" 
            className="w-32 h-32 mb-3" 
          />
          <h1 className="text-2xl font-semibold text-mainGreen text-center">BCS Tenant Portal</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Applicant No."
              value={applicantNo}
              onChange={(e) => setApplicantNo(e.target.value)}
              className="w-full bg-gray-100 rounded-md py-3"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 rounded-md py-3"
            />
          </div>

          <div className="text-right">
            <button type="button" className="text-gray-600 text-sm">
              Forgot your password?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-mainGreen hover:bg-mainGreen/90 py-6 rounded-md"
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
