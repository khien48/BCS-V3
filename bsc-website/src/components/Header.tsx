import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ArrowDown, Route, Bus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
const moreItems = [{
  label: "Register as a Bus Operator",
  path: "/bus-operator-registration",
  icon: Bus,
  highlight: true
}, {
  label: "Application for Leasehold Tenancy",
  path: "/application-for-leasehold-tenancy"
}, {
  label: "Renewal of Lease Contract",
  path: "/renewal-of-lease-contract"
}];
const Header = () => {
  const [menuIconHover, setMenuIconHover] = useState(false);
  return <header className="bg-white shadow">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/364d80fc-70d5-4ec1-9a51-e210aa9ea024.png" alt="BCS Logo" className="h-10 w-auto transition-transform duration-300 hover:scale-105" />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/schedule" className="font-medium text-gray-800 hover:text-primary flex items-center gap-1">
              Trip Schedule
            </Link>
            <Link to="/bus-route" className="font-medium text-gray-800 hover:text-primary flex items-center gap-1">
              <Route className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
              Bus Route
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium text-gray-800 flex items-center gap-1 px-2 py-1 group hover:text-primary focus:outline-none" style={{
                boxShadow: "none"
              }}>
                  More
                  <span>
                    <ArrowDown size={18} className="ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 z-50 shadow-lg" align="end">
                {moreItems.map(item => <DropdownMenuItem key={item.label} className={`font-normal text-sm hover:bg-gray-100 cursor-pointer ${item.highlight ? 'text-primary font-medium' : ''}`} asChild={!!item.path}>
                    {item.path ? <Link to={item.path} className="flex items-center gap-2 w-full">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </Link> : item.label}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            
            
            {/* Register Bus Button */}
            <Link to="/bus-operator-registration">
              
            </Link>
          </nav>
          <div className="md:hidden">
            <button className="p-2" onMouseEnter={() => setMenuIconHover(true)} onMouseLeave={() => setMenuIconHover(false)}>
              <Menu className={`h-6 w-6 text-gray-700 transition-all duration-300 ${menuIconHover ? 'scale-110 rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;