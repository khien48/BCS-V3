
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  icon: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

const AnimatedIcon = ({ icon, isActive = false, className }: AnimatedIconProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200",
        isActive ? "bg-bcs-green text-white font-bold" : "text-gray-600 hover:bg-gray-100 hover:text-bcs-green hover:font-bold",
        className
      )}
    >
      {icon}
    </div>
  );
};

export default AnimatedIcon;
