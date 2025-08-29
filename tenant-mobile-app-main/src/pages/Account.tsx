import { useState } from "react";
import { ArrowLeft, FileText, CreditCard, Bell, ChevronRight, Home, Clock, User, HelpCircle, Info, LogOut, Store, FilePlus, FilePen, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      navigate("/");
    } else if (tab === "transaction") {
      navigate("/transactions");
    }
  };
  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been successfully logged out."
    });
    // Redirect to login page
    navigate("/login");
  };
  return <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-16">
        {/* Profile Card */}
        <Card className="mx-4 my-4 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4 border-4 border-white shadow">
                <AvatarImage alt="Profile" src="/lovable-uploads/148cc9ac-857c-4392-8e72-75d32c92bb50.png" />
                <AvatarFallback>RA</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-lg">Renier, Dis N.</h2>
                <p className="text-gray-500 text-sm">rainier.agapito@gmail.com</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </Card>

        {/* Account Options */}
        <div className="px-4 pt-4">
          <div className="space-y-4">
            <Card className="p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <FileText size={22} className="text-mainGreen" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Account Openning Form</h3>
                    <p className="text-gray-400 text-sm">Manage your stall</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Store size={22} className="text-mainGreen" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Apply for Stall</h3>
                    <p className="text-gray-400 text-sm">Submit a request to get a stall</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <FilePen size={22} className="text-mainGreen" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Renewal of Contract</h3>
                    <p className="text-gray-400 text-sm">Renew your existing stall contract</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Bug size={22} className="text-mainGreen" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Report Issue</h3>
                    <p className="text-gray-400 text-sm">Send a report issue</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Card>
          </div>
        </div>
        
        {/* More Section */}
        <div className="px-4 pt-6 pb-2">
          <h4 className="text-lg font-medium text-gray-800 mb-4">More</h4>
          <div className="space-y-4">
            <Card className="p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <HelpCircle size={22} className="text-mainGreen" />
                  </div>
                  <h3 className="font-medium text-base">Help & Support</h3>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Card>

            <Card className="p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Info size={22} className="text-mainGreen" />
                  </div>
                  <h3 className="font-medium text-base">About App</h3>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Card>
            
            <Card onClick={handleLogout} className="p-4 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 px-[16px] py-[16px] my-[30px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <LogOut size={22} className="text-mainGreen" />
                  </div>
                  <h3 className="font-medium text-base">Logout</h3>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Card>
          </div>
        </div>
      </div>

     {/* Bottom Navigation */}
      <div className="border-t border-gray-200 bg-white py-2">
        
        <div className="flex justify-around items-center">

             
         <div className="flex flex-col items-center py-2" onClick={() => navigate("/")}>
            <Home size={24} className="text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Home</span>
          </div>


           <div className="flex flex-col items-center py-2" onClick={() => navigate("/transactions")}>
            <Clock size={24} className="text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Transaction</span>
          </div>
          
        
           <div className="flex flex-col items-center py-2" onClick={() => navigate("/account")}>
            <User size={24} className="text-mainGreen" />
            <span className="text-xs text-mainGreen mt-1">Account</span>
          </div>

          
        </div>
        
      </div>
    </div>;
};
export default Account;