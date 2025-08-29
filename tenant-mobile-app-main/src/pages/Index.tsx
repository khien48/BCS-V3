import { useState } from "react";
import { Home, Clock, User, Bell, Wallet, Banknote, Zap, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  // Mock transactions data
  const transactions = [{
    location: "CBD Terminal",
    date: "05 August",
    time: "10:00AM",
    amount: -2000
  }, {
    location: "CBD Terminal",
    date: "01 June",
    time: "8:00AM",
    amount: -1500
  }, {
    location: "CBD Terminal",
    date: "01 June",
    time: "8:00AM",
    amount: -1500
  }];
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Add navigation logic if needed
    if (tab === "transaction") {
      navigate("/transactions");
    } else if (tab === "account") {
      navigate("/account");
    }
  };
  return <div className="flex flex-col h-screen bg-white">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto pb-16">
        {/* Profile Header */}
        <div className="px-6 pt-6 pb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white mr-4">
                <img alt="Profile" className="h-full w-full object-cover" src="/lovable-uploads/93050ae7-970c-449a-856f-08e6fd019cf9.png" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Renier, Dis N.</h2>
                <p className="text-gray-600">Tenant</p>
              </div>
            </div>
            <div className="relative">
              <Bell size={24} className="text-mainGreen animate-bell" />
              <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">7</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 w-full"></div>

        {/* Balance Card */}
        <div className="mx-6 mt-6 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Monthly Dues</p>
              <h1 className="text-4xl font-bold flex items-center">
                ₱ 2,751
              </h1>
            </div>
            <button className="bg-payBtn text-mainGreen px-5 py-3 rounded-lg font-medium flex items-center">
              <Wallet className="mr-2" size={20} />
              Pay now
            </button>
          </div>
        </div>

        {/* Due date */}
        <div className="mx-6 mt-5 flex justify-between items-center">
          <p className="text-gray-500">Due Date</p>
          <div className="flex items-center">
            <p className="font-medium">February 06, 2025</p>
            <div className="ml-3 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
              <Clock className="text-mainGreen" size={16} />
            </div>
          </div>
        </div>

        {/* Bills Section */}
        <div className="mx-6 mt-5 grid grid-cols-2 gap-4">
          {/* Monthly Bill */}
          <div className="bg-cardBg p-5 rounded-2xl flex items-center space-x-4">
            <div>
              <Banknote className="text-mainGreen" size={24} />
            </div>
            <div>
              <p className="font-bold text-xl">₱2151</p>
              <p className="text-gray-500 text-sm">Monthly Bill</p>
            </div>
          </div>
          
          {/* Power Bill */}
          <div className="bg-cardBg p-5 rounded-2xl flex items-center space-x-4">
            <div>
              <Zap className="text-mainGreen" size={24} />
            </div>
            <div>
              <p className="font-bold text-xl">₱300</p>
              <p className="text-gray-500 text-sm">Power Bill</p>
            </div>
          </div>
          
          {/* Arrears */}
          <div className="bg-cardBg p-5 rounded-2xl flex items-center space-x-4">
            <div>
              <Banknote className="text-mainGreen" size={24} />
            </div>
            <div>
              <p className="font-bold text-xl">₱100</p>
              <p className="text-gray-500 text-sm">Arrears</p>
            </div>
          </div>
          
          {/* Penalty */}
          <div className="bg-cardBg p-5 rounded-2xl flex items-center space-x-4">
            <div>
              <AlertCircle className="text-mainGreen" size={24} />
            </div>
            <div>
              <p className="font-bold text-xl">₱0</p>
              <p className="text-gray-500 text-sm">Penalty</p>
            </div>
          </div>
        </div>

        {/* Transactions section */}
        <div className="mx-6 mt-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">Recent Transaction</h2>
            <button className="text-mainGreen font-medium flex items-center" onClick={() => navigate("/transactions")}>
              See all
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>

          {/* Transaction list */}
          <div className="space-y-5">
            {transactions.map((transaction, index) => <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-cardBg flex items-center justify-center mr-4">
                    <Clock className="text-mainGreen" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.location}</p>
                    <p className="text-gray-500 text-sm">
                      {transaction.date}, {transaction.time}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-mainGreen">
                  - ₱{Math.abs(transaction.amount)}
                </p>
              </div>)}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 bg-white py-2">
        
        <div className="flex justify-around items-center">
          
        
          <div className="flex flex-col items-center py-2" onClick={() => navigate("/")}>
            <Home size={24} className="text-mainGreen" />
            <span className="text-xs text-mainGreen mt-1">Home</span>
          </div>

           <div className="flex flex-col items-center py-2" onClick={() => navigate("/transactions")}>
            <Clock size={24} className="text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Transaction</span>
          </div>
          
          <div className="flex flex-col items-center py-2" onClick={() => navigate("/account")}>
            <User size={24} className="text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Account</span>
          </div>
          
        </div>
        
      </div>
    </div>;
};
export default Index;