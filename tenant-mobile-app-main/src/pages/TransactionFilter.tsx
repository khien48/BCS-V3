
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import AppBar from "@/components/AppBar";
import { format } from "date-fns";

const TransactionFilter = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = () => {
    if (startDate && endDate) {
      navigate("/transactions", {
        state: {
          startDate,
          endDate
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <AppBar />
      
      <div className="flex-1 px-6 pb-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Transaction history request</h2>
          <p className="text-gray-600 mb-4">
            Your transaction history will be sent to your email address.
            Not your email address? Update your profile.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Date Range</h3>
            <p className="text-gray-500 text-sm mb-4">
              Tell us the dates to be included in your transaction history.
              All transactions are in PH time (GMT+8).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <div className="border rounded-lg p-4 mb-4">
              {startDate ? (
                <div 
                  className="cursor-pointer"
                  onClick={() => setStartDate(undefined)}
                >
                  {format(startDate, "MMMM d, yyyy")}
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="w-full"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <div className="border rounded-lg p-4 mb-4">
              {endDate ? (
                <div 
                  className="cursor-pointer"
                  onClick={() => setEndDate(undefined)}
                >
                  {format(endDate, "MMMM d, yyyy")}
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="w-full"
                />
              )}
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!startDate || !endDate} 
            className="w-full py-6 text-lg bg-emerald-800 hover:bg-emerald-700"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter;
