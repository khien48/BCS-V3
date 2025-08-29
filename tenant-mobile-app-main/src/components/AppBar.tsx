
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AppBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getTitle = (path: string) => {
    switch (path) {
      case "/":
        return "Home";
      case "/transactions":
        return "Transaction History";
      case "/account":
        return "Account";
      case "/transactions/filter":
        return "Request Transactions";
      default:
        return "";
    }
  };
  
  const showBackButton = location.pathname !== "/";
  
  return (
    <div className="pt-8 pb-4 flex flex-col items-center relative bg-white">
      {showBackButton && (
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="font-bold text-center text-base">
        {getTitle(location.pathname)}
      </h1>
    </div>
  );
};

export default AppBar;
