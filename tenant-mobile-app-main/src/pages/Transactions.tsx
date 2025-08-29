import { useState, useEffect } from "react";
import { Clock, Home, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Group transactions by date
const groupTransactionsByDate = transactions => {
  const grouped = {};
  transactions.forEach(transaction => {
    const date = transaction.displayDate;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  return grouped;
};

const Transactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentDate = new Date();
  const formattedDate = `As of ${currentDate.toLocaleString('default', {
    month: 'short'
  })} ${currentDate.getDate()},${currentDate.getFullYear()}`;

  const [date, setDate] = useState<Date>();

  // Mock transactions with display dates for grouping
  const allTransactions = [{
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "Feb 10, 2025"
  }, {
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "Feb 10, 2025"
  }, {
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "Feb 10, 2025"
  }, {
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "January 6, 2025"
  }, {
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "January 6, 2025"
  }, {
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "December 19, 2024"
  }, {
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "December 19, 2024"
  }, {
    location: "Bills Payment",
    date: "05 August",
    time: "10:00AM",
    amount: -2000,
    displayDate: "December 19, 2024"
  }];

  // Filter transactions based on date range from location state
  const filteredTransactions = location.state?.startDate && location.state?.endDate
    ? allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.displayDate);
        return transactionDate >= location.state.startDate && 
               transactionDate <= location.state.endDate;
      })
    : allTransactions;

  // Group transactions by date
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  return (
    <div className="flex flex-col h-screen bg-white">
      <AppBar />

      {/* Date and Filter */}
      <div className="px-6 py-2 flex justify-between items-center">
        <h2 className="text-base font-medium">{formattedDate}</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/transactions/filter")}
          className="focus:bg-transparent active:bg-transparent"
        >
          <span className="material-symbols-outlined">manage_search</span>
        </Button>
      </div>
      
      <Separator className="mt-1" />

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map((date, dateIndex) => (
            <div key={dateIndex} className="mb-4">
              <h3 className="px-6 py-4 font-bold text-base">{date}</h3>
              
              {groupedTransactions[date].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between px-6 py-2 mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full border border-mainGreen flex items-center justify-center mr-4">
                      <Clock className="text-mainGreen" size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-base">{transaction.location}</p>
                      <p className="text-gray-500 text-sm">
                        {transaction.date}, {transaction.time}
                      </p>
                    </div>
                  </div>
                  <p className="text-mainGreen font-bold">
                    - ₱{Math.abs(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            No transactions found for selected date
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 bg-white py-2">
        
        <div className="flex justify-around items-center">
          
          <div className="flex flex-col items-center py-2" onClick={() => navigate("/")}>
            <Home size={24} className="text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Home</span>
          </div>
          
          <div className="flex flex-col items-center py-2" onClick={() => navigate("/transactions")}>
            <Clock size={24} className="text-mainGreen" />
            <span className="text-xs text-mainGreen mt-1">Transaction</span>
          </div>
          
          <div className="flex flex-col items-center py-2" onClick={() => navigate("/account")}>
            <User size={24} className="text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Account</span>
          </div>
          
        </div>
        
      </div>
      
    </div>
  );
};

export default Transactions;
