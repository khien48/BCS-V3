
import { Bus, Plus, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const activeClass = "text-[#208056]";
  const inactiveClass = "text-gray-400";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-8">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link to="/" className="flex flex-col items-center">
          <Bus size={24} className={location.pathname === "/" ? activeClass : inactiveClass} />
          <span className={`text-xs mt-1 ${location.pathname === "/" ? activeClass : inactiveClass}`}>Sleep Bus</span>
        </Link>
        <Link to="/add" className="flex flex-col items-center">
          <Plus size={24} className={location.pathname === "/add" ? activeClass : inactiveClass} />
          <span className={`text-xs mt-1 ${location.pathname === "/add" ? activeClass : inactiveClass}`}>Add</span>
        </Link>
        <Link to="/account" className="flex flex-col items-center">
          <User size={24} className={location.pathname === "/account" ? activeClass : inactiveClass} />
          <span className={`text-xs mt-1 ${location.pathname === "/account" ? activeClass : inactiveClass}`}>Account</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
